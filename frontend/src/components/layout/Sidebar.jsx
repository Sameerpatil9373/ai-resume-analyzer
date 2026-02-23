import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Upload, 
  Briefcase, 
  Sparkles, 
  History, 
  Settings, 
  LogOut 
} from "lucide-react";
import { getCurrentUser, logout } from "../../services/authService";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser(); 
  
  const userName = user?.user?.name || "Guest User";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
      isActive 
        ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white font-semibold" 
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="w-72 h-screen bg-[#111322] text-white p-6 flex flex-col border-r border-white/5 sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-12 px-2 mt-2">
        <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-[14px] flex items-center justify-center shadow-xl shadow-indigo-500/20">
          <Sparkles size={24} className="text-white fill-current" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight leading-none">AI Resume</h1>
          <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">Analyzer</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-10 flex-1 overflow-y-auto no-scrollbar">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-5 px-5 font-black">Main Menu</p>
          <div className="space-y-2">
            {/* UPDATED PATHS TO MATCH /app/* PREFIX */}
            <NavLink to="/app/dashboard" className={linkClass}>
              <LayoutDashboard size={18} /> 
              <span className="text-sm">Dashboard</span>
            </NavLink>
            <NavLink to="/app/upload" className={linkClass}>
              <Upload size={18} /> 
              <span className="text-sm">Upload Resume</span>
            </NavLink>
            <NavLink to="/app/job-matching" className={linkClass}>
              <Briefcase size={18} /> 
              <span className="text-sm">Job Matching</span>
            </NavLink>
            <NavLink to="/app/insights" className={linkClass}>
              <Sparkles size={18} /> 
              <span className="text-sm">AI Insights</span>
            </NavLink>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-5 px-5 font-black">Activity</p>
          <div className="space-y-2">
            <NavLink to="/app/history" className={linkClass}>
              <History size={18} /> 
              <span className="text-sm">History</span>
            </NavLink>
            <NavLink to="/app/settings" className={linkClass}>
              <Settings size={18} /> 
              <span className="text-sm">Settings</span>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Profile Section */}
      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <div className="p-4 bg-indigo-500/5 rounded-[20px] flex items-center gap-3 border border-white/[0.03] group transition-all">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-black text-xs text-white shadow-lg shadow-indigo-500/20">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
              {userName}
            </p>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter italic">Pro Plan</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-300 font-bold text-xs uppercase tracking-widest"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;