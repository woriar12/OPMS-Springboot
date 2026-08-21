package com.opms.dto;

public class CorrectionDecisionDto {
    private String adminComment;

    public CorrectionDecisionDto() {
    }

    public CorrectionDecisionDto(String adminComment) {
        this.adminComment = adminComment;
    }

    public String getAdminComment() { return adminComment; }
    public void setAdminComment(String adminComment) { this.adminComment = adminComment; }
}
