package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "placements",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id"}))
public class Placement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drive_id", nullable = false)
    private PlacementDrive drive;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id", nullable = false)
    private Offer offer;

    @Column(name = "job_role", nullable = false)
    private String jobRole;

    @Column(name = "package_amount", nullable = false)
    private Double packageAmount;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "placement_date", nullable = false)
    private LocalDate placementDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Placement() {}

    public static PlacementBuilder builder() { return new PlacementBuilder(); }

    public static class PlacementBuilder {
        private Long id;
        private Student student;
        private Company company;
        private PlacementDrive drive;
        private Application application;
        private Offer offer;
        private String jobRole;
        private Double packageAmount;
        private LocalDate joiningDate;
        private LocalDate placementDate;

        public PlacementBuilder id(Long id) { this.id = id; return this; }
        public PlacementBuilder student(Student student) { this.student = student; return this; }
        public PlacementBuilder company(Company company) { this.company = company; return this; }
        public PlacementBuilder drive(PlacementDrive drive) { this.drive = drive; return this; }
        public PlacementBuilder application(Application application) { this.application = application; return this; }
        public PlacementBuilder offer(Offer offer) { this.offer = offer; return this; }
        public PlacementBuilder jobRole(String jobRole) { this.jobRole = jobRole; return this; }
        public PlacementBuilder packageAmount(Double packageAmount) { this.packageAmount = packageAmount; return this; }
        public PlacementBuilder joiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; return this; }
        public PlacementBuilder placementDate(LocalDate placementDate) { this.placementDate = placementDate; return this; }

        public Placement build() {
            Placement p = new Placement();
            p.id = id; p.student = student; p.company = company; p.drive = drive;
            p.application = application; p.offer = offer; p.jobRole = jobRole;
            p.packageAmount = packageAmount; p.joiningDate = joiningDate;
            p.placementDate = placementDate != null ? placementDate : LocalDate.now();
            return p;
        }
    }

    @PrePersist
    protected void onCreate() {
        if (placementDate == null) placementDate = LocalDate.now();
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    public PlacementDrive getDrive() { return drive; }
    public void setDrive(PlacementDrive drive) { this.drive = drive; }
    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
    public Offer getOffer() { return offer; }
    public void setOffer(Offer offer) { this.offer = offer; }
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
