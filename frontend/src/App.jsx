import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedLayout } from './components/layout/ProtectedLayout';

// Landing & Auth
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/landing/LoginPage';

// Team Pages
import { ExploreHackathons } from './pages/team/ExploreHackathons';
import { HackathonDetails } from './pages/team/HackathonDetails';
import { TeamRegistration } from './pages/team/TeamRegistration';
import { TeamDashboard } from './pages/team/TeamDashboard';
import { MyTeam } from './pages/team/MyTeam';
import { ProjectWorkspace } from './pages/team/ProjectWorkspace';
import { TeamSubmissions } from './pages/team/TeamSubmissions';
import { TeamAnnouncements } from './pages/team/TeamAnnouncements';
import { TeamSettings } from './pages/team/TeamSettings';

// Organizer Pages
import { OrganizerDashboard } from './pages/organizer/OrganizerDashboard';
import { AllHackathons } from './pages/organizer/AllHackathons';
import { CreateHackathon } from './pages/organizer/CreateHackathon';
import { OrganizerHackathonDetails } from './pages/organizer/OrganizerHackathonDetails';
import { TeamManagement } from './pages/organizer/TeamManagement';
import { SubmissionManagement } from './pages/organizer/SubmissionManagement';
import { EvaluationScoring } from './pages/organizer/EvaluationScoring';
import { OrganizerAnalytics } from './pages/organizer/OrganizerAnalytics';
import { OrganizerAnnouncements } from './pages/organizer/OrganizerAnnouncements';

// Super Admin Pages
import { SuperAdminDashboard } from './pages/superadmin/SuperAdminDashboard';
import { OrganizerManagement } from './pages/superadmin/OrganizerManagement';
import { HackathonOversight } from './pages/superadmin/HackathonOversight';
import { UserManagement } from './pages/superadmin/UserManagement';
import { PlatformAnalytics } from './pages/superadmin/PlatformAnalytics';
import { SystemSettings } from './pages/superadmin/SystemSettings';
import { RolePermissions } from './pages/superadmin/RolePermissions';
import { PlatformReports } from './pages/superadmin/PlatformReports';
import { PlatformHealth } from './pages/superadmin/PlatformHealth';

// Dynamic role-based redirection helper
const RoleBasedRedirect = () => {
  const { role } = useAuth();
  if (role === 'ORGANIZER') return <Navigate to="/organizer/dashboard" replace />;
  if (role === 'SUPER_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  return <Navigate to="/team/dashboard" replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Authentication */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Quick Dashboard Redirect */}
          <Route path="/dashboard" element={<RoleBasedRedirect />} />

          {/* ================= TEAM ROUTES ================= */}
          <Route
            path="/team/explore"
            element={
              <ProtectedLayout title="Explore Hackathons">
                <ExploreHackathons />
              </ProtectedLayout>
            }
          />
          <Route
            path="/hackathons/:id"
            element={
              <ProtectedLayout title="Hackathon Details">
                <HackathonDetails />
              </ProtectedLayout>
            }
          />
          <Route
            path="/hackathons/:id/register"
            element={
              <ProtectedLayout title="Register Team">
                <TeamRegistration />
              </ProtectedLayout>
            }
          />
          <Route
            path="/team/dashboard"
            element={
              <ProtectedLayout title="Team Dashboard">
                <TeamDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/team/my-team"
            element={
              <ProtectedLayout title="My Team">
                <MyTeam />
              </ProtectedLayout>
            }
          />
          <Route
            path="/team/workspace"
            element={
              <ProtectedLayout title="Project Workspace">
                <ProjectWorkspace />
              </ProtectedLayout>
            }
          />
          <Route
            path="/team/submissions"
            element={
              <ProtectedLayout title="Submissions">
                <TeamSubmissions />
              </ProtectedLayout>
            }
          />
          <Route
            path="/team/announcements"
            element={
              <ProtectedLayout title="Announcements">
                <TeamAnnouncements />
              </ProtectedLayout>
            }
          />
          <Route
            path="/team/settings"
            element={
              <ProtectedLayout title="Profile & Settings">
                <TeamSettings />
              </ProtectedLayout>
            }
          />

          {/* ================= ORGANIZER ROUTES ================= */}
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedLayout title="Organizer Dashboard">
                <OrganizerDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/hackathons"
            element={
              <ProtectedLayout title="All Hackathons">
                <AllHackathons />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/create-hackathon"
            element={
              <ProtectedLayout title="Create Hackathon">
                <CreateHackathon />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/hackathons/:id"
            element={
              <ProtectedLayout title="Hackathon Overview">
                <OrganizerHackathonDetails />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/teams"
            element={
              <ProtectedLayout title="Team Management">
                <TeamManagement />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/submissions"
            element={
              <ProtectedLayout title="Submission Management">
                <SubmissionManagement />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/evaluations"
            element={
              <ProtectedLayout title="Evaluation & Scoring">
                <EvaluationScoring />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/evaluation"
            element={
              <ProtectedLayout title="Evaluation & Scoring">
                <EvaluationScoring />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/analytics"
            element={
              <ProtectedLayout title="Analytics & Insights">
                <OrganizerAnalytics />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/announcements"
            element={
              <ProtectedLayout title="Announcements">
                <OrganizerAnnouncements />
              </ProtectedLayout>
            }
          />
          <Route
            path="/organizer/settings"
            element={
              <ProtectedLayout title="Organizer Settings">
                <TeamSettings />
              </ProtectedLayout>
            }
          />

          {/* ================= SUPER ADMIN ROUTES ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedLayout title="Super Admin Dashboard">
                <SuperAdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/organizers"
            element={
              <ProtectedLayout title="Organizer Management">
                <OrganizerManagement />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/hackathons"
            element={
              <ProtectedLayout title="Hackathon Oversight">
                <HackathonOversight />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedLayout title="User Management">
                <UserManagement />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedLayout title="Platform Analytics">
                <PlatformAnalytics />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedLayout title="System Settings">
                <SystemSettings />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <ProtectedLayout title="Roles & Permissions">
                <RolePermissions />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/permissions"
            element={
              <ProtectedLayout title="Roles & Permissions">
                <RolePermissions />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedLayout title="Platform Reports">
                <PlatformReports />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/health"
            element={
              <ProtectedLayout title="Platform Health">
                <PlatformHealth />
              </ProtectedLayout>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
export default App;
