package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "student_name", nullable = false)
    private String studentName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "roll_number", nullable = false, unique = true)
    private String rollNumber;

    @Column(name = "register_number", nullable = false, unique = true)
    private String registerNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false)
    private String college;

    @Column(nullable = false)
    private String university;

    @Column(nullable = false)
    private String batch;

    @Column(name = "current_semester", nullable = false)
    private Integer currentSemester;

    @Column(nullable = false)
    private Double cgpa;

    @Column(name = "active_backlogs", nullable = false)
    private Integer activeBacklogs;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "portfolio_url")
    private String portfolioUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Student() {
    }

    public Student(Long id, User user, String studentName, String email, String rollNumber, String registerNumber, Department department, String college, String university, String batch, Integer currentSemester, Double cgpa, Integer activeBacklogs, String address, String resumeUrl, String skills, String githubUrl, String linkedinUrl, String portfolioUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.studentName = studentName;
        this.email = email;
        this.rollNumber = rollNumber;
        this.registerNumber = registerNumber;
        this.department = department;
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

    public static StudentBuilder builder() {
        return new StudentBuilder();
    }

    public static class StudentBuilder {
        private Long id;
        private User user;
        private String studentName;
        private String email;
        private String rollNumber;
        private String registerNumber;
        private Department department;
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

        public StudentBuilder id(Long id) { this.id = id; return this; }
        public StudentBuilder user(User user) { this.user = user; return this; }
        public StudentBuilder studentName(String studentName) { this.studentName = studentName; return this; }
        public StudentBuilder email(String email) { this.email = email; return this; }
        public StudentBuilder rollNumber(String rollNumber) { this.rollNumber = rollNumber; return this; }
        public StudentBuilder registerNumber(String registerNumber) { this.registerNumber = registerNumber; return this; }
        public StudentBuilder department(Department department) { this.department = department; return this; }
        public StudentBuilder college(String college) { this.college = college; return this; }
        public StudentBuilder university(String university) { this.university = university; return this; }
        public StudentBuilder batch(String batch) { this.batch = batch; return this; }
        public StudentBuilder currentSemester(Integer currentSemester) { this.currentSemester = currentSemester; return this; }
        public StudentBuilder cgpa(Double cgpa) { this.cgpa = cgpa; return this; }
        public StudentBuilder activeBacklogs(Integer activeBacklogs) { this.activeBacklogs = activeBacklogs; return this; }
        public StudentBuilder address(String address) { this.address = address; return this; }
        public StudentBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public StudentBuilder skills(String skills) { this.skills = skills; return this; }
        public StudentBuilder githubUrl(String githubUrl) { this.githubUrl = githubUrl; return this; }
        public StudentBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public StudentBuilder portfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; return this; }
        public StudentBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public StudentBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Student build() {
            return new Student(id, user, studentName, email, rollNumber, registerNumber, department, college, university, batch, currentSemester, cgpa, activeBacklogs, address, resumeUrl, skills, githubUrl, linkedinUrl, portfolioUrl, createdAt, updatedAt);
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

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
