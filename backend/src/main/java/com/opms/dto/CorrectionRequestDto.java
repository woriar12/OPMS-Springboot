package com.opms.dto;

import com.opms.entity.CorrectionStatus;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class CorrectionRequestDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String registerNumber;
    private String departmentCode;

    @NotBlank(message = "Field name is required")
    private String fieldName;

    @NotBlank(message = "Current value is required")
    private String currentValue;

    @NotBlank(message = "Requested value is required")
    private String requestedValue;

    @NotBlank(message = "Reason is required")
    private String reason;

    private CorrectionStatus status;
    private String adminComment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CorrectionRequestDto() {
    }

    public CorrectionRequestDto(Long id, Long studentId, String studentName, String registerNumber, String departmentCode, String fieldName, String currentValue, String requestedValue, String reason, CorrectionStatus status, String adminComment, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.registerNumber = registerNumber;
        this.departmentCode = departmentCode;
        this.fieldName = fieldName;
        this.currentValue = currentValue;
        this.requestedValue = requestedValue;
        this.reason = reason;
        this.status = status;
        this.adminComment = adminComment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static CorrectionRequestDtoBuilder builder() {
        return new CorrectionRequestDtoBuilder();
    }

    public static class CorrectionRequestDtoBuilder {
        private Long id;
        private Long studentId;
        private String studentName;
        private String registerNumber;
        private String departmentCode;
        private String fieldName;
        private String currentValue;
        private String requestedValue;
        private String reason;
        private CorrectionStatus status;
        private String adminComment;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public CorrectionRequestDtoBuilder id(Long id) { this.id = id; return this; }
        public CorrectionRequestDtoBuilder studentId(Long studentId) { this.studentId = studentId; return this; }
        public CorrectionRequestDtoBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public CorrectionRequestDtoBuilder registerNumber(String registerNumber) { this.registerNumber = registerNumber; return this; }
        public CorrectionRequestDtoBuilder departmentCode(String departmentCode) { this.departmentCode = departmentCode; return this; }
        public CorrectionRequestDtoBuilder fieldName(String fieldName) { this.fieldName = fieldName; return this; }
        public CorrectionRequestDtoBuilder currentValue(String currentValue) { this.currentValue = currentValue; return this; }
        public CorrectionRequestDtoBuilder requestedValue(String requestedValue) { this.requestedValue = requestedValue; return this; }
        public CorrectionRequestDtoBuilder reason(String reason) { this.reason = reason; return this; }
        public CorrectionRequestDtoBuilder status(CorrectionStatus status) { this.status = status; return this; }
        public CorrectionRequestDtoBuilder adminComment(String adminComment) { this.adminComment = adminComment; return this; }
        public CorrectionRequestDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CorrectionRequestDtoBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CorrectionRequestDto build() {
            return new CorrectionRequestDto(id, studentId, studentName, registerNumber, departmentCode, fieldName, currentValue, requestedValue, reason, status, adminComment, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }

    public String getCurrentValue() { return currentValue; }
    public void setCurrentValue(String currentValue) { this.currentValue = currentValue; }

    public String getRequestedValue() { return requestedValue; }
    public void setRequestedValue(String requestedValue) { this.requestedValue = requestedValue; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public CorrectionStatus getStatus() { return status; }
    public void setStatus(CorrectionStatus status) { this.status = status; }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
