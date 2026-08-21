package com.opms.dto;

import java.time.LocalDateTime;

public class AuditLogDto {
    private Long id;
    private String username;
    private String action;
    private String description;
    private LocalDateTime timestamp;

    public AuditLogDto() {
    }

    public AuditLogDto(Long id, String username, String action, String description, LocalDateTime timestamp) {
        this.id = id;
        this.username = username;
        this.action = action;
        this.description = description;
        this.timestamp = timestamp;
    }

    public static AuditLogDtoBuilder builder() {
        return new AuditLogDtoBuilder();
    }

    public static class AuditLogDtoBuilder {
        private Long id;
        private String username;
        private String action;
        private String description;
        private LocalDateTime timestamp;

        public AuditLogDtoBuilder id(Long id) { this.id = id; return this; }
        public AuditLogDtoBuilder username(String username) { this.username = username; return this; }
        public AuditLogDtoBuilder action(String action) { this.action = action; return this; }
        public AuditLogDtoBuilder description(String description) { this.description = description; return this; }
        public AuditLogDtoBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public AuditLogDto build() {
            return new AuditLogDto(id, username, action, description, timestamp);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
