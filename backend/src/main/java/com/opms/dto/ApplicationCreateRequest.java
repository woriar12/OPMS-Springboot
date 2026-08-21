package com.opms.dto;

public class ApplicationCreateRequest {
    private String coverLetter;
    private String resumeUrl;

    public ApplicationCreateRequest() {}
    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }
}
