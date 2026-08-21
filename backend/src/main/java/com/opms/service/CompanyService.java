package com.opms.service;

import com.opms.dto.CompanyDto;
import com.opms.dto.CompanyRegistrationRequest;
import com.opms.dto.CompanyVerificationDto;
import com.opms.entity.*;
import com.opms.exception.BadRequestException;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private static final Logger log = LoggerFactory.getLogger(CompanyService.class);
    private static final SecureRandom random = new SecureRandom();
    private static final String CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private final CompanyRepository companyRepository;
    private final CompanyVerificationRepository verificationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    public CompanyService(CompanyRepository companyRepository,
                          CompanyVerificationRepository verificationRepository,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          EmailService emailService,
                          AuditLogService auditLogService,
                          NotificationService notificationService) {
        this.companyRepository = companyRepository;
        this.verificationRepository = verificationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.auditLogService = auditLogService;
        this.notificationService = notificationService;
    }

    @Transactional
    public CompanyDto registerCompany(CompanyRegistrationRequest request) {
        if (companyRepository.existsByCompanyName(request.getCompanyName())) {
            throw new BadRequestException("Company name already registered: " + request.getCompanyName());
        }
        if (companyRepository.existsByHrEmail(request.getHrEmail()) || userRepository.existsByEmail(request.getHrEmail().toLowerCase())) {
            throw new BadRequestException("HR email already registered in system: " + request.getHrEmail());
        }

        Company company = Company.builder()
                .companyName(request.getCompanyName())
                .industry(request.getIndustry())
                .website(request.getWebsite())
                .logoUrl(request.getLogoUrl())
                .description(request.getDescription())
                .hrEmail(request.getHrEmail().toLowerCase())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .hrContactPerson(request.getHrContactPerson())
                .designation(request.getDesignation())
                .status(CompanyStatus.PENDING)
                .build();

        Company saved = companyRepository.save(company);

        // Notify all placement officers
        notifyAllOfficers("New Company Registration",
                "New company registration from " + request.getCompanyName() + " is pending verification.",
                "COMPANY_REGISTRATION", saved.getId());

        log.info("Company registered: {} [Status: PENDING]", request.getCompanyName());
        return mapToDto(saved);
    }

    @Transactional
    public CompanyDto approveCompany(Long companyId, CompanyVerificationDto dto, User officerUser) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));

        if (company.getStatus() != CompanyStatus.PENDING) {
            throw new BadRequestException("Company is not in PENDING status");
        }

        String username = generateUsername(company.getCompanyName());
        String tempPassword = "Company@" + generateRandomSuffix(6);

        User savedUser;
        Optional<User> existingUserOpt = userRepository.findByEmail(company.getHrEmail().toLowerCase());
        if (existingUserOpt.isPresent()) {
            savedUser = existingUserOpt.get();
            if (!Role.COMPANY.equals(savedUser.getRole())) {
                throw new BadRequestException("An account with email " + company.getHrEmail() + " already exists in the system as a " + savedUser.getRole() + " account.");
            }
            username = savedUser.getUsername();
        } else {
            User companyUser = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode(tempPassword))
                    .email(company.getHrEmail().toLowerCase())
                    .role(Role.COMPANY)
                    .status(UserStatus.ACTIVE)
                    .firstLogin(true)
                    .build();
            savedUser = userRepository.save(companyUser);
        }

        company.setUser(savedUser);
        company.setStatus(CompanyStatus.APPROVED);
        company.setRejectionReason(null);
        companyRepository.save(company);

        // Save verification record
        CompanyVerification verification = CompanyVerification.builder()
                .company(company)
                .verifiedBy(officerUser)
                .status(CompanyStatus.APPROVED)
                .verificationComment(dto != null ? dto.getComment() : null)
                .verifiedAt(LocalDateTime.now())
                .build();
        verificationRepository.save(verification);

        // Send credentials email asynchronously
        final String mailTo = company.getHrEmail();
        final String userTo = username;
        final String passTo = tempPassword;
        final String nameTo = company.getCompanyName();
        CompletableFuture.runAsync(() -> {
            try {
                emailService.sendCompanyCredentials(mailTo, userTo, passTo, nameTo);
            } catch (Exception e) {
                log.warn("Could not send approval email to {}: {}", mailTo, e.getMessage());
            }
        });

        // Notify company user
        notificationService.notify(savedUser,
                "Registration Approved",
                "Your company registration has been approved. You can now login to OPMS.",
                "COMPANY_APPROVED", "COMPANY", company.getId());

        auditLogService.log(officerUser, "COMPANY_APPROVED",
                "Officer approved company: " + company.getCompanyName() + " [ID: " + companyId + "]");

        log.info("Company approved: {} | Username: {}", company.getCompanyName(), username);
        return mapToDto(company);
    }

    @Transactional
    public CompanyDto rejectCompany(Long companyId, CompanyVerificationDto dto, User officerUser) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + companyId));

        if (company.getStatus() != CompanyStatus.PENDING) {
            throw new BadRequestException("Company is not in PENDING status");
        }
        if (dto == null || dto.getRejectionReason() == null || dto.getRejectionReason().isBlank()) {
            throw new BadRequestException("Rejection reason is mandatory");
        }

        company.setStatus(CompanyStatus.REJECTED);
        company.setRejectionReason(dto.getRejectionReason());
        companyRepository.save(company);

        CompanyVerification verification = CompanyVerification.builder()
                .company(company)
                .verifiedBy(officerUser)
                .status(CompanyStatus.REJECTED)
                .rejectionReason(dto.getRejectionReason())
                .verifiedAt(LocalDateTime.now())
                .build();
        verificationRepository.save(verification);

        auditLogService.log(officerUser, "COMPANY_REJECTED",
                "Officer rejected company: " + company.getCompanyName() + " | Reason: " + dto.getRejectionReason());

        return mapToDto(company);
    }

    @Transactional(readOnly = true)
    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CompanyDto> getPendingCompanies() {
        return companyRepository.findByStatus(CompanyStatus.PENDING).stream()
                .map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found: " + id));
        return mapToDto(company);
    }

    @Transactional(readOnly = true)
    public CompanyDto getMyCompany(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));
        return mapToDto(company);
    }

    @Transactional
    public CompanyDto updateMyCompany(String username, CompanyDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        Company company = companyRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found"));

        if (dto.getWebsite() != null) company.setWebsite(dto.getWebsite());
        if (dto.getLogoUrl() != null) company.setLogoUrl(dto.getLogoUrl());
        if (dto.getDescription() != null) company.setDescription(dto.getDescription());
        if (dto.getPhone() != null) company.setPhone(dto.getPhone());
        if (dto.getAddress() != null) company.setAddress(dto.getAddress());
        if (dto.getCity() != null) company.setCity(dto.getCity());
        if (dto.getState() != null) company.setState(dto.getState());
        if (dto.getCountry() != null) company.setCountry(dto.getCountry());
        if (dto.getHrContactPerson() != null) company.setHrContactPerson(dto.getHrContactPerson());
        if (dto.getDesignation() != null) company.setDesignation(dto.getDesignation());

        Company updated = companyRepository.save(company);
        return mapToDto(updated);
    }

    public CompanyDto mapToDto(Company company) {
        return CompanyDto.builder()
                .id(company.getId())
                .userId(company.getUser() != null ? company.getUser().getId() : null)
                .companyName(company.getCompanyName())
                .industry(company.getIndustry())
                .website(company.getWebsite())
                .logoUrl(company.getLogoUrl())
                .description(company.getDescription())
                .hrEmail(company.getHrEmail())
                .phone(company.getPhone())
                .address(company.getAddress())
                .city(company.getCity())
                .state(company.getState())
                .country(company.getCountry())
                .hrContactPerson(company.getHrContactPerson())
                .designation(company.getDesignation())
                .status(company.getStatus().name())
                .rejectionReason(company.getRejectionReason())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .build();
    }

    private String generateUsername(String companyName) {
        String base = companyName.toLowerCase().replaceAll("[^a-z0-9]", "").substring(0, Math.min(companyName.length(), 10));
        String candidate = base;
        int counter = 1;
        while (userRepository.findByUsername(candidate).isPresent()) {
            candidate = base + counter++;
        }
        return candidate;
    }

    private String generateRandomSuffix(int length) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private void notifyAllOfficers(String title, String message, String entityType, Long entityId) {
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.PLACEMENT_OFFICER && u.getStatus() == UserStatus.ACTIVE)
                .forEach(u -> notificationService.notify(u, title, message, "INFO", entityType, entityId));
    }
}
