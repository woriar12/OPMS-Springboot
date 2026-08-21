package com.opms.dto;

import java.time.LocalDateTime;

public class CompanyDto {
    private Long id;
    private Long userId;
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
    private String status;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CompanyDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Long userId; private String companyName;
        private String industry; private String website; private String logoUrl;
        private String description; private String hrEmail; private String phone;
        private String address; private String city; private String state;
        private String country; private String hrContactPerson; private String designation;
        private String status; private String rejectionReason;
        private LocalDateTime createdAt; private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder companyName(String companyName) { this.companyName = companyName; return this; }
        public Builder industry(String industry) { this.industry = industry; return this; }
        public Builder website(String website) { this.website = website; return this; }
        public Builder logoUrl(String logoUrl) { this.logoUrl = logoUrl; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder hrEmail(String hrEmail) { this.hrEmail = hrEmail; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder address(String address) { this.address = address; return this; }
        public Builder city(String city) { this.city = city; return this; }
        public Builder state(String state) { this.state = state; return this; }
        public Builder country(String country) { this.country = country; return this; }
        public Builder hrContactPerson(String hrContactPerson) { this.hrContactPerson = hrContactPerson; return this; }
        public Builder designation(String designation) { this.designation = designation; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CompanyDto build() {
            CompanyDto dto = new CompanyDto();
            dto.id = id; dto.userId = userId; dto.companyName = companyName;
            dto.industry = industry; dto.website = website; dto.logoUrl = logoUrl;
            dto.description = description; dto.hrEmail = hrEmail; dto.phone = phone;
            dto.address = address; dto.city = city; dto.state = state; dto.country = country;
            dto.hrContactPerson = hrContactPerson; dto.designation = designation;
            dto.status = status; dto.rejectionReason = rejectionReason;
            dto.createdAt = createdAt; dto.updatedAt = updatedAt;
            return dto;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
