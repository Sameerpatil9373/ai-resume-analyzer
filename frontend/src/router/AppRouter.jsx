import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import UploadResume from "../pages/UploadResume";
import JobMatching from "../pages/JobMatching";
import AIInsights from "../pages/AIInsights";
import History from "../pages/History";
import Settings from "../pages/Settings";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/job-matching" element={<JobMatching />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
};

export default AppRouter;