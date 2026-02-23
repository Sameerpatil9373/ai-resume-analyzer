import { useState } from "react";
import { User, Mail, Lock, Shield, Bell, Save, Loader2 } from "lucide-react";
import { getCurrentUser } from "../services/authService";

const Settings = () => {
  const user = getCurrentUser(); //
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.user?.name || "",
    email: user?.user?.email || "",
    currentPassword: "",
    newPassword: ""
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Logic for updating profile would go here
    setTimeout(() => {
      setLoading(false);
      alert("Settings updated successfully!");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-black text-[#111322] tracking-tight">Account Settings</h2>
        <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">Manage your profile and security preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Tabs (Visual only) */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-gray-100 text-indigo-600 font-bold text-sm shadow-sm">
            <User size={18} /> General
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-gray-400 hover:bg-white hover:text-[#111322] transition-all font-bold text-sm">
            <Lock size={18} /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-gray-400 hover:bg-white hover:text-[#111322] transition-all font-bold text-sm">
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 space-y-8">
          <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-black text-[#111322]">Personal Information</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="email" 
                    disabled
                    className="w-full pl-12 pr-6 py-3.5 bg-gray-50 border-none rounded-xl font-medium text-sm text-gray-400 cursor-not-allowed"
                    value={formData.email}
                  />
                </div>
              </div>
            </div>

            <hr className="border-gray-50 my-8" />

            <div className="flex items-center gap-4 mb-4 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-black text-[#111322]">Password Management</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Current Password</label>
                <input 
                  type="password" 
                  className="w-full px-6 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">New Password</label>
                <input 
                  type="password" 
                  className="w-full px-6 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#111322] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 mt-8"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;