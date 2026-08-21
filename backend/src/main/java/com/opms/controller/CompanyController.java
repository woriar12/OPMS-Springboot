package com.opms.controller;

import com.opms.dto.CompanyDashboardStatsDto;
import com.opms.dto.CompanyDto;
import com.opms.dto.DepartmentDto;
import com.opms.dto.DriveCreateRequest;
import com.opms.dto.PlacementDriveDto;
import com.opms.entity.Company;
import com.opms.entity.DriveStatus;
import com.opms.repository.CompanyRepository;
import com.opms.repository.PlacementDriveRepository;
import com.opms.repository.UserRepository;
import com.opms.exception.ResourceNotFoundException;
import com.opms.service.CompanyService;
import com.opms.service.DepartmentService;
import com.opms.service.PlacementDriveService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/company")
@PreAuthorize("hasRole('COMPANY')")
public class CompanyController {

    private final CompanyService companyService;
    private final PlacementDriveService driveService;
    private final DepartmentService departmentService;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final UserRepository userRepository;

    public CompanyController(CompanyService companyService,
                             PlacementDriveService driveService,
                             DepartmentService departmentService,
                             CompanyRepository companyRepository,
                             PlacementDriveRepository driveRepository,
                             UserRepository userRepository) {
        this.companyService = companyService;
        this.driveService = driveService;
        this.departmentService = departmentService;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.userRepository = userRepository;
    }

    // ───────── Dashboard ─────────
    @GetMapping("/dashboard/stats")
    public ResponseEntity<CompanyDashboardStatsDto> getDashboardStats(Authentication authentication) {
        Company company = getMyCompanyEntity(authentication.getName());
        CompanyDashboardStatsDto stats = CompanyDashboardStatsDto.builder()
                .totalDrives(driveRepository.countByCompany(company))
                .draftDrives(driveRepository.countByCompanyAndStatus(company, DriveStatus.DRAFT))
                .pendingDrives(driveRepository.countByCompanyAndStatus(company, DriveStatus.PENDING_APPROVAL))
                .approvedDrives(driveRepository.countByCompanyAndStatus(company, DriveStatus.APPROVED))
                .activeDrives(driveRepository.countByCompanyAndStatus(company, DriveStatus.ACTIVE))
                .closedDrives(driveRepository.countByCompanyAndStatus(company, DriveStatus.CLOSED))
                .rejectedDrives(driveRepository.countByCompanyAndStatus(company, DriveStatus.REJECTED))
                .totalApplications(0L)
                .shortlisted(0L)
                .selected(0L)
                .build();
        return ResponseEntity.ok(stats);
    }

    // ───────── Profile ─────────
    @GetMapping("/profile")
    public ResponseEntity<CompanyDto> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(companyService.getMyCompany(authentication.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<CompanyDto> updateMyProfile(@RequestBody CompanyDto dto, Authentication authentication) {
        return ResponseEntity.ok(companyService.updateMyCompany(authentication.getName(), dto));
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDto>> getDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    // ───────── Drives ─────────
    @PostMapping("/drives")
    public ResponseEntity<PlacementDriveDto> createDrive(@Valid @RequestBody DriveCreateRequest request,
                                                          Authentication authentication) {
        return ResponseEntity.status(201).body(driveService.createDrive(authentication.getName(), request));
    }

    @GetMapping("/drives")
    public ResponseEntity<List<PlacementDriveDto>> getMyDrives(Authentication authentication) {
        return ResponseEntity.ok(driveService.getMyDrives(authentication.getName()));
    }

    @GetMapping("/drives/{id}")
    public ResponseEntity<PlacementDriveDto> getDriveById(@PathVariable Long id) {
        return ResponseEntity.ok(driveService.getDriveById(id));
    }

    @PutMapping("/drives/{id}")
    public ResponseEntity<PlacementDriveDto> updateDrive(@PathVariable Long id,
                                                          @RequestBody DriveCreateRequest request,
                                                          Authentication authentication) {
        return ResponseEntity.ok(driveService.updateDrive(id, authentication.getName(), request));
    }

    @PostMapping("/drives/{id}/submit")
    public ResponseEntity<PlacementDriveDto> submitDrive(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(driveService.submitDrive(id, authentication.getName()));
    }

    private Company getMyCompanyEntity(String username) {
        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .flatMap(companyRepository::findByUser)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found for user: " + username));
    }
}
