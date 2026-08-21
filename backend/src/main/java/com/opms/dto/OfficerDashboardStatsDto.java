package com.opms.dto;

public class OfficerDashboardStatsDto {
    private long totalCompanies;
    private long pendingCompanyRequests;
    private long approvedCompanies;
    private long rejectedCompanies;
    private long activeDrives;
    private long pendingDriveApprovals;
    private long totalDrives;
    private long closedDrives;
    private long totalStudents;

    public OfficerDashboardStatsDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalCompanies; private long pendingCompanyRequests;
        private long approvedCompanies; private long rejectedCompanies;
        private long activeDrives; private long pendingDriveApprovals;
        private long totalDrives; private long closedDrives; private long totalStudents;

        public Builder totalCompanies(long v) { this.totalCompanies = v; return this; }
        public Builder pendingCompanyRequests(long v) { this.pendingCompanyRequests = v; return this; }
        public Builder approvedCompanies(long v) { this.approvedCompanies = v; return this; }
        public Builder rejectedCompanies(long v) { this.rejectedCompanies = v; return this; }
        public Builder activeDrives(long v) { this.activeDrives = v; return this; }
        public Builder pendingDriveApprovals(long v) { this.pendingDriveApprovals = v; return this; }
        public Builder totalDrives(long v) { this.totalDrives = v; return this; }
        public Builder closedDrives(long v) { this.closedDrives = v; return this; }
        public Builder totalStudents(long v) { this.totalStudents = v; return this; }

        public OfficerDashboardStatsDto build() {
            OfficerDashboardStatsDto dto = new OfficerDashboardStatsDto();
            dto.totalCompanies = totalCompanies; dto.pendingCompanyRequests = pendingCompanyRequests;
            dto.approvedCompanies = approvedCompanies; dto.rejectedCompanies = rejectedCompanies;
            dto.activeDrives = activeDrives; dto.pendingDriveApprovals = pendingDriveApprovals;
            dto.totalDrives = totalDrives; dto.closedDrives = closedDrives; dto.totalStudents = totalStudents;
            return dto;
        }
    }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }
    public long getPendingCompanyRequests() { return pendingCompanyRequests; }
    public void setPendingCompanyRequests(long pendingCompanyRequests) { this.pendingCompanyRequests = pendingCompanyRequests; }
    public long getApprovedCompanies() { return approvedCompanies; }
    public void setApprovedCompanies(long approvedCompanies) { this.approvedCompanies = approvedCompanies; }
    public long getRejectedCompanies() { return rejectedCompanies; }
    public void setRejectedCompanies(long rejectedCompanies) { this.rejectedCompanies = rejectedCompanies; }
    public long getActiveDrives() { return activeDrives; }
    public void setActiveDrives(long activeDrives) { this.activeDrives = activeDrives; }
    public long getPendingDriveApprovals() { return pendingDriveApprovals; }
    public void setPendingDriveApprovals(long pendingDriveApprovals) { this.pendingDriveApprovals = pendingDriveApprovals; }
    public long getTotalDrives() { return totalDrives; }
    public void setTotalDrives(long totalDrives) { this.totalDrives = totalDrives; }
    public long getClosedDrives() { return closedDrives; }
    public void setClosedDrives(long closedDrives) { this.closedDrives = closedDrives; }
    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
}
