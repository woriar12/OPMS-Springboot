package com.opms.dto;

import java.time.LocalDateTime;

public class StudentDto {
    private Long id;
    private Long userId;
    private String studentName;
    private String email;
    private String rollNumber;
    private String registerNumber;
    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private String college;
    private String university;
    private String batch;
    private Integer currentSemester;
    private Double cgpa;
    private Integer activeBacklogs;
    private String address;

    private String resumeUrl;
    private String skills;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StudentDto() {
    }

    public StudentDto(Long id, Long userId, String studentName, String email, String rollNumber, String registerNumber, Long departmentId, String departmentCode, String departmentName, String college, String university, String batch, Integer currentSemester, Double cgpa, Integer activeBacklogs, String address, String resumeUrl, String skills, String githubUrl, String linkedinUrl, String portfolioUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.studentName = studentName;
        this.email = email;
        this.rollNumber = rollNumber;
        this.registerNumber = registerNumber;
        this.departmentId = departmentId;
        this.departmentCode = departmentCode;
        this.departmentName = departmentName;
        this.college = college;
        this.university = university;
        this.batch = batch;
        this.currentSemester = currentSemester;
        this.cgpa = cgpa;
        this.activeBacklogs = activeBacklogs;
        this.address = address;
        this.resumeUrl = resumeUrl;
        this.skills = skills;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.portfolioUrl = portfolioUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static StudentDtoBuilder builder() {
        return new StudentDtoBuilder();
    }

    public static class StudentDtoBuilder {
        private Long id;
        private Long userId;
        private String studentName;
        private String email;
        private String rollNumber;
        private String registerNumber;
        private Long departmentId;
        private String departmentCode;
        private String departmentName;
        private String college;
        private String university;
        private String batch;
        private Integer currentSemester;
        private Double cgpa;
        private Integer activeBacklogs;
        private String address;
        private String resumeUrl;
        private String skills;
        private String githubUrl;
        private String linkedinUrl;
        private String portfolioUrl;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public StudentDtoBuilder id(Long id) { this.id = id; return this; }
        public StudentDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public StudentDtoBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public StudentDtoBuilder email(String email) { this.email = email; return this; }
        public StudentDtoBuilder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public StudentDtoBuilder registerNumber(String registerNumber) { this.registerNumber = registerNumber; return this; }
        public StudentDtoBuilder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public StudentDtoBuilder departmentCode(String departmentCode) { this.departmentCode = departmentCode; return this; }
        public StudentDtoBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public StudentDtoBuilder college(String college) { this.college = college; return this; }
        public StudentDtoBuilder university(String university) { this.university = university; return this; }
        public StudentDtoBuilder batch(String batch) { this.batch = batch; return this; }
        public StudentDtoBuilder currentSemester(Integer currentSemester) { this.currentSemester = currentSemester; return this; }
        public StudentDtoBuilder cgpa(Double cgpa) { this.cgpa = cgpa; return this; }
        public StudentDtoBuilder activeBacklogs(Integer activeBacklogs) { this.activeBacklogs = activeBacklogs; return this; }
        public StudentDtoBuilder address(String address) { this.address = address; return this; }
        public StudentDtoBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public StudentDtoBuilder skills(String skills) { this.skills = skills; return this; }
        public StudentDtoBuilder githubUrl(String githubUrl) { this.githubUrl = githubUrl; return this; }
        public StudentDtoBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public StudentDtoBuilder portfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; return this; }
        public StudentDtoBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public StudentDtoBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public StudentDto build() {
            return new StudentDto(id, userId, studentName, email, rollNumber, registerNumber, departmentId, departmentCode, departmentName, college, university, batch, currentSemester, cgpa, activeBacklogs, address, resumeUrl, skills, githubUrl, linkedinUrl, portfolioUrl, createdAt, updatedAt);
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getUniversity() { return university; }
    public void setUniversity(String university) { this.university = university; }

    public String getBatch() { return batch; }
    public void setBatch(String batch) { this.batch = batch; }

    public Integer getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(Integer currentSemester) { this.currentSemester = currentSemester; }

    public Double getCgpa() { return cgpa; }
    public void setCgpa(Double cgpa) { this.cgpa = cgpa; }

    public Integer getActiveBacklogs() { return activeBacklogs; }
    public void setActiveBacklogs(Integer activeBacklogs) { this.activeBacklogs = activeBacklogs; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
