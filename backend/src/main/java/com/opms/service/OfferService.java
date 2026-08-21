package com.opms.service;

import com.opms.dto.OfferCreateRequest;
import com.opms.dto.OfferDto;
import com.opms.dto.PlacementDto;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OfferService {

    private final OfferRepository offerRepository;
    private final PlacementRepository placementRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ApplicationService applicationService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public OfferService(OfferRepository offerRepository,
                        PlacementRepository placementRepository,
                        ApplicationRepository applicationRepository,
                        UserRepository userRepository,
                        StudentRepository studentRepository,
                        ApplicationService applicationService,
                        NotificationService notificationService,
                        AuditLogService auditLogService) {
        this.offerRepository = offerRepository;
        this.placementRepository = placementRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.applicationService = applicationService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public OfferDto generateOffer(Long applicationId, OfferCreateRequest request, User companyUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        if (offerRepository.findByApplication(application).isPresent()) {
            throw new BadRequestException("Offer has already been generated for this application");
        }

        Student student = application.getStudent();
        long existingOfferCount = offerRepository.findByStudentOrderByCreatedAtDesc(student).size();
        if (existingOfferCount >= 3) {
            throw new BadRequestException("Candidate '" + student.getStudentName() + "' has already reached the maximum placement limit of 3 job offers.");
        }

        String offerNo = "OFFER-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Offer offer = Offer.builder()
                .application(application)
                .offerNumber(offerNo)
                .jobRole(request.getJobRole())
                .ctc(request.getCtc())
                .joiningDate(request.getJoiningDate())
                .joiningLocation(request.getJoiningLocation())
                .offerLetterUrl(request.getOfferLetterUrl())
                .issuedAt(LocalDateTime.now())
                .status(OfferStatus.SENT)
                .build();

        Offer saved = offerRepository.save(offer);

        // Update application status to OFFERED
        applicationService.updateStatus(applicationId, ApplicationStatus.OFFERED,
                "Offer letter generated: " + request.getJobRole() + " (Package: ₹" + request.getCtc() + " LPA)", companyUser);

        // Audit log
        auditLogService.log(companyUser, "OFFER_GENERATED",
                "Offer letter issued to " + application.getStudent().getStudentName() + " [Offer No: " + offerNo + "]");

        // Notify Student
        notificationService.notify(application.getStudent().getUser(), "Job Offer Received!",
                "Congratulations! You received an offer letter for '" + request.getJobRole() + "' at " + application.getDrive().getCompany().getCompanyName() + ".",
                "OFFER", "OFFER", saved.getId());

        return mapToDto(saved);
    }

    @Transactional
    public OfferDto respondToOffer(Long offerId, String response, String comment, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer not found: " + offerId));

        if (!offer.getApplication().getStudent().getId().equals(student.getId())) {
            throw new BadRequestException("You are not authorized to respond to this offer");
        }

        if (offer.getStatus() == OfferStatus.ACCEPTED || offer.getStatus() == OfferStatus.DECLINED) {
            throw new BadRequestException("Offer response has already been submitted");
        }

        boolean accept = "ACCEPT".equalsIgnoreCase(response) || "ACCEPTED".equalsIgnoreCase(response);

        if (accept) {
            offer.setStatus(OfferStatus.ACCEPTED);
            offer.setStudentResponse(comment != null ? comment : "Accepted by student");
            offerRepository.save(offer);

            // Update application status to OFFER_ACCEPTED & PLACED
            applicationService.updateStatus(offer.getApplication().getId(), ApplicationStatus.OFFER_ACCEPTED,
                    "Student accepted the offer", user);
            applicationService.updateStatus(offer.getApplication().getId(), ApplicationStatus.PLACED,
                    "Student officially placed at " + offer.getApplication().getDrive().getCompany().getCompanyName(), user);

            // Create Placement Record
            if (!placementRepository.existsByStudent(student)) {
                Placement placement = Placement.builder()
                        .student(student)
                        .company(offer.getApplication().getDrive().getCompany())
                        .drive(offer.getApplication().getDrive())
                        .application(offer.getApplication())
                        .offer(offer)
                        .jobRole(offer.getJobRole())
                        .packageAmount(offer.getCtc())
                        .joiningDate(offer.getJoiningDate())
                        .placementDate(LocalDate.now())
                        .build();
                placementRepository.save(placement);
            }

            auditLogService.log(user, "OFFER_ACCEPTED", "Student " + student.getStudentName() + " ACCEPTED offer from " + offer.getApplication().getDrive().getCompany().getCompanyName());

            // Notify company
            if (offer.getApplication().getDrive().getCompany().getUser() != null) {
                notificationService.notify(offer.getApplication().getDrive().getCompany().getUser(),
                        "Offer Accepted!",
                        student.getStudentName() + " has ACCEPTED your job offer for " + offer.getJobRole() + ".",
                        "OFFER_ACCEPTED", "OFFER", offer.getId());
            }
        } else {
            offer.setStatus(OfferStatus.DECLINED);
            offer.setStudentResponse(comment != null ? comment : "Declined by student");
            offerRepository.save(offer);

            applicationService.updateStatus(offer.getApplication().getId(), ApplicationStatus.OFFER_DECLINED,
                    "Student declined the offer", user);

            auditLogService.log(user, "OFFER_DECLINED", "Student " + student.getStudentName() + " DECLINED offer from " + offer.getApplication().getDrive().getCompany().getCompanyName());
        }

        return mapToDto(offer);
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getStudentOffers(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return offerRepository.findByStudentOrderByCreatedAtDesc(student).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getCompanyOffers(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Company company = applicationRepository.findAll().stream()
                .filter(a -> a.getDrive().getCompany().getUser() != null && a.getDrive().getCompany().getUser().getId().equals(user.getId()))
                .map(a -> a.getDrive().getCompany())
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        return offerRepository.findByCompanyOrderByCreatedAtDesc(company).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OfferDto> getAllOffers() {
        return offerRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlacementDto> getAllPlacements() {
        return placementRepository.findAllByOrderByPlacementDateDesc().stream()
                .map(this::mapPlacementToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlacementDto getStudentPlacement(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return placementRepository.findByStudent(student)
                .map(this::mapPlacementToDto).orElse(null);
    }

    public OfferDto mapToDto(Offer o) {
        Application a = o.getApplication();
        return OfferDto.builder()
                .id(o.getId())
                .applicationId(a.getId())
                .studentName(a.getStudent().getStudentName())
                .registerNumber(a.getStudent().getRegisterNumber())
                .studentEmail(a.getStudent().getEmail())
                .companyName(a.getDrive().getCompany().getCompanyName())
                .driveTitle(a.getDrive().getTitle())
                .offerNumber(o.getOfferNumber())
                .jobRole(o.getJobRole())
                .ctc(o.getCtc())
                .joiningDate(o.getJoiningDate())
                .joiningLocation(o.getJoiningLocation())
                .offerLetterUrl(o.getOfferLetterUrl())
                .issuedAt(o.getIssuedAt())
                .status(o.getStatus().name())
                .studentResponse(o.getStudentResponse())
                .createdAt(o.getCreatedAt())
                .build();
    }

    public PlacementDto mapPlacementToDto(Placement p) {
        return PlacementDto.builder()
                .id(p.getId())
                .studentId(p.getStudent().getId())
                .studentName(p.getStudent().getStudentName())
                .registerNumber(p.getStudent().getRegisterNumber())
                .departmentName(p.getStudent().getDepartment() != null ? p.getStudent().getDepartment().getDepartmentName() : null)
                .companyName(p.getCompany().getCompanyName())
                .companyLogoUrl(p.getCompany().getLogoUrl())
                .driveTitle(p.getDrive().getTitle())
                .jobRole(p.getJobRole())
                .packageAmount(p.getPackageAmount())
                .joiningDate(p.getJoiningDate())
                .placementDate(p.getPlacementDate())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
