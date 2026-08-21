package com.opms.dto;

public class DashboardStatsDto {
    private long totalStudents;
    private long totalDepartments;
    private long activeStudents;
    private long pendingCorrectionRequests;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalStudents, long totalDepartments, long activeStudents, long pendingCorrectionRequests) {
        this.totalStudents = totalStudents;
        this.totalDepartments = totalDepartments;
        this.activeStudents = activeStudents;
        this.pendingCorrectionRequests = pendingCorrectionRequests;
    }

    public static DashboardStatsDtoBuilder builder() {
        return new DashboardStatsDtoBuilder();
    }

    public static class DashboardStatsDtoBuilder {
        private long totalStudents;
        private long totalDepartments;
        private long activeStudents;
        private long pendingCorrectionRequests;

        public DashboardStatsDtoBuilder totalStudents(long totalStudents) { this.totalStudents = totalStudents; return this; }
        public DashboardStatsDtoBuilder totalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; return this; }
        public DashboardStatsDtoBuilder activeStudents(long activeStudents) { this.activeStudents = activeStudents; return this; }
        public DashboardStatsDtoBuilder pendingCorrectionRequests(long pendingCorrectionRequests) { this.pendingCorrectionRequests = pendingCorrectionRequests; return this; }

        public DashboardStatsDto build() {
            return new DashboardStatsDto(totalStudents, totalDepartments, activeStudents, pendingCorrectionRequests);
        }
    }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public long getActiveStudents() { return activeStudents; }
    public void setActiveStudents(long activeStudents) { this.activeStudents = activeStudents; }

    public long getPendingCorrectionRequests() { return pendingCorrectionRequests; }
    public void setPendingCorrectionRequests(long pendingCorrectionRequests) { this.pendingCorrectionRequests = pendingCorrectionRequests; }
}
