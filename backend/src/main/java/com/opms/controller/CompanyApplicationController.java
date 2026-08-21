package com.opms.controller;

import com.opms.dto.*;
import com.opms.entity.*;
import com.opms.exception.ResourceNotFoundException;
import com.opms.repository.UserRepository;
import com.opms.service.*;
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
public class CompanyApplicationController {

    private final ApplicationService applicationService;
    private final InterviewService interviewService;
    private final OfferService offerService;
    private final UserRepository userRepository;

    public CompanyApplicationController(ApplicationService applicationService,
                                        InterviewService interviewService,
                                        OfferService offerService,
                                        UserRepository userRepository) {
        this.applicationService = applicationService;
        this.interviewService = interviewService;
        this.offerService = offerService;
        this.userRepository = userRepository;
    }

    // ───────── Applications ─────────
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getCompanyApplications(Authentication authentication) {
        return ResponseEntity.ok(applicationService.getCompanyApplications(authentication.getName()));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApplicationDto> getApplicationById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PutMapping("/applications/{id}/shortlist")
    public ResponseEntity<ApplicationDto> shortlistApplication(@PathVariable Long id,
                                                                 @RequestBody(required = false) Map<String, String> body,
                                                                 Authentication authentication) {
        User companyUser = getCompanyUser(authentication);
        String comment = body != null ? body.get("comment") : "Shortlisted by company";
        return ResponseEntity.ok(applicationService.updateStatus(id, ApplicationStatus.SHORTLISTED, comment, companyUser));
    }

    @PutMapping("/applications/{id}/reject")
    public ResponseEntity<ApplicationDto> rejectApplication(@PathVariable Long id,
                                                              @RequestBody(required = false) Map<String, String> body,
                                                              Authentication authentication) {
        User companyUser = getCompanyUser(authentication);
        String reason = body != null && body.get("reason") != null ? body.get("reason") : "Rejected by company";
        return ResponseEntity.ok(applicationService.updateStatus(id, ApplicationStatus.REJECTED, reason, companyUser));
    }

    // ───────── Interviews ─────────
    @PostMapping("/applications/{id}/interviews")
    public ResponseEntity<InterviewDto> scheduleInterview(@PathVariable Long id,
                                                           @Valid @RequestBody InterviewScheduleRequest request,
                                                           Authentication authentication) {
        User companyUser = getCompanyUser(authentication);
        return ResponseEntity.status(201).body(interviewService.scheduleInterview(id, request, companyUser));
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<InterviewDto>> getCompanyInterviews(Authentication authentication) {
        return ResponseEntity.ok(interviewService.getCompanyInterviews(authentication.getName()));
    }

    @PutMapping("/interviews/{interviewId}/result")
    public ResponseEntity<InterviewDto> updateInterviewResult(@PathVariable Long interviewId,
                                                                @RequestBody Map<String, String> body,
                                                                Authentication authentication) {
        User companyUser = getCompanyUser(authentication);
        String result = body.get("result");
        String status = body.get("status");
        return ResponseEntity.ok(interviewService.updateResult(interviewId, result, status, companyUser));
    }

    // ───────── Offers ─────────
    @PostMapping("/applications/{id}/offers")
    public ResponseEntity<OfferDto> generateOffer(@PathVariable Long id,
                                                   @Valid @RequestBody OfferCreateRequest request,
                                                   Authentication authentication) {
        User companyUser = getCompanyUser(authentication);
        return ResponseEntity.status(201).body(offerService.generateOffer(id, request, companyUser));
    }

    @GetMapping("/offers")
    public ResponseEntity<List<OfferDto>> getCompanyOffers(Authentication authentication) {
        return ResponseEntity.ok(offerService.getCompanyOffers(authentication.getName()));
    }

    @GetMapping("/placements")
    public ResponseEntity<List<PlacementDto>> getCompanyPlacements(Authentication authentication) {
        return ResponseEntity.ok(offerService.getAllPlacements());
    }

    private User getCompanyUser(Authentication authentication) {
        return userRepository.findByUsername(authentication.getName())
                .or(() -> userRepository.findByEmail(authentication.getName()))
                .orElseThrow(() -> new ResourceNotFoundException("Company user not found"));
    }
}
