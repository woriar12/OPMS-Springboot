package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "offers")
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(name = "offer_number", nullable = false, unique = true)
    private String offerNumber;

    @Column(name = "job_role", nullable = false)
    private String jobRole;

    @Column(nullable = false)
    private Double ctc;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "joining_location")
    private String joiningLocation;

    @Column(name = "offer_letter_url")
    private String offerLetterUrl;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OfferStatus status = OfferStatus.GENERATED;

    @Column(name = "student_response", columnDefinition = "TEXT")
    private String studentResponse;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Offer() {}

    public static OfferBuilder builder() { return new OfferBuilder(); }

    public static class OfferBuilder {
        private Long id;
        private Application application;
        private String offerNumber;
        private String jobRole;
        private Double ctc;
        private LocalDate joiningDate;
        private String joiningLocation;
        private String offerLetterUrl;
        private LocalDateTime issuedAt;
        private OfferStatus status = OfferStatus.GENERATED;
        private String studentResponse;

        public OfferBuilder id(Long id) { this.id = id; return this; }
        public OfferBuilder application(Application application) { this.application = application; return this; }
        public OfferBuilder offerNumber(String offerNumber) { this.offerNumber = offerNumber; return this; }
        public OfferBuilder jobRole(String jobRole) { this.jobRole = jobRole; return this; }
        public OfferBuilder ctc(Double ctc) { this.ctc = ctc; return this; }
        public OfferBuilder joiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; return this; }
        public OfferBuilder joiningLocation(String joiningLocation) { this.joiningLocation = joiningLocation; return this; }
        public OfferBuilder offerLetterUrl(String offerLetterUrl) { this.offerLetterUrl = offerLetterUrl; return this; }
        public OfferBuilder issuedAt(LocalDateTime issuedAt) { this.issuedAt = issuedAt; return this; }
        public OfferBuilder status(OfferStatus status) { this.status = status; return this; }
        public OfferBuilder studentResponse(String studentResponse) { this.studentResponse = studentResponse; return this; }

        public Offer build() {
            Offer offer = new Offer();
            offer.id = id; offer.application = application; offer.offerNumber = offerNumber;
            offer.jobRole = jobRole; offer.ctc = ctc; offer.joiningDate = joiningDate;
            offer.joiningLocation = joiningLocation; offer.offerLetterUrl = offerLetterUrl;
            offer.issuedAt = issuedAt; offer.status = status; offer.studentResponse = studentResponse;
            return offer;
        }
    }

    @PrePersist
    protected void onCreate() {
        if (issuedAt == null) issuedAt = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
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
    public OfferStatus getStatus() { return status; }
    public void setStatus(OfferStatus status) { this.status = status; }
    public String getStudentResponse() { return studentResponse; }
    public void setStudentResponse(String studentResponse) { this.studentResponse = studentResponse; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
