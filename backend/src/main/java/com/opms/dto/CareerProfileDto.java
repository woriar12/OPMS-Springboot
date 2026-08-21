package com.opms.dto;

public class CareerProfileDto {
    private String resumeUrl;
    private String skills;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;

    public CareerProfileDto() {
    }

    public CareerProfileDto(String resumeUrl, String skills, String githubUrl, String linkedinUrl, String portfolioUrl) {
        this.resumeUrl = resumeUrl;
        this.skills = skills;
        this.githubUrl = githubUrl;
        this.linkedinUrl = linkedinUrl;
        this.portfolioUrl = portfolioUrl;
    }

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
}
