import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown, Mail, Shield, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Topbar = ({ onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))?.user || { name: "Guest User", email: "abc@example.com" };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center bg-white/80 backdrop-blur-md px-4 sm:px-8 py-3 sm:py-4 border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onToggleSidebar}
          className="lg:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Current Session</span>
          <span className="text-xs font-bold text-gray-400 mt-0.5">{today}</span>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center rounded-full font-black text-[10px] sm:text-xs shadow-lg shadow-indigo-200 ring-2 ring-white transition-all hover:scale-105 cursor-pointer relative group"
          >
            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || "GU"}
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
              <ChevronDown size={8} className={`text-gray-400 sm:size-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-4 w-[calc(100vw-2rem)] sm:w-72 bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border border-gray-100 py-5 sm:py-6 px-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right text-[#111322]">
              <div className="px-5 sm:px-6">
                <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-3 sm:mb-4">User Profile</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#111322] border border-gray-100 shrink-0">
                    <User size={20} className="sm:size-24" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-black text-[#111322] text-sm truncate">{user.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;