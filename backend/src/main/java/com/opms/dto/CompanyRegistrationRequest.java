package com.opms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CompanyRegistrationRequest {
    @NotBlank(message = "Company name is required")
    private String companyName;
    @NotBlank(message = "Industry is required")
    private String industry;
    private String website;
    private String logoUrl;
    private String description;
    @NotBlank(message = "HR email is required")
    @Email(message = "Invalid email format")
    private String hrEmail;
    @NotBlank(message = "Phone is required")
    private String phone;
    private String address;
    private String city;
    private String state;
    private String country;
    private String hrContactPerson;
    private String designation;

    public CompanyRegistrationRequest() {}

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
}
