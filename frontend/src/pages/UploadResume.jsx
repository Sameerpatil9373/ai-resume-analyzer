import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  Loader2, 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2,
  Sparkles,
  BarChart2,
  Target
} from "lucide-react";
import api from "../services/api";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";


const UploadResume = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isAuthenticated = !!localStorage.getItem("user");
  const [isUploading, setIsUploading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploadedResume, setUploadedResume] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Drag & drop state
  const [isDragging, setIsDragging] = useState(false);

  // Handle all upload attempts for guests
  const handleGuestAttempt = () => {
    setIsLoginModalOpen(true);
  };

  // DO NOT MODIFY: Existing Business Logic
  const handleFileUpload = async (event) => {
    if (!isAuthenticated) {
      event.preventDefault();
      handleGuestAttempt();
      return;
    }

    const file = event.target.files[0];
    if (!file) return;

    setError("");
    setIsUploading(true);
    setAiProcessing(false);
    setUploadedResume(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const uploadRes = await api.post("/api/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const savedResume = uploadRes.data.data;
      localStorage.setItem("lastResumeId", savedResume._id);
      setUploadedResume(savedResume);
      setIsUploading(false);
      setAiProcessing(true);

      const pollInsights = setInterval(async () => {
        try {
          const insightsRes = await api.get(`/api/resume/insights/${savedResume._id}`);
          if (!insightsRes.data?.processing) {
            clearInterval(pollInsights);
            setAiProcessing(false);
          }
        } catch (err) {
          console.error("Polling failed", err);
        }
      }, 3000);
    } catch (err) {
      const data = err.response?.data;
      const serverMessage =
        data?.message || data?.error || data?.msg;

      if (!err.response) {
        setError(
          "Cannot reach the server. Make sure the backend is running on port 5000."
        );
      } else {
        setError(
          serverMessage ||
            "Upload failed. Please ensure it is a valid PDF or DOCX resume."
        );
      }
      setIsUploading(false);
      setAiProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading || aiProcessing) return;

    
    
    if (!isAuthenticated) {
      handleGuestAttempt();
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleUploadAreaClick = () => {
    if (!isAuthenticated) {
      handleGuestAttempt();
      return;
    }
    fileInputRef.current?.click();
  };
useEffect(() => {
  if (!aiProcessing) {
    setProgress(0);
    return;
  }

  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 99) return 99;
      return prev + Math.floor(Math.random() * 5) + 2;
    });
  }, 200);

  return () => clearInterval(interval);
}, [aiProcessing]);
  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Navigation & Header (Left-aligned, matching Dashboard rhythm) */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate("/app/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 rounded-md"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            Back to Dashboard
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Upload Resume</h1>
            <p className="text-sm text-slate-500 mt-1">
              Add a new document to your profile to generate updated AI insights and job matches.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl p-4 shadow-sm mb-2">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* STATE 1: Upload View */}
          {(!uploadedResume && !isUploading) && (
            <motion.div
              key="upload-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Primary Upload Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx"
                />
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleUploadAreaClick}
                  className={`
                    relative w-full rounded-xl p-6 text-center transition-all duration-200 cursor-pointer
                    border-2 border-dashed flex flex-col items-center justify-center min-h-[160px]
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600
                    ${isDragging 
                      ? "border-purple-500 bg-purple-50/50" 
                      : "border-slate-300 hover:border-purple-400 hover:bg-slate-50"
                    }
                  `}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleUploadAreaClick()}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-200 shadow-sm ${isDragging ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'}`}>
                    <UploadCloud size={24} strokeWidth={2} />
                  </div>
                  
                  <h3 className="text-base font-semibold text-slate-900 mb-1">
                    Click to browse or drag and drop
                  </h3>
                  <p className="text-sm text-slate-500">
                    PDF or DOCX (Max 10MB)
                  </p>
                </div>
              </div>

              {/* Compact "What happens next?" Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">What happens next?</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">ATS Score calculation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">AI Resume Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">Job Matching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-purple-600" />
                    <span className="text-sm font-medium text-slate-600">Interview Questions</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STATE 2: Processing View */}
          {(isUploading && !uploadedResume) && (
            <motion.div
              key="processing-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[250px]"
            >
              <Loader2 size={32} className="animate-spin text-purple-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-900">Processing Document</h3>
              <p className="text-sm text-slate-500 mt-1">Securely uploading and extracting raw text...</p>
            </motion.div>
          )}

          {/* STATE 3: Success Dashboard (Mimicking Dashboard Cards) */}
          {(uploadedResume && !isUploading) && (
            <motion.div
              key="success-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header Banner */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upload Complete</p>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{uploadedResume.fileName}</h2>
                  <p className="text-sm text-slate-500 mt-1">Core extraction finished. Ready for review.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/app/dashboard")}
                    className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    type="button"
                    disabled={aiProcessing}
                    onClick={() => navigate("/app/insights", { state: { resumeId: uploadedResume._id } })}
                    className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                  >
                    {aiProcessing ? "Generating Insights..." : "View AI Insights"}
                  </button>
                </div>
              </div>

              {/* Metrics Grid (Styled exactly like the Dashboard card) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ATS Score Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 border-t-[3px] border-t-purple-500 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <BarChart2 size={20} />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{uploadedResume.atsScore || 0}%</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">ATS Score</h3>
                  <p className="text-xs text-slate-500 mt-1">Initial parse match</p>
                </div>

                {/* Predicted Role Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 border-t-[3px] border-t-emerald-500 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Target size={20} />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {uploadedResume.predictedRole || "Professional"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Primary job match</p>
                </div>

                {/* AI Status Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 border-t-[3px] border-t-indigo-500 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${aiProcessing ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'}`}>
                      {aiProcessing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                    </div>
                    {!aiProcessing && (
                      <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Ready</span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">AI Reports</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {aiProcessing
  ? `Analyzing Resume... ${progress}%`
  : "Analysis Complete ✅"}
  {aiProcessing && (
  <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
    <div
      className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
)}
                  </p>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Login Required Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="🔒 Login Required"
        footer={
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsLoginModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsLoginModalOpen(false);
                navigate("/login");
              }}
            >
              Continue to Login
            </Button>
          </div>
        }
      >
        <p className="text-slate-600 mb-4">
          Please sign in to upload your resume and unlock personalized AI features.
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-purple-600" />
            <span className="text-sm text-slate-700">ATS Score Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-purple-600" />
            <span className="text-sm text-slate-700">AI Resume Insights</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-purple-600" />
            <span className="text-sm text-slate-700">Job Matching</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-purple-600" />
            <span className="text-sm text-slate-700">Interview Questions</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadResume;