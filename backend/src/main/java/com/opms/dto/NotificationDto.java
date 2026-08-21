package com.opms.dto;

import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private String type;
    private Boolean isRead;
    private String entityType;
    private Long entityId;
    private LocalDateTime createdAt;

    public NotificationDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id; private String title; private String message;
        private String type; private Boolean isRead; private String entityType;
        private Long entityId; private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder message(String message) { this.message = message; return this; }
        public Builder type(String type) { this.type = type; return this; }
        public Builder isRead(Boolean isRead) { this.isRead = isRead; return this; }
        public Builder entityType(String entityType) { this.entityType = entityType; return this; }
        public Builder entityId(Long entityId) { this.entityId = entityId; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public NotificationDto build() {
            NotificationDto dto = new NotificationDto();
            dto.id = id; dto.title = title; dto.message = message; dto.type = type;
            dto.isRead = isRead; dto.entityType = entityType; dto.entityId = entityId;
            dto.createdAt = createdAt;
            return dto;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
