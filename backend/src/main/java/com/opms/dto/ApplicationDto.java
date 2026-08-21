package com.opms.dto;

import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String registerNumber;
    private String rollNumber;
    private String departmentName;
    private String departmentCode;
    private Double cgpa;
    private Integer activeBacklogs;
    private String studentEmail;
    private String resumeUrl;

    private Long driveId;
    private String driveTitle;
    private String jobRole;
    private Long companyId;
    private String companyName;
    private String companyLogoUrl;

    private LocalDateTime appliedAt;
    private String status;
    private String coverLetter;
    private String resumeSnapshotUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ApplicationDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ApplicationDto dto = new ApplicationDto();
        public Builder id(Long id) { dto.id = id; return this; }
        public Builder studentId(Long studentId) { dto.studentId = studentId; return this; }
        public Builder studentName(String studentName) { dto.studentName = studentName; return this; }
        public Builder registerNumber(String r) { dto.registerNumber = r; return this; }
        public Builder rollNumber(String r) { dto.rollNumber = r; return this; }
        public Builder departmentName(String d) { dto.departmentName = d; return this; }
        public Builder departmentCode(String c) { dto.departmentCode = c; return this; }
        public Builder cgpa(Double cgpa) { dto.cgpa = cgpa; return this; }
        public Builder activeBacklogs(Integer b) { dto.activeBacklogs = b; return this; }
        public Builder studentEmail(String e) { dto.studentEmail = e; return this; }
        public Builder resumeUrl(String r) { dto.resumeUrl = r; return this; }
        public Builder driveId(Long driveId) { dto.driveId = driveId; return this; }
        public Builder driveTitle(String t) { dto.driveTitle = t; return this; }
        public Builder jobRole(String r) { dto.jobRole = r; return this; }
        public Builder companyId(Long c) { dto.companyId = c; return this; }
        public Builder companyName(String n) { dto.companyName = n; return this; }
        public Builder companyLogoUrl(String l) { dto.companyLogoUrl = l; return this; }
        public Builder appliedAt(LocalDateTime a) { dto.appliedAt = a; return this; }
        public Builder status(String s) { dto.status = s; return this; }
        public Builder coverLetter(String c) { dto.coverLetter = c; return this; }
        public Builder resumeSnapshotUrl(String r) { dto.resumeSnapshotUrl = r; return this; }
        public Builder createdAt(LocalDateTime c) { dto.createdAt = c; return this; }
        public Builder updatedAt(LocalDateTime u) { dto.updatedAt = u; return this; }
        public ApplicationDto build() { return dto; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }
    public Integer getActiveBacklogs() { return activeBacklogs; }
    public void setActiveBacklogs(Integer activeBacklogs) { this.activeBacklogs = activeBacklogs; }
    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }
    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
    public Long getDriveId() { return driveId; }
    public void setDriveId(Long driveId) { this.driveId = driveId; }
    public String getDriveTitle() { return driveTitle; }
    public void setDriveTitle(String driveTitle) { this.driveTitle = driveTitle; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getResumeSnapshotUrl() { return resumeSnapshotUrl; }
    public void setResumeSnapshotUrl(String resumeSnapshotUrl) { this.resumeSnapshotUrl = resumeSnapshotUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
