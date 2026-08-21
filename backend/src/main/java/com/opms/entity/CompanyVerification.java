package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "company_verifications")
public class CompanyVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyStatus status;

    @Column(name = "verification_comment", columnDefinition = "TEXT")
    private String verificationComment;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public CompanyVerification() {}

    public CompanyVerification(Long id, Company company, User verifiedBy, CompanyStatus status,
                                String verificationComment, String rejectionReason,
                                LocalDateTime verifiedAt, LocalDateTime createdAt) {
        this.id = id;
        this.company = company;
        this.verifiedBy = verifiedBy;
        this.status = status;
        this.verificationComment = verificationComment;
        this.rejectionReason = rejectionReason;
        this.verifiedAt = verifiedAt;
        this.createdAt = createdAt;
    }

    public static CompanyVerificationBuilder builder() { return new CompanyVerificationBuilder(); }

    public static class CompanyVerificationBuilder {
        private Long id;
        private Company company;
        private User verifiedBy;
        private CompanyStatus status;
        private String verificationComment;
        private String rejectionReason;
        private LocalDateTime verifiedAt;
        private LocalDateTime createdAt;

        public CompanyVerificationBuilder id(Long id) { this.id = id; return this; }
        public CompanyVerificationBuilder company(Company company) { this.company = company; return this; }
        public CompanyVerificationBuilder verifiedBy(User verifiedBy) { this.verifiedBy = verifiedBy; return this; }
        public CompanyVerificationBuilder status(CompanyStatus status) { this.status = status; return this; }
        public CompanyVerificationBuilder verificationComment(String c) { this.verificationComment = c; return this; }
        public CompanyVerificationBuilder rejectionReason(String r) { this.rejectionReason = r; return this; }
        public CompanyVerificationBuilder verifiedAt(LocalDateTime t) { this.verifiedAt = t; return this; }
        public CompanyVerificationBuilder createdAt(LocalDateTime t) { this.createdAt = t; return this; }

        public CompanyVerification build() {
            return new CompanyVerification(id, company, verifiedBy, status, verificationComment, rejectionReason, verifiedAt, createdAt);
        }
    }

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public User getVerifiedBy() { return verifiedBy; }
    public void setVerifiedBy(User verifiedBy) { this.verifiedBy = verifiedBy; }
    public CompanyStatus getStatus() { return status; }
    public void setStatus(CompanyStatus status) { this.status = status; }
    public String getVerificationComment() { return verificationComment; }
    public void setVerificationComment(String verificationComment) { this.verificationComment = verificationComment; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
