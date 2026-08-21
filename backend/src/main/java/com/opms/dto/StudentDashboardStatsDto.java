package com.opms.dto;

public class StudentDashboardStatsDto {
    private long eligibleDrives;
    private long appliedDrives;
    private long shortlisted;
    private long interviews;
    private long offers;
    private boolean isPlaced;
    private String placedCompany;
    private Double placedPackage;

    public StudentDashboardStatsDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final StudentDashboardStatsDto dto = new StudentDashboardStatsDto();
        public Builder eligibleDrives(long v) { dto.eligibleDrives = v; return this; }
        public Builder appliedDrives(long v) { dto.appliedDrives = v; return this; }
        public Builder shortlisted(long v) { dto.shortlisted = v; return this; }
        public Builder interviews(long v) { dto.interviews = v; return this; }
        public Builder offers(long v) { dto.offers = v; return this; }
        public Builder isPlaced(boolean v) { dto.isPlaced = v; return this; }
        public Builder placedCompany(String v) { dto.placedCompany = v; return this; }
        public Builder placedPackage(Double v) { dto.placedPackage = v; return this; }
        public StudentDashboardStatsDto build() { return dto; }
    }

    public long getEligibleDrives() { return eligibleDrives; }
    public void setEligibleDrives(long eligibleDrives) { this.eligibleDrives = eligibleDrives; }
    public long getAppliedDrives() { return appliedDrives; }
    public void setAppliedDrives(long appliedDrives) { this.appliedDrives = appliedDrives; }
    public long getShortlisted() { return shortlisted; }
    public void setShortlisted(long shortlisted) { this.shortlisted = shortlisted; }
    public long getInterviews() { return interviews; }
    public void setInterviews(long interviews) { this.interviews = interviews; }
    public long getOffers() { return offers; }
    public void setOffers(long offers) { this.offers = offers; }
    public boolean isPlaced() { return isPlaced; }
    public void setPlaced(boolean placed) { isPlaced = placed; }
    public String getPlacedCompany() { return placedCompany; }
    public void setPlacedCompany(String placedCompany) { this.placedCompany = placedCompany; }
    public Double getPlacedPackage() { return placedPackage; }
    public void setPlacedPackage(Double placedPackage) { this.placedPackage = placedPackage; }
}
