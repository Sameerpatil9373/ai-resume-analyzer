import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import UploadResume from "../pages/UploadResume";
import JobMatching from "../pages/JobMatching";
import AIInsights from "../pages/AIInsights";
import History from "../pages/History";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../components/ProtectedRoute"; // Import the gatekeeper

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes: No Sidebar or Header shown here */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes: Wrapped in both Protection and Layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/upload" element={<UploadResume />} />
                  <Route path="/job-matching" element={<JobMatching />} />
                  <Route path="/insights" element={<AIInsights />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Redirect any unknown paths back to dashboard */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;