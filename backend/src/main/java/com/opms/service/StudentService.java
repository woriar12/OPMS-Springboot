package com.opms.service;

import com.opms.dto.CareerProfileDto;
import com.opms.dto.StudentCreateRequest;
import com.opms.dto.StudentDto;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.DepartmentRepository;
import com.opms.repository.StudentRepository;
import com.opms.repository.UserRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String PASSWORD_ALLOW_BASE = CHAR_LOWER + CHAR_UPPER + NUMBER;
    private static final SecureRandom random = new SecureRandom();

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public StudentService(StudentRepository studentRepository,
                          UserRepository userRepository,
                          DepartmentRepository departmentRepository,
                          AuditLogService auditLogService,
                          PasswordEncoder passwordEncoder,
                          EmailService emailService) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.auditLogService = auditLogService;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public StudentDto createSingleStudent(StudentCreateRequest req, User adminUser) {
        String email = req.getEmail().trim().toLowerCase();
        String regNo = req.getRegisterNumber().trim().toUpperCase();
        String rollNo = req.getRollNumber().trim().toUpperCase();

        if (userRepository.existsByEmail(email) || studentRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already exists: " + email);
        }
        if (userRepository.existsByUsername(regNo) || studentRepository.existsByRegisterNumber(regNo)) {
            throw new BadRequestException("Register Number already exists: " + regNo);
        }
        if (studentRepository.existsByRollNumber(rollNo)) {
            throw new BadRequestException("Roll Number already exists: " + rollNo);
        }

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new BadRequestException("Department not found with id: " + req.getDepartmentId()));

        String tempPassword = generateTemporaryPassword();

        User user = User.builder()
                .username(regNo)
                .password(passwordEncoder.encode(tempPassword))
                .email(email)
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .firstLogin(true)
                .build();

        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .user(savedUser)
                .studentName(req.getStudentName().trim())
                .email(email)
                .rollNumber(rollNo)
                .registerNumber(regNo)
                .department(dept)
                .college(req.getCollege() != null && !req.getCollege().isBlank() ? req.getCollege().trim() : "Engineering College")
                .university(req.getUniversity() != null && !req.getUniversity().isBlank() ? req.getUniversity().trim() : "State University")
                .batch(req.getBatch() != null && !req.getBatch().isBlank() ? req.getBatch().trim() : "2023-2027")
                .currentSemester(req.getCurrentSemester() != null ? req.getCurrentSemester() : 6)
                .cgpa(req.getCgpa() != null ? req.getCgpa() : 0.0)
                .activeBacklogs(req.getActiveBacklogs() != null ? req.getActiveBacklogs() : 0)
                .address(req.getAddress() != null ? req.getAddress().trim() : null)
                .build();

        Student savedStudent = studentRepository.save(student);

        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendStudentCredentials(email, regNo, tempPassword);
            } catch (Exception e) {
                // Log warning silently
            }
        });

        auditLogService.log(adminUser, "CREATE_SINGLE_STUDENT",
                "Admin created single student: " + savedStudent.getStudentName() + " [" + regNo + "]");

        return mapToDto(savedStudent);
    }

    private String generateTemporaryPassword() {
        StringBuilder sb = new StringBuilder(8);
        sb.append("OPMS@");
        for (int i = 0; i < 4; i++) {
            int index = random.nextInt(PASSWORD_ALLOW_BASE.length());
            sb.append(PASSWORD_ALLOW_BASE.charAt(index));
        }
        return sb.toString();
    }

    @Transactional
    public StudentDto resendStudentCredentials(Long studentId, User adminUser) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        User user = student.getUser();
        if (user == null) {
            throw new BadRequestException("No user account associated with student: " + student.getRegisterNumber());
        }

        String tempPassword = generateTemporaryPassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setFirstLogin(true);
        userRepository.save(user);

        String email = student.getEmail();
        String regNo = student.getRegisterNumber();

        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendStudentCredentials(email, regNo, tempPassword);
            } catch (Exception e) {
                // Log warning silently
            }
        });

        auditLogService.log(adminUser, "RESEND_STUDENT_CREDENTIALS",
                "Admin resent credentials for student: " + student.getStudentName() + " [" + regNo + "] to email: " + email);

        return mapToDto(student);
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + username));
        return mapToDto(student);
    }

    @Transactional(readOnly = true)
    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToDto(student);
    }

    @Transactional
    public StudentDto updateCareerProfile(String username, CareerProfileDto dto) {
        User user = userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + username));

        student.setResumeUrl(dto.getResumeUrl());
        student.setSkills(dto.getSkills());
        student.setGithubUrl(dto.getGithubUrl());
        student.setLinkedinUrl(dto.getLinkedinUrl());
        student.setPortfolioUrl(dto.getPortfolioUrl());

        Student updated = studentRepository.save(student);
        auditLogService.log(user, "STUDENT_CAREER_UPDATE", "Student updated career profile");

        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<StudentDto> getAllStudents(Long departmentId, String search) {
        Specification<Student> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }

            if (search != null && !search.trim().isEmpty()) {
                String searchLike = "%" + search.trim().toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("studentName")), searchLike);
                Predicate regMatch = cb.like(cb.lower(root.get("registerNumber")), searchLike);
                Predicate rollMatch = cb.like(cb.lower(root.get("rollNumber")), searchLike);
                Predicate emailMatch = cb.like(cb.lower(root.get("email")), searchLike);
                predicates.add(cb.or(nameMatch, regMatch, rollMatch, emailMatch));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return studentRepository.findAll(spec).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDto updateStudentMasterData(Long id, StudentDto dto, User adminUser) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new BadRequestException("Department not found"));
            student.setDepartment(dept);
        }

        if (dto.getStudentName() != null) student.setStudentName(dto.getStudentName());
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            String newEmail = dto.getEmail().trim().toLowerCase();
            student.setEmail(newEmail);
            if (student.getUser() != null) {
                student.getUser().setEmail(newEmail);
                userRepository.save(student.getUser());
            }
        }
        if (dto.getCollege() != null) student.setCollege(dto.getCollege());
        if (dto.getUniversity() != null) student.setUniversity(dto.getUniversity());
        if (dto.getBatch() != null) student.setBatch(dto.getBatch());
        if (dto.getCurrentSemester() != null) student.setCurrentSemester(dto.getCurrentSemester());
        if (dto.getCgpa() != null) student.setCgpa(dto.getCgpa());
        if (dto.getActiveBacklogs() != null) student.setActiveBacklogs(dto.getActiveBacklogs());
        if (dto.getAddress() != null) student.setAddress(dto.getAddress());

        Student updated = studentRepository.save(student);

        auditLogService.log(adminUser, "ADMIN_STUDENT_UPDATE",
                "Admin updated master data for student: " + student.getRegisterNumber());

        return mapToDto(updated);
    }

    public StudentDto mapToDto(Student student) {
        return StudentDto.builder()
                .id(student.getId())
                .userId(student.getUser().getId())
                .studentName(student.getStudentName())
                .email(student.getEmail())
                .rollNumber(student.getRollNumber())
                .registerNumber(student.getRegisterNumber())
                .departmentId(student.getDepartment() != null ? student.getDepartment().getId() : null)
                .departmentCode(student.getDepartment() != null ? student.getDepartment().getDepartmentCode() : null)
                .departmentName(student.getDepartment() != null ? student.getDepartment().getDepartmentName() : null)
                .college(student.getCollege())
                .university(student.getUniversity())
                .batch(student.getBatch())
                .currentSemester(student.getCurrentSemester())
                .cgpa(student.getCgpa())
                .activeBacklogs(student.getActiveBacklogs())
                .address(student.getAddress())
                .resumeUrl(student.getResumeUrl())
                .skills(student.getSkills())
                .githubUrl(student.getGithubUrl())
                .linkedinUrl(student.getLinkedinUrl())
                .portfolioUrl(student.getPortfolioUrl())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}
