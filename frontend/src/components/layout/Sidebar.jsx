import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass =
    "block px-4 py-3 rounded-lg hover:bg-purple-600 transition";

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-indigo-900 to-purple-900 text-white p-6">
      <h1 className="text-xl font-bold mb-10">
        AI Resume Analyzer
      </h1>

      <nav className="space-y-3">
        <NavLink to="/" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/upload" className={linkClass}>Upload Resume</NavLink>
        <NavLink to="/job-matching" className={linkClass}>Job Matching</NavLink>
        <NavLink to="/insights" className={linkClass}>AI Insights</NavLink>
        <NavLink to="/history" className={linkClass}>History</NavLink>
        <NavLink to="/settings" className={linkClass}>Settings</NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;