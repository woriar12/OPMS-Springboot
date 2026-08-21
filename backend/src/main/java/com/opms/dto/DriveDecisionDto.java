package com.opms.dto;

public class DriveDecisionDto {
    private String comment;
    private String rejectionReason;

    public DriveDecisionDto() {}
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
