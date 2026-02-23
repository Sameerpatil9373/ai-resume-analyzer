import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus({ type: "", message: "" });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file); // Must match the name in your Multer config

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user?.token}` 
        }
      };

      const res = await axios.post("http://localhost:5000/api/resume/upload", formData, config);
      
      setStatus({ type: "success", message: "Resume analyzed successfully!" });
      
      // Briefly show success, then jump to the results
      setTimeout(() => {
        navigate("/app/insights", { state: { resumeId: res.data.data._id } });
      }, 1500);

    } catch (err) {
      setStatus({ 
        type: "error", 
        message: err.response?.data?.message || "Upload failed. Try a PDF or Docx." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-[#111322] tracking-tight">Upload Your Resume</h2>
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Let AI optimize your career path</p>
      </div>

      <div className="bg-white rounded-[3rem] p-12 border-2 border-dashed border-gray-100 shadow-sm hover:border-indigo-400 transition-all group">
        <form onSubmit={handleUpload} className="flex flex-col items-center gap-8">
          <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            {loading ? <Loader2 className="animate-spin" size={40} /> : <Upload size={40} />}
          </div>

          <div className="text-center">
            <label className="cursor-pointer">
              <span className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all inline-block">
                {file ? file.name : "Select File"}
              </span>
              <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            </label>
            <p className="mt-4 text-gray-400 text-xs font-medium">Supports PDF, DOCX (Max 5MB)</p>
          </div>

          {status.message && (
            <div className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl ${
              status.type === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              {status.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || loading}
            className="w-full max-w-xs bg-[#111322] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black transition-all shadow-xl"
          >
            {loading ? "Analyzing..." : "Start AI Analysis"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;