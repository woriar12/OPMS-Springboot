package com.opms.dto;

public class DepartmentPlacementReportDto {
    private Long departmentId;
    private String departmentCode;
    private String departmentName;
    private long totalStudents;
    private long eligibleStudents;
    private long appliedStudents;
    private long shortlistedStudents;
    private long interviewedStudents;
    private long selectedStudents;
    private long placedStudents;
    private double placementPercentage;

    public DepartmentPlacementReportDto() {}

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getEligibleStudents() { return eligibleStudents; }
    public void setEligibleStudents(long eligibleStudents) { this.eligibleStudents = eligibleStudents; }
    public long getAppliedStudents() { return appliedStudents; }
    public void setAppliedStudents(long appliedStudents) { this.appliedStudents = appliedStudents; }
    public long getShortlistedStudents() { return shortlistedStudents; }
    public void setShortlistedStudents(long shortlistedStudents) { this.shortlistedStudents = shortlistedStudents; }
    public long getInterviewedStudents() { return interviewedStudents; }
    public void setInterviewedStudents(long interviewedStudents) { this.interviewedStudents = interviewedStudents; }
    public long getSelectedStudents() { return selectedStudents; }
    public void setSelectedStudents(long selectedStudents) { this.selectedStudents = selectedStudents; }
    public long getPlacedStudents() { return placedStudents; }
    public void setPlacedStudents(long placedStudents) { this.placedStudents = placedStudents; }
    public double getPlacementPercentage() { return placementPercentage; }
    public void setPlacementPercentage(double placementPercentage) { this.placementPercentage = placementPercentage; }
}
