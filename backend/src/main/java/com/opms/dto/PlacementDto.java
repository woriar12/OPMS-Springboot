package com.opms.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PlacementDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String registerNumber;
    private String departmentName;
    private String companyName;
    private String companyLogoUrl;
    private String driveTitle;
    private String jobRole;
    private Double packageAmount;
    private LocalDate joiningDate;
    private LocalDate placementDate;
    private LocalDateTime createdAt;

    public PlacementDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final PlacementDto dto = new PlacementDto();
        public Builder id(Long id) { dto.id = id; return this; }
        public Builder studentId(Long s) { dto.studentId = s; return this; }
        public Builder studentName(String n) { dto.studentName = n; return this; }
        public Builder registerNumber(String r) { dto.registerNumber = r; return this; }
        public Builder departmentName(String d) { dto.departmentName = d; return this; }
        public Builder companyName(String c) { dto.companyName = c; return this; }
        public Builder companyLogoUrl(String l) { dto.companyLogoUrl = l; return this; }
        public Builder driveTitle(String t) { dto.driveTitle = t; return this; }
        public Builder jobRole(String r) { dto.jobRole = r; return this; }
        public Builder packageAmount(Double p) { dto.packageAmount = p; return this; }
        public Builder joiningDate(LocalDate j) { dto.joiningDate = j; return this; }
        public Builder placementDate(LocalDate p) { dto.placementDate = p; return this; }
        public Builder createdAt(LocalDateTime c) { dto.createdAt = c; return this; }
        public PlacementDto build() { return dto; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getCompanyLogoUrl() { return companyLogoUrl; }
    public void setCompanyLogoUrl(String companyLogoUrl) { this.companyLogoUrl = companyLogoUrl; }
    public String getDriveTitle() { return driveTitle; }
    public void setDriveTitle(String driveTitle) { this.driveTitle = driveTitle; }
    public String getJobRole() { return jobRole; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }
    public Double getPackageAmount() { return packageAmount; }
    public void setPackageAmount(Double packageAmount) { this.packageAmount = packageAmount; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
    public LocalDate getPlacementDate() { return placementDate; }
    public void setPlacementDate(LocalDate placementDate) { this.placementDate = placementDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
