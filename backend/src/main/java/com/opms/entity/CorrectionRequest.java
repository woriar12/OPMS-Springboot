package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "correction_requests")
public class CorrectionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "field_name", nullable = false)
    private String fieldName;

    @Column(name = "current_value", nullable = false)
    private String currentValue;

    @Column(name = "requested_value", nullable = false)
    private String requestedValue;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CorrectionStatus status;

    @Column(name = "admin_comment", columnDefinition = "TEXT")
    private String adminComment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CorrectionRequest() {
    }

    public CorrectionRequest(Long id, Student student, String fieldName, String currentValue, String requestedValue, String reason, CorrectionStatus status, String adminComment, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.student = student;
        this.fieldName = fieldName;
        this.currentValue = currentValue;
        this.requestedValue = requestedValue;
        this.reason = reason;
        this.status = status;
        this.adminComment = adminComment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static CorrectionRequestBuilder builder() {
        return new CorrectionRequestBuilder();
    }

    public static class CorrectionRequestBuilder {
        private Long id;
        private Student student;
        private String fieldName;
        private String currentValue;
        private String requestedValue;
        private String reason;
        private CorrectionStatus status = CorrectionStatus.PENDING;
        private String adminComment;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public CorrectionRequestBuilder id(Long id) { this.id = id; return this; }
        public CorrectionRequestBuilder student(Student student) { this.student = student; return this; }
        public CorrectionRequestBuilder fieldName(String fieldName) { this.fieldName = fieldName; return this; }
        public CorrectionRequestBuilder currentValue(String currentValue) { this.currentValue = currentValue; return this; }
        public CorrectionRequestBuilder requestedValue(String requestedValue) { this.requestedValue = requestedValue; return this; }
        public CorrectionRequestBuilder reason(String reason) { this.reason = reason; return this; }
        public CorrectionRequestBuilder status(CorrectionStatus status) { this.status = status; return this; }
        public CorrectionRequestBuilder adminComment(String adminComment) { this.adminComment = adminComment; return this; }
        public CorrectionRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CorrectionRequestBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CorrectionRequest build() {
            return new CorrectionRequest(id, student, fieldName, currentValue, requestedValue, reason, status, adminComment, createdAt, updatedAt);
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = CorrectionStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public String getCurrentValue() { return currentValue; }
    public void setCurrentValue(String currentValue) { this.currentValue = currentValue; }

    public String getRequestedValue() { return requestedValue; }
    public void setRequestedValue(String requestedValue) { this.requestedValue = requestedValue; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public CorrectionStatus getStatus() { return status; }
    public void setStatus(CorrectionStatus status) { this.status = status; }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
