import { useState, useRef } from "react";
import axios from "axios";
import Card from "../components/ui/Card";
import ProgressCircle from "../components/ui/ProgressCircle";
import { 
  FileText, Target, BarChart3, Zap, UploadCloud, 
  CheckCircle2, AlertCircle, Loader2 
} from "lucide-react";

const Dashboard = () => {
  const [resumeData, setResumeData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [isMatching, setIsMatching] = useState(false);
  const fileInputRef = useRef(null);

  const API_BASE = "http://localhost:5000/api/resume";

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    
    // Prevent uploading empty or non-existent files
    if (!file) return;
    if (file.size === 0) {
      alert("Selected file is empty. Please choose a valid resume.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file); // Must match backend upload.single("resume")

    try {
      // 1. Upload & Analyze Skills/ATS
      const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const savedResume = uploadRes.data.data;

      // 2. Fetch Deep AI Insights
      const [summaryRes, questionsRes, explainRes] = await Promise.all([
        axios.get(`${API_BASE}/summary/${savedResume._id}`),
        axios.get(`${API_BASE}/questions/${savedResume._id}`),
        axios.get(`${API_BASE}/explain/${savedResume._id}`)
      ]);

      setResumeData({
        ...savedResume,
        summary: summaryRes.data.summary,
        questions: questionsRes.data.questions,
        explanation: explainRes.data.explanation
      });
      
      setMatchResult(null);
      setJobDescription("");

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("Upload Error:", error.response?.data);
      alert(`Processing failed: ${errorMsg}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const handleJobMatch = async () => {
    if (!resumeData?._id || !jobDescription) return;
    setIsMatching(true);
    try {
      const response = await axios.post(`${API_BASE}/match`, {
        resumeId: resumeData._id,
        jobDescription
      });
      setMatchResult(response.data);
    } catch (error) {
      console.error("Match failed:", error.message);
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-[#111322] tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-[10px]">Live Analysis</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="ATS Score" value={resumeData ? `${resumeData.atsScore}%` : "0%"} trend={resumeData ? "Verified" : null} icon={BarChart3} />
        <Card title="Detected Skills" value={resumeData ? resumeData.skillsDetected.length : "0"} icon={FileText} />
        <Card title="Match Accuracy" value={matchResult ? `${matchResult.matchScore}%` : "0%"} trend={matchResult ? "Live" : null} icon={Target} />
        <Card title="AI Content" value={resumeData?.summary ? "Active" : "Ready"} icon={Zap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          {/* Upload Box */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-[#111322]">Upload Resume</h3>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-lg border border-emerald-100 uppercase">✓ ready</span>
            </div>
            
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.docx" />
            
            <div 
              onClick={() => !isUploading && fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-[2rem] p-12 text-center transition-all cursor-pointer ${isUploading ? 'bg-gray-50 border-gray-100' : 'border-indigo-100 bg-indigo-50/20 group hover:bg-indigo-50/40'}`}
            >
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm mx-auto flex items-center justify-center mb-6 text-indigo-600 group-hover:scale-110 transition-transform">
                {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud size={32} />}
              </div>
              <p className="text-xl font-bold text-[#111322]">{isUploading ? "AI Analysis in Progress..." : "Drag & Drop Resume"}</p>
              <p className="text-gray-400 text-sm mt-2">Supports PDF and DOCX formats</p>
            </div>
          </div>

          {/* Job Match Box */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#111322]">Job Matching</h3>
              <button 
                onClick={handleJobMatch} 
                disabled={!resumeData || isMatching}
                className="bg-indigo-50 text-indigo-600 px-5 py-2 rounded-xl text-[10px] font-black hover:bg-indigo-100 uppercase flex items-center gap-2"
              >
                {isMatching ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} fill="currentColor"/>}
                Analyze
              </button>
            </div>
            <textarea
              className="w-full p-6 border-none rounded-[1.5rem] bg-gray-50/80 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[160px]"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            {matchResult && (
              <div className="flex items-center gap-10 bg-emerald-50/30 p-8 rounded-[2rem] border border-emerald-100/50">
                <div className="text-center">
                  <div className="text-6xl font-black text-emerald-500 leading-none">{matchResult.matchScore}%</div>
                  <p className="text-[10px] text-emerald-600/60 font-black uppercase mt-3 tracking-widest">Accuracy</p>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {matchResult.matchingSkills.map(s => <span key={s} className="px-3 py-1 bg-white text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">✓ {s}</span>)}
                  {matchResult.missingSkills.map(s => <span key={s} className="px-3 py-1 bg-white text-rose-500 text-[10px] font-black rounded-lg border border-rose-100">× {s}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: ATS Score UI */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-10">
              <h3 className="text-lg font-bold text-[#111322]">ATS Result</h3>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-lg border border-emerald-100">✓ pass</span>
            </div>
            <div className="relative mb-10">
              <ProgressCircle percentage={resumeData ? resumeData.atsScore : 0} size={220} stroke={16} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                <p className="text-6xl font-black text-[#111322] leading-none">{resumeData ? resumeData.atsScore : 0}</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-3">/ 100</p>
              </div>
            </div>
            <div className="w-full space-y-4 border-t border-gray-50 pt-8">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><Target size={14}/> Predicted Role</span>
                <span className="text-[#111322] italic">{resumeData ? resumeData.predictedRole : "N/A"}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-gray-400 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><CheckCircle2 size={14} className="text-emerald-500"/> Validation</span>
                <span className="text-emerald-600 italic underline underline-offset-4">Verified</span>
              </div>
            </div>
          </div>

          {/* AI Insights Card */}
          {resumeData?.summary && (
            <div className="bg-gradient-to-br from-[#1a1c2e] to-[#252849] rounded-[2.5rem] p-10 text-white shadow-2xl border border-white/5">
              <h3 className="text-lg font-bold flex items-center gap-3 mb-10"><Zap size={22} fill="white"/> AI Summary</h3>
              <p className="text-[15px] leading-relaxed font-medium italic text-indigo-100/90 border-l-2 border-indigo-500/50 pl-6">{resumeData.summary}</p>
              <div className="mt-10 p-5 rounded-[1.5rem] bg-white/5 border border-white/5 flex gap-4">
                <AlertCircle size={20} className="text-indigo-400 shrink-0"/>
                <p className="text-xs font-medium italic text-indigo-200">{resumeData.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;