package com.opms.dto;

public class OverallPlacementReportDto {
    private long totalStudents;
    private long totalCompanies;
    private long totalDrives;
    private long totalApplications;
    private long totalShortlisted;
    private long totalInterviews;
    private long totalSelected;
    private long totalOffers;
    private long totalPlaced;
    private long totalUnplaced;
    private double placementPercentage;

    public OverallPlacementReportDto() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }
    public long getTotalDrives() { return totalDrives; }
    public void setTotalDrives(long totalDrives) { this.totalDrives = totalDrives; }
    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
    public long getTotalShortlisted() { return totalShortlisted; }
    public void setTotalShortlisted(long totalShortlisted) { this.totalShortlisted = totalShortlisted; }
    public long getTotalInterviews() { return totalInterviews; }
    public void setTotalInterviews(long totalInterviews) { this.totalInterviews = totalInterviews; }
    public long getTotalSelected() { return totalSelected; }
    public void setTotalSelected(long totalSelected) { this.totalSelected = totalSelected; }
    public long getTotalOffers() { return totalOffers; }
    public void setTotalOffers(long totalOffers) { this.totalOffers = totalOffers; }
    public long getTotalPlaced() { return totalPlaced; }
    public void setTotalPlaced(long totalPlaced) { this.totalPlaced = totalPlaced; }
    public long getTotalUnplaced() { return totalUnplaced; }
    public void setTotalUnplaced(long totalUnplaced) { this.totalUnplaced = totalUnplaced; }
    public double getPlacementPercentage() { return placementPercentage; }
    public void setPlacementPercentage(double placementPercentage) { this.placementPercentage = placementPercentage; }
}
