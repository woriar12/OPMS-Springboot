package com.opms.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

public class InterviewDto {
    private Long id;
    private Long applicationId;
    private String studentName;
    private String registerNumber;
    private String driveTitle;
    private String companyName;
    private String roundName;
    private String interviewType;
    private LocalDate scheduledDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String meetingLink;
    private String location;
    private String interviewer;
    private String notes;
    private String status;
    private String result;
    private LocalDateTime createdAt;

    public InterviewDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final InterviewDto dto = new InterviewDto();
        public Builder id(Long id) { dto.id = id; return this; }
        public Builder applicationId(Long a) { dto.applicationId = a; return this; }
        public Builder studentName(String n) { dto.studentName = n; return this; }
        public Builder registerNumber(String r) { dto.registerNumber = r; return this; }
        public Builder driveTitle(String t) { dto.driveTitle = t; return this; }
        public Builder companyName(String c) { dto.companyName = c; return this; }
        public Builder roundName(String r) { dto.roundName = r; return this; }
        public Builder interviewType(String t) { dto.interviewType = t; return this; }
        public Builder scheduledDate(LocalDate d) { dto.scheduledDate = d; return this; }
        public Builder startTime(LocalTime t) { dto.startTime = t; return this; }
        public Builder endTime(LocalTime t) { dto.endTime = t; return this; }
        public Builder meetingLink(String m) { dto.meetingLink = m; return this; }
        public Builder location(String l) { dto.location = l; return this; }
        public Builder interviewer(String i) { dto.interviewer = i; return this; }
        public Builder notes(String n) { dto.notes = n; return this; }
        public Builder status(String s) { dto.status = s; return this; }
        public Builder result(String r) { dto.result = r; return this; }
        public Builder createdAt(LocalDateTime c) { dto.createdAt = c; return this; }
        public InterviewDto build() { return dto; }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRegisterNumber() { return registerNumber; }
    public void setRegisterNumber(String registerNumber) { this.registerNumber = registerNumber; }
    public String getDriveTitle() { return driveTitle; }
    public void setDriveTitle(String driveTitle) { this.driveTitle = driveTitle; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getRoundName() { return roundName; }
    public void setRoundName(String roundName) { this.roundName = roundName; }
    public String getInterviewType() { return interviewType; }
    public void setInterviewType(String interviewType) { this.interviewType = interviewType; }
    public LocalDate getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getMeetingLink() { return meetingLink; }
    public void setMeetingLink(String meetingLink) { this.meetingLink = meetingLink; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getInterviewer() { return interviewer; }
    public void setInterviewer(String interviewer) { this.interviewer = interviewer; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
