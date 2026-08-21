package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "drive_id"}))
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    @Column(name = "applied_at", nullable = false)
    private LocalDateTime appliedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "resume_snapshot_url")
    private String resumeSnapshotUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Application() {}

    public static ApplicationBuilder builder() { return new ApplicationBuilder(); }

    public static class ApplicationBuilder {
        private Long id;
        private Student student;
        private PlacementDrive drive;
        private LocalDateTime appliedAt;
        private ApplicationStatus status = ApplicationStatus.APPLIED;
        private String coverLetter;
        private String resumeSnapshotUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ApplicationBuilder id(Long id) { this.id = id; return this; }
        public ApplicationBuilder student(Student student) { this.student = student; return this; }
        public ApplicationBuilder drive(PlacementDrive drive) { this.drive = drive; return this; }
        public ApplicationBuilder appliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; return this; }
        public ApplicationBuilder status(ApplicationStatus status) { this.status = status; return this; }
        public ApplicationBuilder coverLetter(String coverLetter) { this.coverLetter = coverLetter; return this; }
        public ApplicationBuilder resumeSnapshotUrl(String resumeSnapshotUrl) { this.resumeSnapshotUrl = resumeSnapshotUrl; return this; }
        public ApplicationBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ApplicationBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Application build() {
            Application app = new Application();
            app.id = id; app.student = student; app.drive = drive;
            app.appliedAt = appliedAt; app.status = status; app.coverLetter = coverLetter;
            app.resumeSnapshotUrl = resumeSnapshotUrl; app.createdAt = createdAt; app.updatedAt = updatedAt;
            return app;
        }
    }

    @PrePersist
    protected void onCreate() {
        if (appliedAt == null) appliedAt = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public PlacementDrive getDrive() { return drive; }
    public void setDrive(PlacementDrive drive) { this.drive = drive; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getResumeSnapshotUrl() { return resumeSnapshotUrl; }
    public void setResumeSnapshotUrl(String resumeSnapshotUrl) { this.resumeSnapshotUrl = resumeSnapshotUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
