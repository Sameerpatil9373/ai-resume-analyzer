import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { Sparkles, Mail, Lock, Loader2 } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      navigate("/app/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: credentialResponse.credential }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/app/dashboard");

    } catch (err) {
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-xl shadow-indigo-100 border border-indigo-50">

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[1.5rem] flex items-center justify-center text-white mx-auto mb-6">
            <Sparkles size={32} fill="currentColor" />
          </div>

          <h2 className="text-3xl font-black text-[#111322]">
            Welcome Back
          </h2>

          <p className="text-gray-400 text-sm font-bold mt-2 uppercase tracking-widest">
            Sign in to continue
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />

              <input
                type="email"
                required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />

              <input
                type="password"
                required
                className="w-full pl-14 pr-6 py-4 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
          </button>

        </form>

        {/* Divider */}
        <div className="my-6 text-center text-gray-400 text-sm">OR</div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <p className="text-center mt-8 text-sm font-medium text-gray-400">
          Don't have an account?
          <Link to="/signup" className="text-indigo-600 font-bold ml-1">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;