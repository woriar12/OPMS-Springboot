package com.opms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PlacementDriveDto {
    private Long id;
    private Long companyId;
    private String companyName;
    private String companyLogoUrl;
    private String title;
    private String jobRole;
    private String description;
    private String industry;
    private String jobType;
    private String location;
    private String workMode;
    private Double salaryMin;
    private Double salaryMax;
    private String salaryDescription;
    private LocalDate applicationStartDate;
    private LocalDate applicationDeadline;
    private LocalDate driveDate;
    private Double minimumCgpa;
    private Integer maximumBacklogs;
    private String graduationBatch;
    private String requiredSkills;
    private String status;
    private String rejectionReason;
    private String approvedByUsername;
    private List<DepartmentInfo> eligibleDepartments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class DepartmentInfo {
        private Long id;
        private String departmentCode;
        private String departmentName;
        public DepartmentInfo() {}
        public DepartmentInfo(Long id, String departmentCode, String departmentName) {
            this.id = id; this.departmentCode = departmentCode; this.departmentName = departmentName;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getDepartmentCode() { return departmentCode; }
        public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    }

    public PlacementDriveDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PlacementDriveDto dto = new PlacementDriveDto();
        public Builder id(Long id) { dto.id = id; return this; }
        public Builder companyId(Long companyId) { dto.companyId = companyId; return this; }
        public Builder companyName(String companyName) { dto.companyName = companyName; return this; }
        public Builder companyLogoUrl(String companyLogoUrl) { dto.companyLogoUrl = companyLogoUrl; return this; }
        public Builder title(String title) { dto.title = title; return this; }
        public Builder jobRole(String jobRole) { dto.jobRole = jobRole; return this; }
        public Builder description(String description) { dto.description = description; return this; }
        public Builder industry(String industry) { dto.industry = industry; return this; }
        public Builder jobType(String jobType) { dto.jobType = jobType; return this; }
        public Builder location(String location) { dto.location = location; return this; }
        public Builder workMode(String workMode) { dto.workMode = workMode; return this; }
        public Builder salaryMin(Double salaryMin) { dto.salaryMin = salaryMin; return this; }
        public Builder salaryMax(Double salaryMax) { dto.salaryMax = salaryMax; return this; }
        public Builder salaryDescription(String s) { dto.salaryDescription = s; return this; }
        public Builder applicationStartDate(LocalDate d) { dto.applicationStartDate = d; return this; }
        public Builder applicationDeadline(LocalDate d) { dto.applicationDeadline = d; return this; }
        public Builder driveDate(LocalDate d) { dto.driveDate = d; return this; }
        public Builder minimumCgpa(Double minimumCgpa) { dto.minimumCgpa = minimumCgpa; return this; }
        public Builder maximumBacklogs(Integer maximumBacklogs) { dto.maximumBacklogs = maximumBacklogs; return this; }
        public Builder graduationBatch(String graduationBatch) { dto.graduationBatch = graduationBatch; return this; }
        public Builder requiredSkills(String requiredSkills) { dto.requiredSkills = requiredSkills; return this; }
        public Builder status(String status) { dto.status = status; return this; }
        public Builder rejectionReason(String rejectionReason) { dto.rejectionReason = rejectionReason; return this; }
        public Builder approvedByUsername(String approvedByUsername) { dto.approvedByUsername = approvedByUsername; return this; }
        public Builder eligibleDepartments(List<DepartmentInfo> eligibleDepartments) { dto.eligibleDepartments = eligibleDepartments; return this; }
        public Builder createdAt(LocalDateTime createdAt) { dto.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { dto.updatedAt = updatedAt; return this; }
        public PlacementDriveDto build() { return dto; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getWorkMode() { return workMode; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }
    public Double getSalaryMin() { return salaryMin; }
    public void setSalaryMin(Double salaryMin) { this.salaryMin = salaryMin; }
    public Double getSalaryMax() { return salaryMax; }
    public void setSalaryMax(Double salaryMax) { this.salaryMax = salaryMax; }
    public String getSalaryDescription() { return salaryDescription; }
    public void setSalaryDescription(String salaryDescription) { this.salaryDescription = salaryDescription; }
    public LocalDate getApplicationStartDate() { return applicationStartDate; }
    public void setApplicationStartDate(LocalDate applicationStartDate) { this.applicationStartDate = applicationStartDate; }
    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }
    public LocalDate getDriveDate() { return driveDate; }
    public void setDriveDate(LocalDate driveDate) { this.driveDate = driveDate; }
    public Double getMinimumCgpa() { return minimumCgpa; }
    public void setMinimumCgpa(Double minimumCgpa) { this.minimumCgpa = minimumCgpa; }
    public Integer getMaximumBacklogs() { return maximumBacklogs; }
    public void setMaximumBacklogs(Integer maximumBacklogs) { this.maximumBacklogs = maximumBacklogs; }
    public String getGraduationBatch() { return graduationBatch; }
    public void setGraduationBatch(String graduationBatch) { this.graduationBatch = graduationBatch; }
    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public String getApprovedByUsername() { return approvedByUsername; }
    public void setApprovedByUsername(String approvedByUsername) { this.approvedByUsername = approvedByUsername; }
    public List<DepartmentInfo> getEligibleDepartments() { return eligibleDepartments; }
    public void setEligibleDepartments(List<DepartmentInfo> eligibleDepartments) { this.eligibleDepartments = eligibleDepartments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
