package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_drives")
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(name = "job_role", nullable = false)
    private String jobRole;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column
    private String industry;

    @Column(name = "job_type")
    private String jobType;

    @Column
    private String location;

    @Column(name = "work_mode")
    private String workMode;

    @Column(name = "salary_min")
    private Double salaryMin;

    @Column(name = "salary_max")
    private Double salaryMax;

    @Column(name = "salary_description")
    private String salaryDescription;

    @Column(name = "application_start_date")
    private LocalDate applicationStartDate;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Column(name = "drive_date")
    private LocalDate driveDate;

    @Column(name = "minimum_cgpa")
    private Double minimumCgpa;

    @Column(name = "maximum_backlogs")
    private Integer maximumBacklogs;

    @Column(name = "graduation_batch")
    private String graduationBatch;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriveStatus status = DriveStatus.DRAFT;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PlacementDrive() {}

    public static PlacementDriveBuilder builder() { return new PlacementDriveBuilder(); }

    public static class PlacementDriveBuilder {
        private Long id;
        private Company company;
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
        private DriveStatus status = DriveStatus.DRAFT;
        private String rejectionReason;
        private User approvedBy;

        public PlacementDriveBuilder id(Long id) { this.id = id; return this; }
        public PlacementDriveBuilder company(Company company) { this.company = company; return this; }
        public PlacementDriveBuilder title(String title) { this.title = title; return this; }
        public PlacementDriveBuilder jobRole(String jobRole) { this.jobRole = jobRole; return this; }
        public PlacementDriveBuilder description(String description) { this.description = description; return this; }
        public PlacementDriveBuilder industry(String industry) { this.industry = industry; return this; }
        public PlacementDriveBuilder jobType(String jobType) { this.jobType = jobType; return this; }
        public PlacementDriveBuilder location(String location) { this.location = location; return this; }
        public PlacementDriveBuilder workMode(String workMode) { this.workMode = workMode; return this; }
        public PlacementDriveBuilder salaryMin(Double salaryMin) { this.salaryMin = salaryMin; return this; }
        public PlacementDriveBuilder salaryMax(Double salaryMax) { this.salaryMax = salaryMax; return this; }
        public PlacementDriveBuilder salaryDescription(String s) { this.salaryDescription = s; return this; }
        public PlacementDriveBuilder applicationStartDate(LocalDate d) { this.applicationStartDate = d; return this; }
        public PlacementDriveBuilder applicationDeadline(LocalDate d) { this.applicationDeadline = d; return this; }
        public PlacementDriveBuilder driveDate(LocalDate d) { this.driveDate = d; return this; }
        public PlacementDriveBuilder minimumCgpa(Double minimumCgpa) { this.minimumCgpa = minimumCgpa; return this; }
        public PlacementDriveBuilder maximumBacklogs(Integer maximumBacklogs) { this.maximumBacklogs = maximumBacklogs; return this; }
        public PlacementDriveBuilder graduationBatch(String graduationBatch) { this.graduationBatch = graduationBatch; return this; }
        public PlacementDriveBuilder requiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; return this; }
        public PlacementDriveBuilder status(DriveStatus status) { this.status = status; return this; }
        public PlacementDriveBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public PlacementDriveBuilder approvedBy(User approvedBy) { this.approvedBy = approvedBy; return this; }

        public PlacementDrive build() {
            PlacementDrive d = new PlacementDrive();
            d.id = id; d.company = company; d.title = title; d.jobRole = jobRole;
            d.description = description; d.industry = industry; d.jobType = jobType;
            d.location = location; d.workMode = workMode; d.salaryMin = salaryMin;
            d.salaryMax = salaryMax; d.salaryDescription = salaryDescription;
            d.applicationStartDate = applicationStartDate; d.applicationDeadline = applicationDeadline;
            d.driveDate = driveDate; d.minimumCgpa = minimumCgpa; d.maximumBacklogs = maximumBacklogs;
            d.graduationBatch = graduationBatch; d.requiredSkills = requiredSkills;
            d.status = status; d.rejectionReason = rejectionReason; d.approvedBy = approvedBy;
            return d;
        }
    }

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
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
    public DriveStatus getStatus() { return status; }
    public void setStatus(DriveStatus status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
