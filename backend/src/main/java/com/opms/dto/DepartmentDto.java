package com.opms.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class DepartmentDto {
    private Long id;

    @NotBlank(message = "Department code is required")
    private String departmentCode;

    @NotBlank(message = "Department name is required")
    private String departmentName;

    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DepartmentDto() {
    }

    public DepartmentDto(Long id, String departmentCode, String departmentName, String status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.departmentCode = departmentCode;
        this.departmentName = departmentName;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static DepartmentDtoBuilder builder() {
        return new DepartmentDtoBuilder();
    }

    public static class DepartmentDtoBuilder {
        private Long id;
        private String departmentCode;
        private String departmentName;
        private String status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public DepartmentDtoBuilder id(Long id) { this.id = id; return this; }
        public DepartmentDtoBuilder departmentCode(String departmentCode) { this.departmentCode = departmentCode; return this; }
        public DepartmentDtoBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public DepartmentDtoBuilder status(String status) { this.status = status; return this; }
        public DepartmentDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DepartmentDtoBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public DepartmentDto build() {
            return new DepartmentDto(id, departmentCode, departmentName, status, createdAt, updatedAt);
        }
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
