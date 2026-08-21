package com.opms.service;

import com.opms.dto.DriveCreateRequest;
import com.opms.dto.DriveDecisionDto;
import com.opms.dto.PlacementDriveDto;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final PlacementDriveDepartmentRepository driveDeptRepository;
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public PlacementDriveService(PlacementDriveRepository driveRepository,
                                 PlacementDriveDepartmentRepository driveDeptRepository,
                                 CompanyRepository companyRepository,
                                 DepartmentRepository departmentRepository,
                                 UserRepository userRepository,
                                 AuditLogService auditLogService,
                                 NotificationService notificationService) {
        this.driveRepository = driveRepository;
        this.driveDeptRepository = driveDeptRepository;
        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional
    public PlacementDriveDto createDrive(String username, DriveCreateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        if (company.getStatus() != CompanyStatus.APPROVED) {
            throw new BadRequestException("Only approved companies can create drives");
        }

        if (request.getApplicationDeadline() != null && request.getApplicationStartDate() != null
                && request.getApplicationDeadline().isBefore(request.getApplicationStartDate())) {
            throw new BadRequestException("Application deadline cannot be before start date");
        }

        PlacementDrive drive = PlacementDrive.builder()
                .company(company)
                .title(request.getTitle())
                .jobRole(request.getJobRole())
                .description(request.getDescription())
                .industry(request.getIndustry())
                .jobType(request.getJobType())
                .location(request.getLocation())
                .workMode(request.getWorkMode())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .salaryDescription(request.getSalaryDescription())
                .applicationStartDate(request.getApplicationStartDate())
                .applicationDeadline(request.getApplicationDeadline())
                .driveDate(request.getDriveDate())
                .minimumCgpa(request.getMinimumCgpa() != null ? request.getMinimumCgpa() : 0.0)
                .maximumBacklogs(request.getMaximumBacklogs() != null ? request.getMaximumBacklogs() : 0)
                .graduationBatch(request.getGraduationBatch())
                .requiredSkills(request.getRequiredSkills())
                .status(DriveStatus.DRAFT)
                .build();

        PlacementDrive saved = driveRepository.save(drive);

        // Save department mappings
        if (request.getDepartmentIds() != null) {
            for (Long deptId : request.getDepartmentIds()) {
                Department dept = departmentRepository.findById(deptId)
                        .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + deptId));
                driveDeptRepository.save(new PlacementDriveDepartment(saved, dept));
            }
        }

        auditLogService.log(user, "DRIVE_CREATED", "Company created drive: " + request.getTitle());
        return mapToDto(saved);
    }

    @Transactional
    public PlacementDriveDto updateDrive(Long driveId, String username, DriveCreateRequest request) {
        PlacementDrive drive = getDriveForCompany(driveId, username);

        if (request.getTitle() != null) drive.setTitle(request.getTitle());
        if (request.getJobRole() != null) drive.setJobRole(request.getJobRole());
        if (request.getDescription() != null) drive.setDescription(request.getDescription());
        if (request.getIndustry() != null) drive.setIndustry(request.getIndustry());
        if (request.getJobType() != null) drive.setJobType(request.getJobType());
        if (request.getLocation() != null) drive.setLocation(request.getLocation());
        if (request.getWorkMode() != null) drive.setWorkMode(request.getWorkMode());
        if (request.getSalaryMin() != null) drive.setSalaryMin(request.getSalaryMin());
        if (request.getSalaryMax() != null) drive.setSalaryMax(request.getSalaryMax());
        if (request.getSalaryDescription() != null) drive.setSalaryDescription(request.getSalaryDescription());
        if (request.getApplicationStartDate() != null) drive.setApplicationStartDate(request.getApplicationStartDate());
        if (request.getApplicationDeadline() != null) drive.setApplicationDeadline(request.getApplicationDeadline());
        if (request.getDriveDate() != null) drive.setDriveDate(request.getDriveDate());
        if (request.getMinimumCgpa() != null) drive.setMinimumCgpa(request.getMinimumCgpa());
        if (request.getMaximumBacklogs() != null) drive.setMaximumBacklogs(request.getMaximumBacklogs());
        if (request.getGraduationBatch() != null) drive.setGraduationBatch(request.getGraduationBatch());
        if (request.getRequiredSkills() != null) drive.setRequiredSkills(request.getRequiredSkills());

        // Update department mappings
        if (request.getDepartmentIds() != null) {
            driveDeptRepository.deleteByDrive(drive);
            driveDeptRepository.flush();
            for (Long deptId : request.getDepartmentIds().stream().distinct().toList()) {
                Department dept = departmentRepository.findById(deptId)
                        .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + deptId));
                driveDeptRepository.save(new PlacementDriveDepartment(drive, dept));
            }
        }

        // If re-submitting a rejected drive, reset status to DRAFT
        if (drive.getStatus() == DriveStatus.REJECTED) {
            drive.setStatus(DriveStatus.DRAFT);
            drive.setRejectionReason(null);
        }

        PlacementDrive updated = driveRepository.save(drive);
        return mapToDto(updated);
    }

    @Transactional
    public PlacementDriveDto updateDriveDepartmentsByOfficer(Long driveId, List<Long> departmentIds, User officerUser) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found: " + driveId));

        driveDeptRepository.deleteByDrive(drive);
        driveDeptRepository.flush();

        if (departmentIds != null) {
            List<Long> distinctIds = departmentIds.stream().distinct().toList();
            for (Long deptId : distinctIds) {
                Department dept = departmentRepository.findById(deptId)
                        .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + deptId));
                driveDeptRepository.save(new PlacementDriveDepartment(drive, dept));
            }
        }

        PlacementDrive updated = driveRepository.save(drive);
        auditLogService.log(officerUser, "OFFICER_UPDATE_DRIVE_DEPTS",
                "Officer updated department mappings for drive: " + drive.getTitle());
        return mapToDto(updated);
    }

    @Transactional
    public PlacementDriveDto submitDrive(Long driveId, String username) {
        PlacementDrive drive = getDriveForCompany(driveId, username);

        if (drive.getStatus() != DriveStatus.DRAFT) {
            throw new BadRequestException("Only DRAFT drives can be submitted");
        }

        drive.setStatus(DriveStatus.PENDING_APPROVAL);
        PlacementDrive saved = driveRepository.save(drive);

        User companyUser = userRepository.findByUsername(username).orElseThrow();
        auditLogService.log(companyUser, "DRIVE_SUBMITTED", "Company submitted drive for approval: " + drive.getTitle());

        // Notify all officers
        notifyAllOfficers("New Drive Approval Request",
                drive.getCompany().getCompanyName() + " submitted a drive: " + drive.getTitle(),
                "PLACEMENT_DRIVE", drive.getId());

        return mapToDto(saved);
    }

    @Transactional
    public PlacementDriveDto approveDrive(Long driveId, DriveDecisionDto decision, User officerUser) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found: " + driveId));

        if (drive.getStatus() != DriveStatus.PENDING_APPROVAL) {
            throw new BadRequestException("Only PENDING_APPROVAL drives can be approved");
        }

        drive.setStatus(DriveStatus.ACTIVE);
        drive.setApprovedBy(officerUser);
        drive.setRejectionReason(null);
        PlacementDrive saved = driveRepository.save(drive);

        auditLogService.log(officerUser, "DRIVE_APPROVED", "Officer approved drive: " + drive.getTitle());

        // Notify company
        if (drive.getCompany().getUser() != null) {
            notificationService.notify(drive.getCompany().getUser(),
                    "Drive Approved",
                    "Your placement drive '" + drive.getTitle() + "' has been approved.",
                    "DRIVE_APPROVED", "PLACEMENT_DRIVE", drive.getId());
        }

        return mapToDto(saved);
    }

    @Transactional
    public PlacementDriveDto rejectDrive(Long driveId, DriveDecisionDto decision, User officerUser) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found: " + driveId));

        if (drive.getStatus() != DriveStatus.PENDING_APPROVAL) {
            throw new BadRequestException("Only PENDING_APPROVAL drives can be rejected");
        }
        if (decision == null || decision.getRejectionReason() == null || decision.getRejectionReason().isBlank()) {
            throw new BadRequestException("Rejection reason is mandatory");
        }

        drive.setStatus(DriveStatus.REJECTED);
        drive.setRejectionReason(decision.getRejectionReason());
        PlacementDrive saved = driveRepository.save(drive);

        auditLogService.log(officerUser, "DRIVE_REJECTED",
                "Officer rejected drive: " + drive.getTitle() + " | Reason: " + decision.getRejectionReason());

        // Notify company
        if (drive.getCompany().getUser() != null) {
            notificationService.notify(drive.getCompany().getUser(),
                    "Drive Rejected",
                    "Your placement drive '" + drive.getTitle() + "' was rejected. Reason: " + decision.getRejectionReason(),
                    "DRIVE_REJECTED", "PLACEMENT_DRIVE", drive.getId());
        }

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<PlacementDriveDto> getAllDrives() {
        return driveRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlacementDriveDto> getMyDrives(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return driveRepository.findByCompanyOrderByCreatedAtDesc(company).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlacementDriveDto getDriveById(Long driveId) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found: " + driveId));
        return mapToDto(drive);
    }

    @Transactional(readOnly = true)
    public List<PlacementDriveDto> getPendingDrives() {
        return driveRepository.findByStatusOrderByCreatedAtDesc(DriveStatus.PENDING_APPROVAL).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    private PlacementDrive getDriveForCompany(Long driveId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Drive not found: " + driveId));
        if (!drive.getCompany().getId().equals(company.getId())) {
            throw new BadRequestException("You don't have access to this drive");
        }
        return drive;
    }

    public PlacementDriveDto mapToDto(PlacementDrive drive) {
        List<PlacementDriveDto.DepartmentInfo> depts = driveDeptRepository.findByDrive(drive).stream()
                .map(pdd -> new PlacementDriveDto.DepartmentInfo(
                        pdd.getDepartment().getId(),
                        pdd.getDepartment().getDepartmentCode(),
                        pdd.getDepartment().getDepartmentName()))
                .collect(Collectors.toList());

        return PlacementDriveDto.builder()
                .id(drive.getId())
                .companyId(drive.getCompany().getId())
                .companyName(drive.getCompany().getCompanyName())
                .companyLogoUrl(drive.getCompany().getLogoUrl())
                .title(drive.getTitle())
                .jobRole(drive.getJobRole())
                .description(drive.getDescription())
                .industry(drive.getIndustry())
                .jobType(drive.getJobType())
                .location(drive.getLocation())
                .workMode(drive.getWorkMode())
                .salaryMin(drive.getSalaryMin())
                .salaryMax(drive.getSalaryMax())
                .salaryDescription(drive.getSalaryDescription())
                .applicationStartDate(drive.getApplicationStartDate())
                .applicationDeadline(drive.getApplicationDeadline())
                .driveDate(drive.getDriveDate())
                .minimumCgpa(drive.getMinimumCgpa())
                .maximumBacklogs(drive.getMaximumBacklogs())
                .graduationBatch(drive.getGraduationBatch())
                .requiredSkills(drive.getRequiredSkills())
                .status(drive.getStatus().name())
                .rejectionReason(drive.getRejectionReason())
                .approvedByUsername(drive.getApprovedBy() != null ? drive.getApprovedBy().getUsername() : null)
                .eligibleDepartments(depts)
                .createdAt(drive.getCreatedAt())
                .updatedAt(drive.getUpdatedAt())
                .build();
    }

    private void notifyAllOfficers(String title, String message, String entityType, Long entityId) {
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.PLACEMENT_OFFICER && u.getStatus() == UserStatus.ACTIVE)
                .forEach(u -> notificationService.notify(u, title, message, "INFO", entityType, entityId));
    }
}
