import { useState } from "react";
import { User, Mail, Lock, Shield, Bell, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { getCurrentUser } from "../services/authService";

const Settings = () => {
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // Manage success/error messages

  const [formData, setFormData] = useState({
    name: user?.user?.name || "",
    email: user?.user?.email || "",
    currentPassword: "",
    newPassword: ""
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      // TODO: Replace this timeout with an actual API call to your backend
      // await api.put("/api/auth/update", formData);
      
      setTimeout(() => {
        setLoading(false);
        setStatus({ type: "success", message: "Account settings updated successfully!" });
        
        // Clear passwords after successful update
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
      }, 1500);

    } catch (error) {
      setLoading(false);
      setStatus({ 
        type: "error", 
        message: error.response?.data?.message || "Failed to update settings. Please try again." 
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 mt-6">
      <div>
        <h2 className="text-3xl font-black text-[#111322] tracking-tight">Account Settings</h2>
        <p className="text-gray-400 text-sm font-bold mt-1 uppercase tracking-widest">
          Manage your profile and security preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation Tabs */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-gray-100 text-indigo-600 font-bold text-sm shadow-sm transition-all">
            <User size={18} /> General
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-gray-400 hover:bg-white hover:text-[#111322] hover:shadow-sm transition-all font-bold text-sm">
            <Lock size={18} /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-gray-400 hover:bg-white hover:text-[#111322] hover:shadow-sm transition-all font-bold text-sm">
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Settings Form */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Status Notification Box */}
          {status.message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 font-bold text-sm border animate-in slide-in-from-top-2 ${
              status.type === "success" 
                ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                : "bg-rose-50 text-rose-600 border-rose-100"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          )}

          <form onSubmit={handleUpdate} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm space-y-8">
            
            {/* Personal Info Section */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <h3 className="text-lg font-black text-[#111322]">Personal Information</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-700 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="email" 
                      disabled
                      className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl font-bold text-gray-400 cursor-not-allowed"
                      value={formData.email}
                      title="Email cannot be changed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-50" />

            {/* Password Section */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <h3 className="text-lg font-black text-[#111322]">Password Management</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-700 transition-all placeholder:font-medium"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">New Password</label>
                  <input 
                    type="password" 
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none font-bold text-gray-700 transition-all placeholder:font-medium"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  />
                </div>
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-3 ml-2 italic">
                Leave passwords blank if you don't want to change them.
              </p>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#111322] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-8 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> 
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save size={18} /> 
                  Save Preferences
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;