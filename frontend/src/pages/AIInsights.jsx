import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Zap, HelpCircle, AlertCircle, ArrowLeft, 
  Download, RefreshCcw, Loader2, CheckCircle2 
} from "lucide-react";

const AIInsights = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeId = location.state?.resumeId; // ID passed from History or Dashboard

  const [data, setData] = useState({
    summary: "",
    questions: "",
    explanation: "",
    loading: true
  });

  useEffect(() => {
    if (!resumeId) {
      // If opened directly (e.g., from sidebar), send user to history to pick a resume
      navigate("/app/history");
      return;
    }

    const fetchDeepAnalysis = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const API_BASE = "http://localhost:5000/api/resume";

        // Fetch all AI insights in parallel
        const [summaryRes, questionsRes, explainRes] = await Promise.all([
          axios.get(`${API_BASE}/summary/${resumeId}`, config),
          axios.get(`${API_BASE}/questions/${resumeId}`, config),
          axios.get(`${API_BASE}/explain/${resumeId}`, config)
        ]);

        setData({
          summary: summaryRes.data.summary,
          questions: questionsRes.data.questions,
          explanation: explainRes.data.explanation,
          loading: false
        });
      } catch (error) {
        console.error("Analysis failed:", error);
        alert("Failed to load AI insights. Please try again.");
        navigate("/history");
      }
    };

    fetchDeepAnalysis();
  }, [resumeId, navigate]);

  if (data.loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">AI is thinking...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition-colors font-bold text-sm">
          <ArrowLeft size={20} /> Back to History
        </button>
        <div className="flex gap-4">
          <button className="bg-white border border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-md transition-all">
            <Download size={16} /> Export PDF
          </button>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            <RefreshCcw size={16} /> Re-Analyze
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Executive Summary */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <CheckCircle2 className="text-emerald-500 opacity-20" size={120} />
          </div>
          <h3 className="text-xl font-black text-[#111322] mb-8 flex items-center gap-3">
            <Zap size={24} className="text-indigo-600" fill="currentColor"/> Executive Summary
          </h3>
          <p className="text-lg leading-relaxed text-gray-600 font-medium italic border-l-4 border-indigo-100 pl-8 py-2">
            {data.summary}
          </p>
        </div>

        {/* Role Suitability */}
        <div className="lg:col-span-4 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 text-white shadow-xl shadow-indigo-100">
          <h3 className="text-xl font-black mb-8 flex items-center gap-3">
            <AlertCircle size={24} /> Suitability Analysis
          </h3>
          <div className="bg-white/10 rounded-2xl p-6 border border-white/10">
            <p className="text-sm leading-relaxed font-medium opacity-90 italic">
              {data.explanation}
            </p>
          </div>
        </div>

        {/* Interview Preparation (Full Width) */}
        <div className="lg:col-span-12 bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-[#111322] mb-12 flex items-center gap-3">
            <HelpCircle size={24} className="text-indigo-600"/> Interview Preparation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.questions.split('\n').filter(q => q.trim()).map((question, index) => (
              <div key={index} className="flex gap-6 p-8 rounded-[2.5rem] bg-gray-50/50 border border-transparent hover:border-indigo-100 hover:bg-white transition-all duration-300 group">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {index + 1}
                </span>
                <p className="text-[15px] font-bold text-gray-700 leading-snug group-hover:text-gray-900 transition-colors">
                  {question.replace(/^\d+\.\s*|-\s*/, '')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;