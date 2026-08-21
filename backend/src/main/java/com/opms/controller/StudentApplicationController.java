package com.opms.controller;

import com.opms.dto.*;
import com.opms.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentApplicationController {

    private final ApplicationService applicationService;
    private final EligibilityService eligibilityService;
    private final PlacementDriveService driveService;
    private final InterviewService interviewService;
    private final OfferService offerService;

    public StudentApplicationController(ApplicationService applicationService,
                                        EligibilityService eligibilityService,
                                        PlacementDriveService driveService,
                                        InterviewService interviewService,
                                        OfferService offerService) {
        this.applicationService = applicationService;
        this.eligibilityService = eligibilityService;
        this.driveService = driveService;
        this.interviewService = interviewService;
        this.offerService = offerService;
    }

    // ───────── Dashboard Stats ─────────
    @GetMapping("/dashboard/stats")
    public ResponseEntity<StudentDashboardStatsDto> getDashboardStats(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getStudentDashboardStats(authentication.getName()));
    }

    // ───────── Drives ─────────
    @GetMapping("/drives/eligible")
    public ResponseEntity<List<PlacementDriveDto>> getEligibleDrives(Authentication authentication) {
        return ResponseEntity.ok(eligibilityService.getEligibleDrivesForStudent(authentication.getName()));
    }

    @GetMapping("/drives/{id}")
    public ResponseEntity<PlacementDriveDto> getDriveById(@PathVariable Long id) {
        return ResponseEntity.ok(driveService.getDriveById(id));
    }

    @PostMapping("/drives/{driveId}/apply")
    public ResponseEntity<ApplicationDto> applyForDrive(@PathVariable Long driveId,
                                                         @RequestBody(required = false) ApplicationCreateRequest request,
                                                         Authentication authentication) {
        ApplicationDto dto = applicationService.applyForDrive(driveId, authentication.getName(), request);
        return ResponseEntity.status(201).body(dto);
    }

    // ───────── Applications ─────────
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getMyApplications(authentication.getName()));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @GetMapping("/applications/{id}/history")
    public ResponseEntity<List<ApplicationStatusHistoryDto>> getApplicationHistory(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationHistory(id));
    }

    // ───────── Interviews ─────────
    @GetMapping("/interviews")
    public ResponseEntity<List<InterviewDto>> getMyInterviews(Authentication authentication) {
        return ResponseEntity.ok(interviewService.getStudentInterviews(authentication.getName()));
    }

    // ───────── Offers & Placement ─────────
    @GetMapping("/offers")
    public ResponseEntity<List<OfferDto>> getMyOffers(Authentication authentication) {
        return ResponseEntity.ok(offerService.getStudentOffers(authentication.getName()));
    }

    @PutMapping("/offers/{id}/respond")
    public ResponseEntity<OfferDto> respondToOffer(@PathVariable Long id,
                                                    @RequestBody Map<String, String> body,
                                                    Authentication authentication) {
        String response = body.get("response");
        String comment = body.get("comment");
        return ResponseEntity.ok(offerService.respondToOffer(id, response, comment, authentication.getName()));
    }

    @GetMapping("/placement")
    public ResponseEntity<PlacementDto> getMyPlacement(Authentication authentication) {
        PlacementDto placement = offerService.getStudentPlacement(authentication.getName());
        return ResponseEntity.ok(placement);
    }
}
