package com.opms.dto;

import java.time.LocalDateTime;

public class ApplicationStatusHistoryDto {
    private Long id;
    private String status;
    private String comment;
    private String changedByUsername;
    private LocalDateTime createdAt;

    public ApplicationStatusHistoryDto() {}
    public ApplicationStatusHistoryDto(Long id, String status, String comment, String changedByUsername, LocalDateTime createdAt) {
        this.id = id; this.status = status; this.comment = comment;
        this.changedByUsername = changedByUsername; this.createdAt = createdAt;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getChangedByUsername() { return changedByUsername; }
    public void setChangedByUsername(String changedByUsername) { this.changedByUsername = changedByUsername; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
