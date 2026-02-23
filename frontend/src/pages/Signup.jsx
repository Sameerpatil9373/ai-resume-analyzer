import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { Sparkles, User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-xl shadow-indigo-100 border border-indigo-50">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-indigo-200">
            <Sparkles size={32} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-[#111322] tracking-tight">Create Account</h2>
          <p className="text-gray-400 text-sm font-bold mt-2 uppercase tracking-widest">Join the AI Revolution</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="text" required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
                placeholder="Sameer Patil"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="email" required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
                placeholder="sameer@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input 
                type="password" required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 mt-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Get Started <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-medium text-gray-400">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;