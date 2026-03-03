import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Centralized API use ho raha hai
import { History as HistoryIcon, ExternalLink, Search, Calendar } from "lucide-react";

const History = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/api/resume/all"); 
        setResumes(response.data.data);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredResumes = resumes.filter(res => 
    res.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.predictedRole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-[#111322]">Analysis History</h2>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Manage previous scans</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search by filename or role..."
            className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 w-80 text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Resume Details</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">Predicted Role</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400">ATS Score</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic">Loading history...</td></tr>
            ) : filteredResumes.length > 0 ? (
              filteredResumes.map((resume) => (
                <tr key={resume._id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                        <HistoryIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-[#111322] text-sm">{resume.fileName}</p>
                        <p className="text-[10px] text-gray-400 font-black flex items-center gap-1 uppercase mt-0.5">
                          <Calendar size={10} /> {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-lg uppercase border border-gray-200">
                      {resume.predictedRole}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: `${resume.atsScore}%` }} />
                      </div>
                      <span className="text-sm font-black text-indigo-600">{resume.atsScore}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => navigate("/app/insights", { state: { resumeId: resume._id } })} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">
                      View Analysis <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="px-8 py-20 text-center text-gray-400 italic">No resumes found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;