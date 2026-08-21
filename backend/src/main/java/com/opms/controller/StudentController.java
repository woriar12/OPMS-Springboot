package com.opms.controller;

import com.opms.dto.CareerProfileDto;
import com.opms.dto.CorrectionRequestDto;
import com.opms.dto.StudentDto;
import com.opms.service.CorrectionRequestService;
import com.opms.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    private final StudentService studentService;
    private final CorrectionRequestService correctionRequestService;

    public StudentController(StudentService studentService, CorrectionRequestService correctionRequestService) {
        this.studentService = studentService;
        this.correctionRequestService = correctionRequestService;
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentDto> getProfile(Authentication authentication) {
        return ResponseEntity.ok(studentService.getStudentByUsername(authentication.getName()));
    }

    @PutMapping({"/profile", "/career-profile"})
    public ResponseEntity<StudentDto> updateCareerProfile(@RequestBody CareerProfileDto dto,
                                                           Authentication authentication) {
        return ResponseEntity.ok(studentService.updateCareerProfile(authentication.getName(), dto));
    }

    @PostMapping("/correction-requests")
    public ResponseEntity<CorrectionRequestDto> createCorrectionRequest(@Valid @RequestBody CorrectionRequestDto dto,
                                                                         Authentication authentication) {
        return ResponseEntity.ok(correctionRequestService.createRequest(authentication.getName(), dto));
    }

    @GetMapping("/correction-requests")
    public ResponseEntity<List<CorrectionRequestDto>> getMyCorrectionRequests(Authentication authentication) {
        return ResponseEntity.ok(correctionRequestService.getStudentRequests(authentication.getName()));
    }
}
