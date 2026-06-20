import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout.jsx';

// Common pages
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Student pages
import StudentDashboard from './pages/Student/StudentDashboard.jsx';
import StudentProfile from './pages/Student/StudentProfile.jsx';
import JobBoard from './pages/Student/JobBoard.jsx';
import InterviewCalendar from './pages/Student/InterviewCalendar.jsx';
import AiResume from './pages/Student/AiResume.jsx';
import AiPredictor from './pages/Student/AiPredictor.jsx';

// Recruiter pages
import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard.jsx';
import CompanyProfile from './pages/Recruiter/CompanyProfile.jsx';
import ManageJobs from './pages/Recruiter/ManageJobs.jsx';
import Applicants from './pages/Recruiter/Applicants.jsx';

// TPO pages
import TpoDashboard from './pages/TPO/TpoDashboard.jsx';
import ManageStudents from './pages/TPO/ManageStudents.jsx';
import VerifyRecruiters from './pages/TPO/VerifyRecruiters.jsx';
import ApproveJobs from './pages/TPO/ApproveJobs.jsx';
import CampusDrives from './pages/TPO/CampusDrives.jsx';

// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ManageUsers from './pages/Admin/ManageUsers.jsx';
import AuditLogs from './pages/Admin/AuditLogs.jsx';
import SystemSettings from './pages/Admin/SystemSettings.jsx';

// Shared Page
import Chat from './pages/Shared/Chat.jsx';

// Auth Guard
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="jobs" element={<JobBoard />} />
          <Route path="interviews" element={<InterviewCalendar />} />
          <Route path="ai-resume" element={<AiResume />} />
          <Route path="ai-predictor" element={<AiPredictor />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Recruiter Routes */}
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="company" element={<CompanyProfile />} />
          <Route path="jobs" element={<ManageJobs />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* TPO Routes */}
        <Route
          path="/tpo"
          element={
            <ProtectedRoute allowedRoles={['tpo']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<TpoDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="recruiters" element={<VerifyRecruiters />} />
          <Route path="jobs" element={<ApproveJobs />} />
          <Route path="drives" element={<CampusDrives />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="audit" element={<AuditLogs />} />
          <Route path="settings" element={<SystemSettings />} />
          <Route path="" element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Shared Sub-routes */}
        <Route
          path="/shared"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="chat" element={<Chat />} />
          <Route path="" element={<Navigate to="chat" replace />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
