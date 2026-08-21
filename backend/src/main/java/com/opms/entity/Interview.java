package com.opms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(name = "round_name", nullable = false)
    private String roundName;

    @Enumerated(EnumType.STRING)
    @Column(name = "interview_type", nullable = false)
    private InterviewType interviewType = InterviewType.ONLINE;

    @Column(name = "scheduled_date", nullable = false)
    private LocalDate scheduledDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "meeting_link")
    private String meetingLink;

    @Column
    private String location;

    @Column
    private String interviewer;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewResult result = InterviewResult.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Interview() {}

    public static InterviewBuilder builder() { return new InterviewBuilder(); }

    public static class InterviewBuilder {
        private Long id;
        private Application application;
        private String roundName;
        private InterviewType interviewType = InterviewType.ONLINE;
        private LocalDate scheduledDate;
        private LocalTime startTime;
        private LocalTime endTime;
        private String meetingLink;
        private String location;
        private String interviewer;
        private String notes;
        private InterviewStatus status = InterviewStatus.SCHEDULED;
        private InterviewResult result = InterviewResult.PENDING;

        public InterviewBuilder id(Long id) { this.id = id; return this; }
        public InterviewBuilder application(Application application) { this.application = application; return this; }
        public InterviewBuilder roundName(String roundName) { this.roundName = roundName; return this; }
        public InterviewBuilder interviewType(InterviewType interviewType) { this.interviewType = interviewType; return this; }
        public InterviewBuilder scheduledDate(LocalDate scheduledDate) { this.scheduledDate = scheduledDate; return this; }
        public InterviewBuilder startTime(LocalTime startTime) { this.startTime = startTime; return this; }
        public InterviewBuilder endTime(LocalTime endTime) { this.endTime = endTime; return this; }
        public InterviewBuilder meetingLink(String meetingLink) { this.meetingLink = meetingLink; return this; }
        public InterviewBuilder location(String location) { this.location = location; return this; }
        public InterviewBuilder interviewer(String interviewer) { this.interviewer = interviewer; return this; }
        public InterviewBuilder notes(String notes) { this.notes = notes; return this; }
        public InterviewBuilder status(InterviewStatus status) { this.status = status; return this; }
        public InterviewBuilder result(InterviewResult result) { this.result = result; return this; }

        public Interview build() {
            Interview iv = new Interview();
            iv.id = id; iv.application = application; iv.roundName = roundName;
            iv.interviewType = interviewType; iv.scheduledDate = scheduledDate;
            iv.startTime = startTime; iv.endTime = endTime; iv.meetingLink = meetingLink;
            iv.location = location; iv.interviewer = interviewer; iv.notes = notes;
            iv.status = status; iv.result = result;
            return iv;
        }
    }

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }

    @PreUpdate
    protected void onUpdate() { updatedAt = LocalDateTime.now(); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
    public String getRoundName() { return roundName; }
    public void setRoundName(String roundName) { this.roundName = roundName; }
    public InterviewType getInterviewType() { return interviewType; }
    public void setInterviewType(InterviewType interviewType) { this.interviewType = interviewType; }
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
    public InterviewStatus getStatus() { return status; }
    public void setStatus(InterviewStatus status) { this.status = status; }
    public InterviewResult getResult() { return result; }
    public void setResult(InterviewResult result) { this.result = result; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
