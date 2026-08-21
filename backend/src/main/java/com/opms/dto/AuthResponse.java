package com.opms.dto;

import com.opms.entity.Role;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long userId;
    private String username;
    private String email;
    private Role role;
    private Boolean firstLogin;
    private String studentName;
    private String registerNumber;

    public AuthResponse() {
    }

    public AuthResponse(String token, String tokenType, Long userId, String username, String email, Role role, Boolean firstLogin, String studentName, String registerNumber) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.role = role;
        this.firstLogin = firstLogin;
        this.studentName = studentName;
        this.registerNumber = registerNumber;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private String tokenType = "Bearer";
        private Long userId;
        private String username;
        private String email;
        private Role role;
        private Boolean firstLogin;
        private String studentName;
        private String registerNumber;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public AuthResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public AuthResponseBuilder username(String username) { this.username = username; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder role(Role role) { this.role = role; return this; }
        public AuthResponseBuilder firstLogin(Boolean firstLogin) { this.firstLogin = firstLogin; return this; }
        public AuthResponseBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public AuthResponseBuilder registerNumber(String registerNumber) { this.registerNumber = registerNumber; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, tokenType, userId, username, email, role, firstLogin, studentName, registerNumber);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Boolean getFirstLogin() { return firstLogin; }
    public void setFirstLogin(Boolean firstLogin) { this.firstLogin = firstLogin; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
}
