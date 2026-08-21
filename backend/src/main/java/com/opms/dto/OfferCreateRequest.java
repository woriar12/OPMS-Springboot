package com.opms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class OfferCreateRequest {
    @NotBlank(message = "Job role is required")
    private String jobRole;
    @NotNull(message = "CTC package is required")
    private Double ctc;
    private LocalDate joiningDate;
    private String joiningLocation;
    private String offerLetterUrl;

    public OfferCreateRequest() {}

    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public Double getCtc() { return ctc; }
    public void setCtc(Double ctc) { this.ctc = ctc; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    public String getJoiningLocation() { return joiningLocation; }
    public void setJoiningLocation(String joiningLocation) { this.joiningLocation = joiningLocation; }
    public String getOfferLetterUrl() { return offerLetterUrl; }
    public void setOfferLetterUrl(String offerLetterUrl) { this.offerLetterUrl = offerLetterUrl; }
}
