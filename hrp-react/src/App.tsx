import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { TasksPage } from "./pages/TasksPage";
import { JobPostingsPage } from "./pages/recruitment/JobPostingsPage";
import { ApplicantsPage } from "./pages/recruitment/ApplicantsPage";
import { InterviewsPage } from "./pages/recruitment/InterviewsPage";
import { OffersPage } from "./pages/recruitment/OffersPage";
import { ApplyLeavePage } from "./pages/leave/ApplyLeavePage";
import { LeaveBalancePage } from "./pages/leave/LeaveBalancePage";
import { LeaveApprovalsPage } from "./pages/leave/LeaveApprovalsPage";
import { LeaveCalendarPage } from "./pages/leave/LeaveCalendarPage";
import { LeaveEncashmentPage } from "./pages/leave/LeaveEncashmentPage";

import "./App.css";

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#111827", fontSize: "1rem" }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function RecruitmentGuard() {
  const { user } = useAuth();
  if (!user || !["hr", "admin", "owner"].includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#111827" }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/tasks" element={<TasksPage />} />

        <Route element={<RecruitmentGuard />}>
          <Route path="/recruitment/jobs" element={<JobPostingsPage />} />
          <Route path="/recruitment/applicants" element={<ApplicantsPage />} />
          <Route path="/recruitment/interviews" element={<InterviewsPage />} />
          <Route path="/recruitment/offers" element={<OffersPage />} />
        </Route>

        <Route path="/leave/apply"      element={<ApplyLeavePage />} />
        <Route path="/leave/balance"    element={<LeaveBalancePage />} />
        <Route path="/leave/calendar"   element={<LeaveCalendarPage />} />
        <Route path="/leave/encashment" element={<LeaveEncashmentPage />} />
        <Route path="/leave/approvals"  element={<LeaveApprovalsPage />} />
      </Route>

      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
