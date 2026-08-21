package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "company_name", nullable = false, unique = true)
    private String companyName;

    @Column(nullable = false)
    private String industry;

    @Column
    private String website;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "hr_email", nullable = false, unique = true)
    private String hrEmail;

    @Column
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column
    private String city;

    @Column
    private String state;

    @Column
    private String country;

    @Column(name = "hr_contact_person")
    private String hrContactPerson;

    @Column
    private String designation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyStatus status = CompanyStatus.PENDING;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Company() {}

    public Company(Long id, User user, String companyName, String industry, String website, String logoUrl,
                   String description, String hrEmail, String phone, String address, String city,
                   String state, String country, String hrContactPerson, String designation,
                   CompanyStatus status, String rejectionReason, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.companyName = companyName;
        this.industry = industry;
        this.website = website;
        this.logoUrl = logoUrl;
        this.description = description;
        this.hrEmail = hrEmail;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.state = state;
        this.country = country;
        this.hrContactPerson = hrContactPerson;
        this.designation = designation;
        this.status = status;
        this.rejectionReason = rejectionReason;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static CompanyBuilder builder() { return new CompanyBuilder(); }

    public static class CompanyBuilder {
        private Long id;
        private User user;
        private String companyName;
        private String industry;
        private String website;
        private String logoUrl;
        private String description;
        private String hrEmail;
        private String phone;
        private String address;
        private String city;
        private String state;
        private String country;
        private String hrContactPerson;
        private String designation;
        private CompanyStatus status = CompanyStatus.PENDING;
        private String rejectionReason;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public CompanyBuilder id(Long id) { this.id = id; return this; }
        public CompanyBuilder user(User user) { this.user = user; return this; }
        public CompanyBuilder companyName(String companyName) { this.companyName = companyName; return this; }
        public CompanyBuilder industry(String industry) { this.industry = industry; return this; }
        public CompanyBuilder website(String website) { this.website = website; return this; }
        public CompanyBuilder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }
        public CompanyBuilder description(String description) { this.description = description; return this; }
        public CompanyBuilder hrEmail(String hrEmail) { this.hrEmail = hrEmail; return this; }
        public CompanyBuilder phone(String phone) { this.phone = phone; return this; }
        public CompanyBuilder address(String address) { this.address = address; return this; }
        public CompanyBuilder city(String city) { this.city = city; return this; }
        public CompanyBuilder state(String state) { this.state = state; return this; }
        public CompanyBuilder country(String country) { this.country = country; return this; }
        public CompanyBuilder hrContactPerson(String hrContactPerson) { this.hrContactPerson = hrContactPerson; return this; }
        public CompanyBuilder designation(String designation) { this.designation = designation; return this; }
        public CompanyBuilder status(CompanyStatus status) { this.status = status; return this; }
        public CompanyBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public CompanyBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CompanyBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Company build() {
            return new Company(id, user, companyName, industry, website, logoUrl, description, hrEmail,
                    phone, address, city, state, country, hrContactPerson, designation,
                    status, rejectionReason, createdAt, updatedAt);
        }
    }

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getHrEmail() { return hrEmail; }
    public void setHrEmail(String hrEmail) { this.hrEmail = hrEmail; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getHrContactPerson() { return hrContactPerson; }
    public void setHrContactPerson(String hrContactPerson) { this.hrContactPerson = hrContactPerson; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public CompanyStatus getStatus() { return status; }
    public void setStatus(CompanyStatus status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
