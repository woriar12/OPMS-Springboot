package com.opms.service;

import com.opms.dto.CorrectionDecisionDto;
import com.opms.dto.CorrectionRequestDto;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.CorrectionRequestRepository;
import com.opms.repository.DepartmentRepository;
import com.opms.repository.StudentRepository;
import com.opms.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CorrectionRequestService {

    private static final Logger log = LoggerFactory.getLogger(CorrectionRequestService.class);

    private final CorrectionRequestRepository correctionRequestRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogService auditLogService;

    public CorrectionRequestService(CorrectionRequestRepository correctionRequestRepository, StudentRepository studentRepository, UserRepository userRepository, DepartmentRepository departmentRepository, AuditLogService auditLogService) {
        this.correctionRequestRepository = correctionRequestRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public CorrectionRequestDto createRequest(String username, CorrectionRequestDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        CorrectionRequest request = CorrectionRequest.builder()
                .student(student)
                .fieldName(dto.getFieldName())
                .currentValue(dto.getCurrentValue())
                .requestedValue(dto.getRequestedValue())
                .reason(dto.getReason())
                .status(CorrectionStatus.PENDING)
                .build();

        CorrectionRequest saved = correctionRequestRepository.save(request);

        auditLogService.log(user, "RAISE_CORRECTION_REQUEST",
                String.format("Student raised correction request for field [%s]", dto.getFieldName()));

        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CorrectionRequestDto> getStudentRequests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return correctionRequestRepository.findByStudentOrderByCreatedAtDesc(student).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CorrectionRequestDto> getAllRequests() {
        return correctionRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CorrectionRequestDto approveRequest(Long requestId, CorrectionDecisionDto decision, User adminUser) {
        CorrectionRequest request = correctionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Correction request not found: " + requestId));

        if (request.getStatus() != CorrectionStatus.PENDING) {
            throw new BadRequestException("Request is already processed");
        }

        Student student = request.getStudent();
        String field = request.getFieldName().trim().toLowerCase();
        String newValue = request.getRequestedValue().trim();

        switch (field) {
            case "name", "student_name", "studentname" -> student.setStudentName(newValue);
            case "department", "department_code", "dept" -> {
                Optional<Department> deptOpt = departmentRepository.findByDepartmentCode(newValue.toUpperCase());
                if (deptOpt.isEmpty()) {
                    deptOpt = departmentRepository.findByDepartmentNameIgnoreCase(newValue);
                }
                if (deptOpt.isPresent()) {
                    student.setDepartment(deptOpt.get());
                } else {
                    Department newDept = Department.builder()
                            .departmentCode(newValue.toUpperCase().replaceAll("\\s+", "_"))
                            .departmentName(newValue)
                            .status("ACTIVE")
                            .build();
                    student.setDepartment(departmentRepository.save(newDept));
                }
            }
            case "college" -> student.setCollege(newValue);
            case "university" -> student.setUniversity(newValue);
            case "batch" -> student.setBatch(newValue);
            case "address" -> student.setAddress(newValue);
            case "semester", "current_semester" -> {
                try {
                    student.setCurrentSemester(Integer.parseInt(newValue));
                } catch (Exception e) {
                    log.warn("Could not parse semester value: {}, skipping semester update", newValue);
                }
            }
            case "cgpa" -> {
                try {
                    student.setCgpa(Double.parseDouble(newValue));
                } catch (Exception e) {
                    log.warn("Could not parse CGPA value: {}, skipping CGPA update", newValue);
                }
            }
            case "backlogs", "active_backlogs", "active backlogs" -> {
                try {
                    student.setActiveBacklogs(Integer.parseInt(newValue));
                } catch (Exception e) {
                    log.warn("Could not parse backlogs value: {}, skipping backlogs update", newValue);
                }
            }
            case "email" -> {
                student.setEmail(newValue.toLowerCase());
                User user = student.getUser();
                user.setEmail(newValue.toLowerCase());
                userRepository.save(user);
            }
            default -> log.info("Updating request status for custom field: {}", request.getFieldName());
        }

        studentRepository.save(student);

        request.setStatus(CorrectionStatus.APPROVED);
        if (decision != null && decision.getAdminComment() != null) {
            request.setAdminComment(decision.getAdminComment());
        }
        CorrectionRequest updated = correctionRequestRepository.save(request);

        auditLogService.log(adminUser, "CORRECTION_APPROVED",
                String.format("Approved correction for student %s on field %s", student.getRegisterNumber(), request.getFieldName()));

        return mapToDto(updated);
    }

    @Transactional
    public CorrectionRequestDto rejectRequest(Long requestId, CorrectionDecisionDto decision, User adminUser) {
        CorrectionRequest request = correctionRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Correction request not found: " + requestId));

        if (request.getStatus() != CorrectionStatus.PENDING) {
            throw new BadRequestException("Request is already processed");
        }

        request.setStatus(CorrectionStatus.REJECTED);
        if (decision != null && decision.getAdminComment() != null) {
            request.setAdminComment(decision.getAdminComment());
        } else {
            request.setAdminComment("Request rejected by administration");
        }

        CorrectionRequest updated = correctionRequestRepository.save(request);

        auditLogService.log(adminUser, "CORRECTION_REJECTED",
                String.format("Rejected correction for student %s on field %s", request.getStudent().getRegisterNumber(), request.getFieldName()));

        return mapToDto(updated);
    }

    private CorrectionRequestDto mapToDto(CorrectionRequest req) {
        return CorrectionRequestDto.builder()
                .id(req.getId())
                .studentId(req.getStudent().getId())
                .studentName(req.getStudent().getStudentName())
                .registerNumber(req.getStudent().getRegisterNumber())
                .departmentCode(req.getStudent().getDepartment() != null ? req.getStudent().getDepartment().getDepartmentCode() : "N/A")
                .fieldName(req.getFieldName())
                .currentValue(req.getCurrentValue())
                .requestedValue(req.getRequestedValue())
                .reason(req.getReason())
                .status(req.getStatus())
                .adminComment(req.getAdminComment())
                .createdAt(req.getCreatedAt())
                .updatedAt(req.getUpdatedAt())
                .build();
    }
}
