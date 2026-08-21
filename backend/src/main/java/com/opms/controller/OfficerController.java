package com.opms.controller;

import com.opms.dto.*;
import com.opms.entity.*;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.*;
import com.opms.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasRole('PLACEMENT_OFFICER')")
public class OfficerController {

    private final CompanyService companyService;
    private final PlacementDriveService driveService;
    private final PlacementOfficerService officerService;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    private final DepartmentService departmentService;

    public OfficerController(CompanyService companyService,
                             PlacementDriveService driveService,
                             PlacementOfficerService officerService,
                             CompanyRepository companyRepository,
                             PlacementDriveRepository driveRepository,
                             StudentRepository studentRepository,
                             UserRepository userRepository,
                             DepartmentService departmentService) {
        this.companyService = companyService;
        this.driveService = driveService;
        this.officerService = officerService;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.departmentService = departmentService;
    }

    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDto>> getDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    // ───────── Dashboard ─────────
    @GetMapping("/dashboard/stats")
    public ResponseEntity<OfficerDashboardStatsDto> getDashboardStats() {
        OfficerDashboardStatsDto stats = OfficerDashboardStatsDto.builder()
                .totalCompanies(companyRepository.count())
                .pendingCompanyRequests(companyRepository.countByStatus(CompanyStatus.PENDING))
                .approvedCompanies(companyRepository.countByStatus(CompanyStatus.APPROVED))
                .rejectedCompanies(companyRepository.countByStatus(CompanyStatus.REJECTED))
                .activeDrives(driveRepository.countByStatus(DriveStatus.ACTIVE))
                .pendingDriveApprovals(driveRepository.countByStatus(DriveStatus.PENDING_APPROVAL))
                .totalDrives(driveRepository.count())
                .closedDrives(driveRepository.countByStatus(DriveStatus.CLOSED))
                .totalStudents(studentRepository.count())
                .build();
        return ResponseEntity.ok(stats);
    }

    // ───────── My Profile ─────────
    @GetMapping("/profile")
    public ResponseEntity<PlacementOfficerDto> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(officerService.getMyProfile(authentication.getName()));
    }

    // ───────── Company Requests ─────────
    @GetMapping("/company-requests")
    public ResponseEntity<List<CompanyDto>> getPendingCompanyRequests() {
        return ResponseEntity.ok(companyService.getPendingCompanies());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<CompanyDto> getCompanyById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.getCompanyById(id));
    }

    @PutMapping("/company-requests/{id}/approve")
    public ResponseEntity<CompanyDto> approveCompany(@PathVariable Long id,
                                                      @RequestBody(required = false) CompanyVerificationDto dto,
                                                      Authentication authentication) {
        User officer = getOfficerUser(authentication);
        return ResponseEntity.ok(companyService.approveCompany(id, dto, officer));
    }

    @PutMapping("/company-requests/{id}/reject")
    public ResponseEntity<CompanyDto> rejectCompany(@PathVariable Long id,
                                                     @RequestBody CompanyVerificationDto dto,
                                                     Authentication authentication) {
        User officer = getOfficerUser(authentication);
        return ResponseEntity.ok(companyService.rejectCompany(id, dto, officer));
    }

    // ───────── Drive Management ─────────
    @GetMapping("/drives")
    public ResponseEntity<List<PlacementDriveDto>> getAllDrives() {
        return ResponseEntity.ok(driveService.getAllDrives());
    }

    @GetMapping("/drive-requests")
    public ResponseEntity<List<PlacementDriveDto>> getPendingDrives() {
        return ResponseEntity.ok(driveService.getPendingDrives());
    }

    @GetMapping("/drives/{id}")
    public ResponseEntity<PlacementDriveDto> getDriveById(@PathVariable Long id) {
        return ResponseEntity.ok(driveService.getDriveById(id));
    }

    @PutMapping("/drives/{id}/approve")
    public ResponseEntity<PlacementDriveDto> approveDrive(@PathVariable Long id,
                                                           @RequestBody(required = false) DriveDecisionDto decision,
                                                           Authentication authentication) {
        User officer = getOfficerUser(authentication);
        return ResponseEntity.ok(driveService.approveDrive(id, decision, officer));
    }

    @PutMapping("/drives/{id}/reject")
    public ResponseEntity<PlacementDriveDto> rejectDrive(@PathVariable Long id,
                                                          @RequestBody DriveDecisionDto decision,
                                                          Authentication authentication) {
        User officer = getOfficerUser(authentication);
        return ResponseEntity.ok(driveService.rejectDrive(id, decision, officer));
    }

    @PutMapping("/drives/{id}/departments")
    public ResponseEntity<PlacementDriveDto> updateDriveDepartments(@PathVariable Long id,
                                                                      @RequestBody DepartmentMappingRequest request,
                                                                      Authentication authentication) {
        User officer = getOfficerUser(authentication);
        List<Long> deptIds = request != null ? request.getDepartmentIds() : List.of();
        return ResponseEntity.ok(driveService.updateDriveDepartmentsByOfficer(id, deptIds, officer));
    }

    private User getOfficerUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .or(() -> userRepository.findByEmail(authentication.getName()))
                .orElseThrow(() -> new ResourceNotFoundException("Officer user not found"));
    }
}
