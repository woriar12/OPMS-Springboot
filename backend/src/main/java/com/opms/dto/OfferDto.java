package com.opms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class OfferDto {
    private Long id;
    private Long applicationId;
    private String studentName;
    private String registerNumber;
    private String studentEmail;
    private String companyName;
    private String driveTitle;
    private String offerNumber;
    private String jobRole;
    private Double ctc;
    private LocalDate joiningDate;
    private String joiningLocation;
    private String offerLetterUrl;
    private LocalDateTime issuedAt;
    private String status;
    private String studentResponse;
    private LocalDateTime createdAt;

    public OfferDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final OfferDto dto = new OfferDto();
        public Builder id(Long id) { dto.id = id; return this; }
        public Builder applicationId(Long a) { dto.applicationId = a; return this; }
        public Builder studentName(String n) { dto.studentName = n; return this; }
        public Builder registerNumber(String r) { dto.registerNumber = r; return this; }
        public Builder studentEmail(String e) { dto.studentEmail = e; return this; }
        public Builder companyName(String c) { dto.companyName = c; return this; }
        public Builder driveTitle(String t) { dto.driveTitle = t; return this; }
        public Builder offerNumber(String o) { dto.offerNumber = o; return this; }
        public Builder jobRole(String r) { dto.jobRole = r; return this; }
        public Builder ctc(Double ctc) { dto.ctc = ctc; return this; }
        public Builder joiningDate(LocalDate d) { dto.joiningDate = d; return this; }
        public Builder joiningLocation(String l) { dto.joiningLocation = l; return this; }
        public Builder offerLetterUrl(String u) { dto.offerLetterUrl = u; return this; }
        public Builder issuedAt(LocalDateTime i) { dto.issuedAt = i; return this; }
        public Builder status(String s) { dto.status = s; return this; }
        public Builder studentResponse(String r) { dto.studentResponse = r; return this; }
        public Builder createdAt(LocalDateTime c) { dto.createdAt = c; return this; }
        public OfferDto build() { return dto; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getDriveTitle() { return driveTitle; }
    public void setDriveTitle(String driveTitle) { this.driveTitle = driveTitle; }
    public String getOfferNumber() { return offerNumber; }
    public void setOfferNumber(String offerNumber) { this.offerNumber = offerNumber; }
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
    public LocalDateTime getIssuedAt() { return issuedAt; }
    public void setIssuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStudentResponse() { return studentResponse; }
    public void setStudentResponse(String studentResponse) { this.studentResponse = studentResponse; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
