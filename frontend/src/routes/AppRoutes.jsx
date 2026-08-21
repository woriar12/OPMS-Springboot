import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { AdminLayout } from '../layouts/AdminLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { OfficerLayout } from '../layouts/OfficerLayout';
import { CompanyLayout } from '../layouts/CompanyLayout';

// Public Pages
import { LoginPage } from '../pages/LoginPage';
import { CompanyRegisterPage } from '../pages/CompanyRegisterPage';
import { ChangePasswordPage } from '../pages/ChangePasswordPage';

// Admin Pages
import { AdminDashboard } from '../pages/AdminDashboard';
import { DepartmentManagement } from '../pages/DepartmentManagement';
import { BulkImportPage } from '../pages/BulkImportPage';
import { StudentListPage } from '../pages/StudentListPage';
import { AdminCorrectionRequests } from '../pages/AdminCorrectionRequests';
import { AdminAuditLogs } from '../pages/AdminAuditLogs';
import { AdminOfficerManagement } from '../pages/AdminOfficerManagement';

// Student Pages
import { StudentDashboard } from '../pages/StudentDashboard';
import { StudentProfilePage } from '../pages/StudentProfilePage';
import { StudentCorrectionPage } from '../pages/StudentCorrectionPage';
import { StudentEligibleDrives } from '../pages/student/StudentEligibleDrives';
import { StudentDriveDetail } from '../pages/student/StudentDriveDetail';
import { StudentApplications } from '../pages/student/StudentApplications';
import { StudentApplicationDetail } from '../pages/student/StudentApplicationDetail';
import { StudentInterviews } from '../pages/student/StudentInterviews';
import { StudentOffers } from '../pages/student/StudentOffers';
import { StudentPlacement } from '../pages/student/StudentPlacement';

// Officer Pages
import { OfficerDashboard } from '../pages/officer/OfficerDashboard';
import { OfficerCompanyRequests } from '../pages/officer/OfficerCompanyRequests';
import { OfficerCompanyList } from '../pages/officer/OfficerCompanyList';
import { OfficerCompanyDetail } from '../pages/officer/OfficerCompanyDetail';
import { OfficerDriveRequests } from '../pages/officer/OfficerDriveRequests';
import { OfficerDriveList } from '../pages/officer/OfficerDriveList';
import { OfficerDriveDetail } from '../pages/officer/OfficerDriveDetail';
import { OfficerDepartmentMapping } from '../pages/officer/OfficerDepartmentMapping';
import { OfficerApplications } from '../pages/officer/OfficerApplications';
import { OfficerInterviews } from '../pages/officer/OfficerInterviews';
import { OfficerOffers } from '../pages/officer/OfficerOffers';
import { OfficerPlacements } from '../pages/officer/OfficerPlacements';
import { OfficerReports } from '../pages/officer/OfficerReports';

// Company Pages
import { CompanyDashboard } from '../pages/company/CompanyDashboard';
import { CompanyProfile } from '../pages/company/CompanyProfile';
import { CompanyDriveList } from '../pages/company/CompanyDriveList';
import { CompanyDriveCreate } from '../pages/company/CompanyDriveCreate';
import { CompanyDriveDetail } from '../pages/company/CompanyDriveDetail';
import { CompanyApplications } from '../pages/company/CompanyApplications';
import { CompanyApplicationDetail } from '../pages/company/CompanyApplicationDetail';
import { CompanyInterviews } from '../pages/company/CompanyInterviews';
import { CompanyOffers } from '../pages/company/CompanyOffers';
import { CompanyPlacements } from '../pages/company/CompanyPlacements';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/company/register" element={<CompanyRegisterPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentListPage />} />
        <Route path="bulk-import" element={<BulkImportPage />} />
        <Route path="departments" element={<DepartmentManagement />} />
        <Route path="officers" element={<AdminOfficerManagement />} />
        <Route path="correction-requests" element={<AdminCorrectionRequests />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
      </Route>

      {/* Placement Officer Protected Routes */}
      <Route
        path="/officer"
        element={
          <ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']}>
            <OfficerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/officer/dashboard" replace />} />
        <Route path="dashboard" element={<OfficerDashboard />} />
        <Route path="company-requests" element={<OfficerCompanyRequests />} />
        <Route path="companies" element={<OfficerCompanyList />} />
        <Route path="companies/:id" element={<OfficerCompanyDetail />} />
        <Route path="drive-requests" element={<OfficerDriveRequests />} />
        <Route path="drives" element={<OfficerDriveList />} />
        <Route path="drives/:id" element={<OfficerDriveDetail />} />
        <Route path="department-mapping" element={<OfficerDepartmentMapping />} />
        <Route path="applications" element={<OfficerApplications />} />
        <Route path="interviews" element={<OfficerInterviews />} />
        <Route path="offers" element={<OfficerOffers />} />
        <Route path="placements" element={<OfficerPlacements />} />
        <Route path="reports" element={<OfficerReports />} />
        <Route path="profile" element={<OfficerCompanyDetail />} />
      </Route>

      {/* Company Protected Routes */}
      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRoles={['COMPANY']}>
            <CompanyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/company/dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="profile" element={<CompanyProfile />} />
        <Route path="drives" element={<CompanyDriveList />} />
        <Route path="drives/create" element={<CompanyDriveCreate />} />
        <Route path="drives/:id" element={<CompanyDriveDetail />} />
        <Route path="applications" element={<CompanyApplications />} />
        <Route path="applications/:id" element={<CompanyApplicationDetail />} />
        <Route path="interviews" element={<CompanyInterviews />} />
        <Route path="offers" element={<CompanyOffers />} />
        <Route path="placements" element={<CompanyPlacements />} />
      </Route>

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="drives" element={<StudentEligibleDrives />} />
        <Route path="drives/:id" element={<StudentDriveDetail />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="applications/:id" element={<StudentApplicationDetail />} />
        <Route path="interviews" element={<StudentInterviews />} />
        <Route path="offers" element={<StudentOffers />} />
        <Route path="placement" element={<StudentPlacement />} />
        <Route path="profile" element={<StudentProfilePage />} />
        <Route path="correction-request" element={<StudentCorrectionPage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
      </Route>

      {/* Default Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
