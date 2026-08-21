package com.opms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class PlacementOfficerDto {
    private Long id;
    private Long userId;
    private String username;
    @NotBlank(message = "Full name is required")
    private String fullName;
    private String employeeId;
    @Email
    private String email;
    private String phone;
    private String department;
    private String status;
    private LocalDateTime createdAt;

    public PlacementOfficerDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private Long userId; private String username;
        private String fullName; private String employeeId; private String email;
        private String phone; private String department; private String status;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder department(String department) { this.department = department; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public PlacementOfficerDto build() {
            PlacementOfficerDto dto = new PlacementOfficerDto();
            dto.id = id; dto.userId = userId; dto.username = username;
            dto.fullName = fullName; dto.employeeId = employeeId; dto.email = email;
            dto.phone = phone; dto.department = department; dto.status = status;
            dto.createdAt = createdAt;
            return dto;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
