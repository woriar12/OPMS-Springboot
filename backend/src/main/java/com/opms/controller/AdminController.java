package com.opms.controller;

import com.opms.dto.*;
import com.opms.entity.*;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.*;
import com.opms.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final DepartmentService departmentService;
    private final StudentService studentService;
    private final BulkImportService bulkImportService;
    private final CorrectionRequestService correctionRequestService;
    private final AuditLogService auditLogService;
    private final PlacementOfficerService officerService;

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final CorrectionRequestRepository correctionRequestRepository;
    private final UserRepository userRepository;

    public AdminController(DepartmentService departmentService, StudentService studentService,
                           BulkImportService bulkImportService, CorrectionRequestService correctionRequestService,
                           AuditLogService auditLogService, PlacementOfficerService officerService,
                           StudentRepository studentRepository, DepartmentRepository departmentRepository,
                           CorrectionRequestRepository correctionRequestRepository, UserRepository userRepository) {
        this.departmentService = departmentService;
        this.studentService = studentService;
        this.bulkImportService = bulkImportService;
        this.correctionRequestService = correctionRequestService;
        this.auditLogService = auditLogService;
        this.officerService = officerService;
        this.studentRepository = studentRepository;
        this.departmentRepository = departmentRepository;
        this.correctionRequestRepository = correctionRequestRepository;
        this.userRepository = userRepository;
    }

    // ───────── Dashboard ─────────
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalDepartments = departmentRepository.count();
        long activeStudents = studentRepository.count();
        long pendingRequests = correctionRequestRepository.countByStatus(CorrectionStatus.PENDING);

        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalStudents(totalStudents)
                .totalDepartments(totalDepartments)
                .activeStudents(activeStudents)
                .pendingCorrectionRequests(pendingRequests)
                .build();
        return ResponseEntity.ok(stats);
    }

    // ───────── Departments ─────────
    @GetMapping("/departments")
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @PostMapping("/departments")
    public ResponseEntity<DepartmentDto> createDepartment(@Valid @RequestBody DepartmentDto dto) {
        return ResponseEntity.ok(departmentService.createDepartment(dto));
    }

    @PutMapping("/departments/{id}")
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable Long id, @Valid @RequestBody DepartmentDto dto) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, dto));
    }

    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }

    // ───────── Students ─────────
    @PostMapping("/students/import")
    public ResponseEntity<BulkImportResultDto> importStudents(@RequestParam("file") MultipartFile file,
                                                               Authentication authentication) {
        User adminUser = getAdminUser(authentication);
        BulkImportResultDto result = bulkImportService.importStudents(file, adminUser);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/students/sample-import-template")
    public ResponseEntity<byte[]> downloadSampleTemplate() {
        String csvContent = "Student Name,Email,Roll Number,Register Number,Department,College,University,Batch,Semester,CGPA,Active Backlogs\n" +
                "Rahul Sharma,rahul.sharma@example.com,24CS001,REG24CS001,CSE,College of Engineering,State University,2022-2026,6,8.45,0\n" +
                "Priya Patel,priya.patel@example.com,24EC002,REG24EC002,ECE,College of Engineering,State University,2022-2026,6,7.80,1\n";
        byte[] body = csvContent.getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=opms_student_import_template.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(body);
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentDto>> getAllStudents(@RequestParam(required = false) Long departmentId,
                                                           @RequestParam(required = false) String search) {
        return ResponseEntity.ok(studentService.getAllStudents(departmentId, search));
    }

    @PostMapping("/students")
    public ResponseEntity<StudentDto> createSingleStudent(@Valid @RequestBody StudentCreateRequest request,
                                                           Authentication authentication) {
        User adminUser = getAdminUser(authentication);
        return ResponseEntity.ok(studentService.createSingleStudent(request, adminUser));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<StudentDto> updateStudentMasterData(@PathVariable Long id,
                                                               @RequestBody StudentDto dto,
                                                               Authentication authentication) {
        User adminUser = getAdminUser(authentication);
        return ResponseEntity.ok(studentService.updateStudentMasterData(id, dto, adminUser));
    }

    @PostMapping("/students/{id}/resend-credentials")
    public ResponseEntity<StudentDto> resendStudentCredentials(@PathVariable Long id,
                                                                Authentication authentication) {
        User adminUser = getAdminUser(authentication);
        return ResponseEntity.ok(studentService.resendStudentCredentials(id, adminUser));
    }

    // ───────── Correction Requests ─────────
    @GetMapping("/correction-requests")
    public ResponseEntity<List<CorrectionRequestDto>> getAllCorrectionRequests() {
        return ResponseEntity.ok(correctionRequestService.getAllRequests());
    }

    @PostMapping("/correction-requests/{id}/approve")
    public ResponseEntity<CorrectionRequestDto> approveCorrectionRequest(@PathVariable Long id,
                                                                          @RequestBody(required = false) CorrectionDecisionDto decision,
                                                                          Authentication authentication) {
        User adminUser = getAdminUser(authentication);
        return ResponseEntity.ok(correctionRequestService.approveRequest(id, decision, adminUser));
    }

    @PostMapping("/correction-requests/{id}/reject")
    public ResponseEntity<CorrectionRequestDto> rejectCorrectionRequest(@PathVariable Long id,
                                                                         @RequestBody(required = false) CorrectionDecisionDto decision,
                                                                         Authentication authentication) {
        User adminUser = getAdminUser(authentication);
        return ResponseEntity.ok(correctionRequestService.rejectRequest(id, decision, adminUser));
    }

    // ───────── Audit Logs ─────────
    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLogDto>> getAuditLogs() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    // ───────── Placement Officers (Phase 2) ─────────
    @GetMapping("/officers")
    public ResponseEntity<List<PlacementOfficerDto>> getAllOfficers() {
        return ResponseEntity.ok(officerService.getAllOfficers());
    }

    @PostMapping("/officers")
    public ResponseEntity<PlacementOfficerDto> createOfficer(@RequestBody PlacementOfficerDto dto) {
        return ResponseEntity.status(201).body(officerService.createOfficer(dto));
    }

    @GetMapping("/officers/{id}")
    public ResponseEntity<PlacementOfficerDto> getOfficerById(@PathVariable Long id) {
        return ResponseEntity.ok(officerService.getOfficerById(id));
    }

    @PutMapping("/officers/{id}")
    public ResponseEntity<PlacementOfficerDto> updateOfficer(@PathVariable Long id,
                                                              @RequestBody PlacementOfficerDto dto) {
        return ResponseEntity.ok(officerService.updateOfficer(id, dto));
    }

    @PatchMapping("/officers/{id}/status")
    public ResponseEntity<PlacementOfficerDto> updateOfficerStatus(@PathVariable Long id,
                                                                     @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(officerService.updateStatus(id, body.get("status")));
    }

    private User getAdminUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .or(() -> userRepository.findByEmail(authentication.getName()))
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
    }
}
