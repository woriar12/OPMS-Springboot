package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "department_code", nullable = false, unique = true)
    private String departmentCode;

    @Column(name = "department_name", nullable = false)
    private String departmentName;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Department() {
    }

    public Department(Long id, String departmentCode, String departmentName, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.departmentCode = departmentCode;
        this.departmentName = departmentName;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static DepartmentBuilder builder() {
        return new DepartmentBuilder();
    }

    public static class DepartmentBuilder {
        private Long id;
        private String departmentCode;
        private String departmentName;
        private String status = "ACTIVE";
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public DepartmentBuilder id(Long id) { this.id = id; return this; }
        public DepartmentBuilder departmentCode(String departmentCode) { this.departmentCode = departmentCode; return this; }
        public DepartmentBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public DepartmentBuilder status(String status) { this.status = status; return this; }
        public DepartmentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DepartmentBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Department build() {
            return new Department(id, departmentCode, departmentName, status, createdAt, updatedAt);
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = "ACTIVE";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
