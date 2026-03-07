import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ProgressCircle from "../components/ui/ProgressCircle"; // Gamified Loader Component
import {
  Zap,
  HelpCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  RefreshCcw,
  Loader2,
  BrainCircuit
} from "lucide-react";

const AIInsights = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [resumeId, setResumeId] = useState(
    location.state?.resumeId || localStorage.getItem("lastResumeId")
  );

  const [activeTab, setActiveTab] = useState("analysis");

  const [data, setData] = useState({
    summary: "",
    questions: [],
    explanation: "",
    loading: true,
    isExporting: false
  });

  // Gamified Loader State
  const [aiProgress, setAiProgress] = useState(0);

  const fetchDeepAnalysis = useCallback(async (targetId, isRefresh = false) => {
    if (!targetId || targetId === "undefined") return;

    try {
      const url = `/api/resume/insights/${targetId}?refresh=${isRefresh}`;
      const response = await api.get(url);

      if (response.data?.processing) {
        setData(prev => ({ ...prev, loading: true }));
        return;
      }

      setData({
        summary: response.data?.summary || "Summary unavailable.",
        questions: response.data?.questions || [],
        explanation: response.data?.explanation || "No suitability analysis provided.",
        loading: false,
        isExporting: false
      });
    } catch (error) {
      console.error("Deep Analysis Error:", error);
      setData(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      let currentId = resumeId;
      if (!currentId || currentId === "undefined") {
        try {
          const res = await api.get("/api/resume/all");
          const latest = res.data.data[0];
          if (latest?._id) {
            currentId = latest._id;
            setResumeId(currentId);
            localStorage.setItem("lastResumeId", currentId);
          } else {
            navigate("/app/dashboard");
            return;
          }
        } catch {
          navigate("/app/dashboard");
          return;
        }
      }
      fetchDeepAnalysis(currentId);
    };
    initialize();
  }, [resumeId, navigate, fetchDeepAnalysis]);

  // Polling mechanism: Keep checking every 3 seconds if data is still loading
  useEffect(() => {
    const interval = setInterval(() => {
      if (data.loading && resumeId) {
        fetchDeepAnalysis(resumeId);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [data.loading, resumeId, fetchDeepAnalysis]);

  // Gamified loading progress simulator (Ticks up while waiting for Ollama)
  useEffect(() => {
    let interval;
    if (data.loading) {
      setAiProgress(5);
      interval = setInterval(() => {
        setAiProgress(prev => (prev >= 95 ? 95 : prev + Math.floor(Math.random() * 8) + 2));
      }, 1500);
    } else {
      setAiProgress(100);
    }
    return () => clearInterval(interval);
  }, [data.loading]);

  const handleExportPDF = async () => {
    const reportElement = document.getElementById("ai-report-content");
    if (!reportElement) return;

    setData(prev => ({ ...prev, isExporting: true }));

    try {
      const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AI-Report-${resumeId.slice(-6)}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    } finally {
      setData(prev => ({ ...prev, isExporting: false }));
    }
  };

  // GAMIFIED LOADING SCREEN UI
  if (data.loading)
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center space-y-8 animate-in fade-in">
        <div className="relative flex items-center justify-center">
          <ProgressCircle percentage={aiProgress} size={160} stroke={12} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-[#111322]">{aiProgress}%</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-[0.2em] text-sm">
            <BrainCircuit size={18} className="animate-pulse" /> Synthesizing Deep Insights
          </p>
          <p className="text-gray-400 font-bold text-xs mt-2 italic">Ollama model is reasoning (usually takes 15-20s)...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-4 mt-6 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-bold text-sm transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <div className="flex gap-4">
          <button
            onClick={handleExportPDF}
            disabled={data.isExporting}
            className="bg-white border border-gray-100 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-md transition-all disabled:opacity-50"
          >
            {data.isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {data.isExporting ? "Processing..." : "Export PDF"}
          </button>

          <button
            onClick={() => {
              setData(prev => ({ ...prev, loading: true }));
              setAiProgress(0); // Reset progress on manual re-analyze
              fetchDeepAnalysis(resumeId, true);
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            <RefreshCcw size={16} /> Re-Analyze
          </button>
        </div>
      </div>

      <div id="ai-report-content" className="space-y-8">
        <div className="flex gap-2 bg-gray-100/50 p-1.5 rounded-[1.5rem] w-fit border border-gray-100">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-8 py-3 rounded-[1.2rem] text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === "analysis" ? "bg-[#111322] text-white shadow-lg" : "text-gray-400"
            }`}
          >
            AI Analysis
          </button>
          <button
            onClick={() => setActiveTab("interview")}
            className={`px-8 py-3 rounded-[1.2rem] text-[11px] font-black uppercase tracking-wider transition-all ${
              activeTab === "interview" ? "bg-[#111322] text-white shadow-lg" : "text-gray-400"
            }`}
          >
            Interview Prep
          </button>
        </div>

        {activeTab === "analysis" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black text-[#111322] mb-8 flex items-center gap-3">
                <Zap size={24} className="text-indigo-600" /> Executive AI Summary
              </h3>
              <p className="text-lg leading-relaxed text-gray-600 font-medium italic border-l-4 border-indigo-100 pl-8 whitespace-pre-line">
                {data.summary}
              </p>
            </div>
            <div className="lg:col-span-4 bg-[#111322] rounded-[3rem] p-12 text-white shadow-xl">
              <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                <AlertCircle size={24} className="text-indigo-400" /> Market Suitability
              </h3>
              <p className="text-sm leading-relaxed opacity-90 italic whitespace-pre-line">
                {data.explanation}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-[#111322] mb-12 flex items-center gap-3">
              <HelpCircle size={24} className="text-indigo-600" /> Technical Interview Preparation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.questions.map((question, index) => (
                <div key={index} className="flex gap-6 p-8 rounded-[2.5rem] bg-gray-50 border hover:border-indigo-100 hover:bg-white transition-all">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-sm">
                    {index + 1}
                  </span>
                  <p className="text-[15px] font-bold text-gray-700 leading-snug">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;