import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import ProgressCircle from "../components/ui/ProgressCircle";
import { 
  FileText, Target, BarChart3, Zap, UploadCloud, 
  Loader2, ArrowRight 
} from "lucide-react";
import api from "../services/api"; 

const Dashboard = () => {
  const [resumeData, setResumeData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadLatest = async () => {
      try {
        const res = await api.get("/api/resume/all");
        if (res.data.data && res.data.data.length > 0) {
          const latest = res.data.data[0];
          setResumeData({
            ...latest,
            summary: latest.aiInsights?.summary || "",
            questions: latest.aiInsights?.questions || [],
            explanation: latest.aiInsights?.explanation || ""
          });
        }
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };
    loadLatest();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      // 1. Initial Upload (ATS/Skills/Role)
      const uploadRes = await api.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const savedResume = uploadRes.data.data;

      // 2. Immediate AI Analysis (No job description required)
      const insightsRes = await api.get(`/api/resume/insights/${savedResume._id}`);
      
      setResumeData({
        ...savedResume,
        summary: insightsRes.data.summary,
        questions: insightsRes.data.questions,
        explanation: insightsRes.data.explanation
      });

      // Reset optional job matcher state for the new file
      setMatchResult(null);
      setJobDescription("");
    } catch (error) {
      alert("Analysis failed. Please check your API key configuration.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleJobMatch = async () => {
    // Only proceed if there is a resume and pasted text
    if (!resumeData?._id || !jobDescription.trim()) return;
    setIsMatching(true);
    try {
      const response = await api.post(`/api/resume/match`, {
        resumeId: resumeData._id,
        jobDescription: jobDescription.trim()
      });
      setMatchResult(response.data);
    } catch (error) {
      console.error("Match failed:", error.message);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-[#111322]">Dashboard</h2>
        {resumeData && (
          <button 
            onClick={() => navigate("/app/insights", { state: { resumeId: resumeData._id } })}
            className="flex items-center gap-2 text-indigo-600 font-bold text-sm"
          >
            Full AI Report <ArrowRight size={18} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="ATS Score" value={resumeData ? `${resumeData.atsScore}%` : "0%"} icon={BarChart3} />
        <Card title="Skills" value={resumeData ? resumeData.skillsDetected.length : "0"} icon={FileText} />
        <Card title="Match Score" value={matchResult ? `${matchResult.matchScore}%` : "0%"} icon={Target} />
        <Card title="AI Status" value={resumeData?.summary ? "Active" : "Ready"} icon={Zap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.docx" />
            <div 
              onClick={() => !isUploading && fileInputRef.current.click()}
              className="border-2 border-dashed rounded-[2rem] p-12 text-center border-indigo-100 bg-indigo-50/20 cursor-pointer hover:bg-indigo-50/40 transition-all"
            >
              {isUploading ? <Loader2 className="animate-spin mx-auto mb-4" /> : <UploadCloud size={32} className="mx-auto mb-4 text-indigo-600" />}
              <p className="text-xl font-bold">{isUploading ? "AI is processing..." : "Upload New Resume"}</p>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-[#111322]">Job Matching (Optional)</h3>
            <textarea
              className="w-full p-6 rounded-[1.5rem] bg-gray-50/80 mb-6 outline-none min-h-[160px] font-medium"
              placeholder="Paste job description here to check compatibility..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <button 
              onClick={handleJobMatch} 
              // Button is only active if text is pasted
              disabled={!resumeData || !jobDescription.trim() || isMatching}
              className={`px-8 py-3 rounded-xl font-bold w-full shadow-md transition-all ${
                !jobDescription.trim() 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isMatching ? "Analysing Match..." : "Run AI Matcher"}
            </button>

            {/* Match Results Display */}
            {matchResult && (
              <div className="mt-8 bg-emerald-50/40 p-8 rounded-[2rem] border border-emerald-100/50 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-10">
                  <div className="text-center">
                    <div className="text-6xl font-black text-emerald-500">{matchResult.matchScore}%</div>
                    <p className="text-[10px] text-emerald-600/60 font-black uppercase mt-2">Match Score</p>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {matchResult.matchingSkills?.map(s => <span key={s} className="px-3 py-1 bg-white text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">✓ {s}</span>)}
                    {matchResult.missingSkills?.map(s => <span key={s} className="px-3 py-1 bg-white text-rose-500 text-[10px] font-black rounded-lg border border-rose-100">× {s}</span>)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <ProgressCircle percentage={resumeData ? resumeData.atsScore : 0} size={220} stroke={16} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                 <span className="text-5xl font-black text-[#111322]">{resumeData ? resumeData.atsScore : 0}</span>
                 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">ATS Score</span>
              </div>
            </div>
            <div className="mt-8 w-full border-t pt-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-black text-[10px] uppercase">Predicted Role</span>
                <span className="text-indigo-600 font-bold italic">{resumeData ? resumeData.predictedRole : "Not Analyzed"}</span>
              </div>
            </div>
          </div>

          {resumeData?.summary && (
            <div className="bg-[#111322] rounded-[2.5rem] p-10 text-white shadow-xl animate-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold flex items-center gap-3 mb-6">
                <Zap size={22} className="text-indigo-400" fill="currentColor"/> Executive AI Summary
              </h3>
              <p className="text-[14px] leading-relaxed font-medium italic text-gray-300 border-l-2 border-indigo-500/50 pl-6">
                {resumeData.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;