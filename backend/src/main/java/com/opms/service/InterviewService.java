package com.opms.service;

import com.opms.dto.InterviewDto;
import com.opms.dto.InterviewScheduleRequest;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ApplicationService applicationService;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public InterviewService(InterviewRepository interviewRepository,
                            ApplicationRepository applicationRepository,
                            UserRepository userRepository,
                            StudentRepository studentRepository,
                            ApplicationService applicationService,
                            NotificationService notificationService,
                            AuditLogService auditLogService) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.applicationService = applicationService;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public InterviewDto scheduleInterview(Long applicationId, InterviewScheduleRequest request, User companyUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + applicationId));

        if (application.getStatus() != ApplicationStatus.SHORTLISTED &&
            application.getStatus() != ApplicationStatus.UNDER_REVIEW &&
            application.getStatus() != ApplicationStatus.INTERVIEW_SCHEDULED) {
            throw new BadRequestException("Application must be SHORTLISTED before scheduling an interview");
        }

        InterviewType type = InterviewType.ONLINE;
        if (request.getInterviewType() != null) {
            try { type = InterviewType.valueOf(request.getInterviewType().toUpperCase()); } catch (Exception ignored) {}
        }

        Interview interview = Interview.builder()
                .application(application)
                .roundName(request.getRoundName())
                .interviewType(type)
                .scheduledDate(request.getScheduledDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .meetingLink(request.getMeetingLink())
                .location(request.getLocation())
                .interviewer(request.getInterviewer())
                .notes(request.getNotes())
                .status(InterviewStatus.SCHEDULED)
                .result(InterviewResult.PENDING)
                .build();

        Interview saved = interviewRepository.save(interview);

        // Update application status to INTERVIEW_SCHEDULED
        applicationService.updateStatus(applicationId, ApplicationStatus.INTERVIEW_SCHEDULED,
                "Interview scheduled: " + request.getRoundName() + " on " + request.getScheduledDate(), companyUser);

        // Audit log
        auditLogService.log(companyUser, "INTERVIEW_SCHEDULED",
                "Scheduled interview for student " + application.getStudent().getStudentName() + " [Round: " + request.getRoundName() + "]");

        // Notify Student
        notificationService.notify(application.getStudent().getUser(), "Interview Scheduled",
                "Your interview for '" + application.getDrive().getTitle() + "' (" + request.getRoundName() + ") is scheduled for " + request.getScheduledDate(),
                "INTERVIEW", "INTERVIEW", saved.getId());

        return mapToDto(saved);
    }

    @Transactional
    public InterviewDto updateResult(Long interviewId, String resultStr, String statusStr, User companyUser) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found: " + interviewId));

        if (resultStr != null) {
            InterviewResult result = InterviewResult.valueOf(resultStr.toUpperCase());
            interview.setResult(result);
            if (result == InterviewResult.PASSED) {
                interview.setStatus(InterviewStatus.COMPLETED);
                // Update application status to INTERVIEWED or SELECTED
                applicationService.updateStatus(interview.getApplication().getId(), ApplicationStatus.INTERVIEWED,
                        "Interview passed: " + interview.getRoundName(), companyUser);
            } else if (result == InterviewResult.FAILED) {
                interview.setStatus(InterviewStatus.COMPLETED);
                applicationService.updateStatus(interview.getApplication().getId(), ApplicationStatus.REJECTED,
                        "Interview rejected: " + interview.getRoundName(), companyUser);
            }
        }

        if (statusStr != null) {
            interview.setStatus(InterviewStatus.valueOf(statusStr.toUpperCase()));
        }

        Interview saved = interviewRepository.save(interview);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<InterviewDto> getStudentInterviews(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return interviewRepository.findByStudentOrderByScheduledDateDesc(student).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterviewDto> getCompanyInterviews(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Company company = applicationRepository.findAll().stream()
                .filter(a -> a.getDrive().getCompany().getUser() != null && a.getDrive().getCompany().getUser().getId().equals(user.getId()))
                .map(a -> a.getDrive().getCompany())
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        return interviewRepository.findByCompanyOrderByScheduledDateDesc(company).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InterviewDto> getAllInterviews() {
        return interviewRepository.findAllByOrderByScheduledDateDesc().stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    public InterviewDto mapToDto(Interview i) {
        Application a = i.getApplication();
        return InterviewDto.builder()
                .id(i.getId())
                .applicationId(a.getId())
                .studentName(a.getStudent().getStudentName())
                .registerNumber(a.getStudent().getRegisterNumber())
                .driveTitle(a.getDrive().getTitle())
                .companyName(a.getDrive().getCompany().getCompanyName())
                .roundName(i.getRoundName())
                .interviewType(i.getInterviewType().name())
                .scheduledDate(i.getScheduledDate())
                .startTime(i.getStartTime())
                .endTime(i.getEndTime())
                .meetingLink(i.getMeetingLink())
                .location(i.getLocation())
                .interviewer(i.getInterviewer())
                .notes(i.getNotes())
                .status(i.getStatus().name())
                .result(i.getResult().name())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
