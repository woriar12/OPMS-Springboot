package com.opms.service;

import com.opms.dto.ApplicationCreateRequest;
import com.opms.dto.ApplicationDto;
import com.opms.dto.ApplicationStatusHistoryDto;
import com.opms.dto.StudentDashboardStatsDto;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final PlacementDriveRepository driveRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final EligibilityService eligibilityService;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final AuditLogService auditLogService;
    private final PlacementRepository placementRepository;
    private final OfferRepository offerRepository;
    private final InterviewRepository interviewRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              ApplicationStatusHistoryRepository statusHistoryRepository,
                              PlacementDriveRepository driveRepository,
                              StudentRepository studentRepository,
                              UserRepository userRepository,
                              EligibilityService eligibilityService,
                              NotificationService notificationService,
                              EmailService emailService,
                              AuditLogService auditLogService,
                              PlacementRepository placementRepository,
                              OfferRepository offerRepository,
                              InterviewRepository interviewRepository) {
        this.applicationRepository = applicationRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.driveRepository = driveRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.eligibilityService = eligibilityService;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.auditLogService = auditLogService;
        this.placementRepository = placementRepository;
        this.offerRepository = offerRepository;
        this.interviewRepository = interviewRepository;
    }

    @Transactional
    public ApplicationDto applyForDrive(Long driveId, String username, ApplicationCreateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found: " + driveId));

        // 1. Check drive status
        if (drive.getStatus() != DriveStatus.ACTIVE && drive.getStatus() != DriveStatus.APPROVED) {
            throw new BadRequestException("This placement drive is not currently open for applications");
        }

        // 2. Check application deadline
        if (drive.getApplicationDeadline() != null && LocalDate.now().isAfter(drive.getApplicationDeadline())) {
            throw new BadRequestException("Application deadline has passed for this drive");
        }

        // 3. Re-check Higher Package Placement Policy
        List<Offer> existingOffers = offerRepository.findByStudentOrderByCreatedAtDesc(student);
        Double maxOfferCtc = existingOffers.stream()
                .filter(o -> o.getStatus() != OfferStatus.DECLINED && o.getStatus() != OfferStatus.EXPIRED)
                .map(Offer::getCtc)
                .filter(java.util.Objects::nonNull)
                .max(Double::compareTo)
                .orElse(0.0);

        if (maxOfferCtc > 0.0) {
            Double drivePackage = drive.getSalaryMax() != null ? drive.getSalaryMax()
                    : (drive.getSalaryMin() != null ? drive.getSalaryMin() : 0.0);

            if (drivePackage > 0.0 && drivePackage <= maxOfferCtc) {
                throw new BadRequestException("You cannot apply for drives offering ₹" + drivePackage + " LPA as you already hold a job offer of ₹" + maxOfferCtc + " LPA. Placement policy allows applying only for higher package drives (> ₹" + maxOfferCtc + " LPA).");
            }
        }

        if (!eligibilityService.isEligible(student, drive)) {
            throw new BadRequestException("You do not meet the eligibility criteria for this placement drive");
        }

        // 4. Check duplicate application
        if (applicationRepository.existsByStudentAndDrive(student, drive)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied for this placement drive.");
        }

        String resumeUrl = (request != null && request.getResumeUrl() != null && !request.getResumeUrl().isBlank())
                ? request.getResumeUrl() : student.getResumeUrl();

        if (resumeUrl == null || resumeUrl.isBlank()) {
            throw new BadRequestException("Please add/upload your Resume in your Profile page before applying for placement drives.");
        }

        Application application = Application.builder()
                .student(student)
                .drive(drive)
                .appliedAt(LocalDateTime.now())
                .status(ApplicationStatus.APPLIED)
                .coverLetter(request != null ? request.getCoverLetter() : null)
                .resumeSnapshotUrl(resumeUrl)
                .build();

        Application saved = applicationRepository.save(application);

        // Record history
        recordHistory(saved, ApplicationStatus.APPLIED, "Student submitted application", user);

        // Audit log
        auditLogService.log(user, "APPLICATION_SUBMITTED",
                "Student " + student.getStudentName() + " applied to drive: " + drive.getTitle());

        // Notifications
        notificationService.notify(user, "Application Submitted",
                "Your application for '" + drive.getTitle() + "' at " + drive.getCompany().getCompanyName() + " has been submitted.",
                "APPLICATION", "APPLICATION", saved.getId());

        // Notify company user if exists
        if (drive.getCompany().getUser() != null) {
            notificationService.notify(drive.getCompany().getUser(), "New Application",
                    student.getStudentName() + " applied for your drive: " + drive.getTitle(),
                    "NEW_APPLICATION", "APPLICATION", saved.getId());
        }

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getMyApplications(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return applicationRepository.findByStudentOrderByAppliedAtDesc(student).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentDashboardStatsDto getStudentDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        long eligibleCount = eligibilityService.getEligibleDrivesForStudent(username).size();
        long appliedCount = applicationRepository.countByStudent(student);
        long shortlistedCount = applicationRepository.countByStudentAndStatusIn(student,
                List.of(ApplicationStatus.SHORTLISTED, ApplicationStatus.INTERVIEW_SCHEDULED, ApplicationStatus.INTERVIEWED, ApplicationStatus.SELECTED, ApplicationStatus.OFFERED, ApplicationStatus.OFFER_ACCEPTED, ApplicationStatus.PLACED));
        long interviewCount = interviewRepository.findByStudentOrderByScheduledDateDesc(student).size();
        long offerCount = offerRepository.findByStudentOrderByCreatedAtDesc(student).size();
        boolean isPlaced = placementRepository.existsByStudent(student);

        String placedCompany = null;
        Double placedPackage = null;
        if (isPlaced) {
            Placement p = placementRepository.findByStudent(student).orElse(null);
            if (p != null) {
                placedCompany = p.getCompany().getCompanyName();
                placedPackage = p.getPackageAmount();
            }
        }

        return StudentDashboardStatsDto.builder()
                .eligibleDrives(eligibleCount)
                .appliedDrives(appliedCount)
                .shortlisted(shortlistedCount)
                .interviews(interviewCount)
                .offers(offerCount)
                .isPlaced(isPlaced)
                .placedCompany(placedCompany)
                .placedPackage(placedPackage)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getCompanyApplications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Company company = driveRepository.findAll().stream()
                .filter(d -> d.getCompany().getUser() != null && d.getCompany().getUser().getId().equals(user.getId()))
                .map(PlacementDrive::getCompany)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found for user: " + username));

        return applicationRepository.findByCompanyOrderByAppliedAtDesc(company).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ApplicationDto getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + id));
        return mapToDto(app);
    }

    @Transactional
    public ApplicationDto updateStatus(Long applicationId, ApplicationStatus newStatus, String comment, User changedByUser) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        app.setStatus(newStatus);
        Application saved = applicationRepository.save(app);

        recordHistory(saved, newStatus, comment, changedByUser);

        // Notify Student via in-app notification
        notificationService.notify(app.getStudent().getUser(),
                "Application Status Update",
                "Your application for '" + app.getDrive().getTitle() + "' status changed to: " + newStatus.name().replace('_', ' '),
                "APPLICATION_STATUS", "APPLICATION", app.getId());

        // Asynchronous Email Notification to Student
        CompletableFuture.runAsync(() -> {
            try {
                String studentEmail = app.getStudent().getEmail();
                String studentName = app.getStudent().getStudentName();
                Company company = app.getDrive().getCompany();
                String hrEmail = company != null ? company.getHrEmail() : null;
                String hrContactPerson = company != null ? company.getHrContactPerson() : null;
                String companyName = company != null ? company.getCompanyName() : "Company";
                String driveTitle = app.getDrive().getTitle();
                String jobRole = app.getDrive().getJobRole();

                if (newStatus == ApplicationStatus.SHORTLISTED) {
                    emailService.sendStudentShortlistedNotification(studentEmail, studentName, companyName, driveTitle, jobRole, hrEmail, hrContactPerson);
                } else if (newStatus == ApplicationStatus.INTERVIEW_SCHEDULED) {
                    emailService.sendInterviewScheduledNotification(studentEmail, studentName, companyName, driveTitle, comment, hrEmail, hrContactPerson);
                } else if (newStatus == ApplicationStatus.OFFERED || newStatus == ApplicationStatus.SELECTED) {
                    emailService.sendStudentOfferedNotification(studentEmail, studentName, companyName, driveTitle, comment, hrEmail, hrContactPerson);
                }
            } catch (Exception ignored) {}
        });

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationStatusHistoryDto> getApplicationHistory(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));
        return statusHistoryRepository.findByApplicationOrderByCreatedAtAsc(app).stream()
                .map(h -> new ApplicationStatusHistoryDto(
                        h.getId(),
                        h.getStatus().name(),
                        h.getComment(),
                        h.getChangedBy() != null ? h.getChangedBy().getUsername() : "SYSTEM",
                        h.getCreatedAt()
                )).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAllByOrderByAppliedAtDesc().stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    private void recordHistory(Application app, ApplicationStatus status, String comment, User user) {
        ApplicationStatusHistory history = new ApplicationStatusHistory(app, status, comment, user);
        statusHistoryRepository.save(history);
    }

    public ApplicationDto mapToDto(Application app) {
        Student s = app.getStudent();
        PlacementDrive d = app.getDrive();
        Company c = d.getCompany();

        return ApplicationDto.builder()
                .id(app.getId())
                .studentId(s.getId())
                .studentName(s.getStudentName())
                .registerNumber(s.getRegisterNumber())
                .rollNumber(s.getRollNumber())
                .departmentName(s.getDepartment() != null ? s.getDepartment().getDepartmentName() : null)
                .departmentCode(s.getDepartment() != null ? s.getDepartment().getDepartmentCode() : null)
                .cgpa(s.getCgpa())
                .activeBacklogs(s.getActiveBacklogs())
                .studentEmail(s.getEmail())
                .resumeUrl(s.getResumeUrl())
                .driveId(d.getId())
                .driveTitle(d.getTitle())
                .jobRole(d.getJobRole())
                .companyId(c.getId())
                .companyName(c.getCompanyName())
                .companyLogoUrl(c.getLogoUrl())
                .appliedAt(app.getAppliedAt())
                .status(app.getStatus().name())
                .coverLetter(app.getCoverLetter())
                .resumeSnapshotUrl(app.getResumeSnapshotUrl())
                .createdAt(app.getCreatedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
