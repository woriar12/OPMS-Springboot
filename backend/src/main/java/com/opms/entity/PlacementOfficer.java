package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_officers")
public class PlacementOfficer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "employee_id", unique = true)
    private String employeeId;

    @Column
    private String phone;

    @Column(name = "department")
    private String department;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PlacementOfficer() {}

    public PlacementOfficer(Long id, User user, String fullName, String employeeId, String phone, String department, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.fullName = fullName;
        this.employeeId = employeeId;
        this.phone = phone;
        this.department = department;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static PlacementOfficerBuilder builder() { return new PlacementOfficerBuilder(); }

    public static class PlacementOfficerBuilder {
        private Long id;
        private User user;
        private String fullName;
        private String employeeId;
        private String phone;
        private String department;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public PlacementOfficerBuilder id(Long id) { this.id = id; return this; }
        public PlacementOfficerBuilder user(User user) { this.user = user; return this; }
        public PlacementOfficerBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public PlacementOfficerBuilder employeeId(String employeeId) { this.employeeId = employeeId; return this; }
        public PlacementOfficerBuilder phone(String phone) { this.phone = phone; return this; }
        public PlacementOfficerBuilder department(String department) { this.department = department; return this; }
        public PlacementOfficerBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PlacementOfficerBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public PlacementOfficer build() {
            return new PlacementOfficer(id, user, fullName, employeeId, phone, department, createdAt, updatedAt);
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
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
