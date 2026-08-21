package com.opms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StudentCreateRequest {

    @NotBlank(message = "Student Name is required")
    private String studentName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Roll Number is required")
    private String rollNumber;

    @NotBlank(message = "Register Number is required")
    private String registerNumber;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private String college;
    private String university;
    private String batch;
    private Integer currentSemester;
    private Double cgpa;
    private Integer activeBacklogs;
    private String address;

    public StudentCreateRequest() {
    }

    public StudentCreateRequest(String studentName, String email, String rollNumber, String registerNumber, Long departmentId, String college, String university, String batch, Integer currentSemester, Double cgpa, Integer activeBacklogs, String address) {
        this.studentName = studentName;
        this.email = email;
        this.rollNumber = rollNumber;
        this.registerNumber = registerNumber;
        this.departmentId = departmentId;
        this.college = college;
        this.university = university;
        this.batch = batch;
        this.currentSemester = currentSemester;
        this.cgpa = cgpa;
        this.activeBacklogs = activeBacklogs;
        this.address = address;
    }

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
}
