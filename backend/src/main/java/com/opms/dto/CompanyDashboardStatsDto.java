package com.opms.dto;

public class CompanyDashboardStatsDto {
    private long totalDrives;
    private long draftDrives;
    private long pendingDrives;
    private long approvedDrives;
    private long activeDrives;
    private long closedDrives;
    private long rejectedDrives;
    private long totalApplications; // Phase 3
    private long shortlisted;       // Phase 3
    private long selected;          // Phase 3

    public CompanyDashboardStatsDto() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long totalDrives; private long draftDrives; private long pendingDrives;
        private long approvedDrives; private long activeDrives; private long closedDrives;
        private long rejectedDrives; private long totalApplications; private long shortlisted; private long selected;

        public Builder totalDrives(long v) { this.totalDrives = v; return this; }
        public Builder draftDrives(long v) { this.draftDrives = v; return this; }
        public Builder pendingDrives(long v) { this.pendingDrives = v; return this; }
        public Builder approvedDrives(long v) { this.approvedDrives = v; return this; }
        public Builder activeDrives(long v) { this.activeDrives = v; return this; }
        public Builder closedDrives(long v) { this.closedDrives = v; return this; }
        public Builder rejectedDrives(long v) { this.rejectedDrives = v; return this; }
        public Builder totalApplications(long v) { this.totalApplications = v; return this; }
        public Builder shortlisted(long v) { this.shortlisted = v; return this; }
        public Builder selected(long v) { this.selected = v; return this; }

        public CompanyDashboardStatsDto build() {
            CompanyDashboardStatsDto dto = new CompanyDashboardStatsDto();
            dto.totalDrives = totalDrives; dto.draftDrives = draftDrives; dto.pendingDrives = pendingDrives;
            dto.approvedDrives = approvedDrives; dto.activeDrives = activeDrives; dto.closedDrives = closedDrives;
            dto.rejectedDrives = rejectedDrives; dto.totalApplications = totalApplications;
            dto.shortlisted = shortlisted; dto.selected = selected;
            return dto;
        }
    }

    public long getTotalDrives() { return totalDrives; }
    public void setTotalDrives(long totalDrives) { this.totalDrives = totalDrives; }
    public long getDraftDrives() { return draftDrives; }
    public void setDraftDrives(long draftDrives) { this.draftDrives = draftDrives; }
    public long getPendingDrives() { return pendingDrives; }
    public void setPendingDrives(long pendingDrives) { this.pendingDrives = pendingDrives; }
    public long getApprovedDrives() { return approvedDrives; }
    public void setApprovedDrives(long approvedDrives) { this.approvedDrives = approvedDrives; }
    public long getActiveDrives() { return activeDrives; }
    public void setActiveDrives(long activeDrives) { this.activeDrives = activeDrives; }
    public long getClosedDrives() { return closedDrives; }
    public void setClosedDrives(long closedDrives) { this.closedDrives = closedDrives; }
    public long getRejectedDrives() { return rejectedDrives; }
    public void setRejectedDrives(long rejectedDrives) { this.rejectedDrives = rejectedDrives; }
    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
    public long getShortlisted() { return shortlisted; }
    public void setShortlisted(long shortlisted) { this.shortlisted = shortlisted; }
    public long getSelected() { return selected; }
    public void setSelected(long selected) { this.selected = selected; }
}
