package com.opms.controller;

import com.opms.dto.*;
import com.opms.service.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officer")
@PreAuthorize("hasRole('PLACEMENT_OFFICER')")
public class OfficerPlacementController {

    private final ApplicationService applicationService;
    private final InterviewService interviewService;
    private final OfferService offerService;
    private final PlacementReportService reportService;

    public OfficerPlacementController(ApplicationService applicationService,
                                      InterviewService interviewService,
                                      OfferService offerService,
                                      PlacementReportService reportService) {
        this.applicationService = applicationService;
        this.interviewService = interviewService;
        this.offerService = offerService;
        this.reportService = reportService;
    }

    @GetMapping("/applications/all")
    public ResponseEntity<List<ApplicationDto>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/interviews/all")
    public ResponseEntity<List<InterviewDto>> getAllInterviews() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/offers/all")
    public ResponseEntity<List<OfferDto>> getAllOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    @GetMapping("/placements/all")
    public ResponseEntity<List<PlacementDto>> getAllPlacements() {
        return ResponseEntity.ok(offerService.getAllPlacements());
    }

    // ───────── Reports & Analytics ─────────
    @GetMapping("/reports/overall")
    public ResponseEntity<OverallPlacementReportDto> getOverallReport() {
        return ResponseEntity.ok(reportService.getOverallReport());
    }

    @GetMapping("/reports/department")
    public ResponseEntity<List<DepartmentPlacementReportDto>> getDepartmentReports() {
        return ResponseEntity.ok(reportService.getDepartmentReports());
    }

    @GetMapping("/reports/export")
    public ResponseEntity<byte[]> exportPlacementCsv() {
        String csv = reportService.exportPlacementCsv();
        byte[] body = csv.getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=opms_placement_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(body);
    }
}
