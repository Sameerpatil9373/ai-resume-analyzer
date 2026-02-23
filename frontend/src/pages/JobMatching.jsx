import { useState, useEffect } from "react";
import axios from "axios";
import { Briefcase, MapPin, DollarSign, Zap, ExternalLink, Loader2 } from "lucide-react";

const JobMatching = () => {
  const [matchingData, setMatchingData] = useState({ role: "", jobs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };

        // Fetch the latest resume to see what role the AI predicted for you
        const response = await axios.get("http://localhost:5000/api/resume/all", config);
        const latestResume = response.data.data[0];

        if (latestResume) {
          // Simulated matches based on your AI-predicted role
          const mockJobs = [
            { id: 1, title: `Senior ${latestResume.predictedRole}`, company: "TechFlow AI", location: "Remote", salary: "$120k - $150k", match: 98 },
            { id: 2, title: latestResume.predictedRole, company: "Innovate Corp", location: "Mumbai, IN", salary: "₹18L - ₹24L", match: latestResume.atsScore },
            { id: 3, title: `Junior ${latestResume.predictedRole}`, company: "Startup Hub", location: "Bangalore, IN", salary: "₹8L - ₹12L", match: 85 }
          ];
          setMatchingData({ role: latestResume.predictedRole, jobs: mockJobs });
        }
      } catch (error) {
        console.error("Matching Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Finding matches...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-4xl font-black text-[#111322] tracking-tight">Job Matchmaker</h2>
          <p className="text-indigo-500 font-bold uppercase tracking-[0.2em] text-xs mt-2">
            Top picks for: <span className="text-gray-900">{matchingData.role || "Upload a resume first"}</span>
          </p>
        </div>
        <div className="hidden md:block bg-indigo-50 px-6 py-3 rounded-2xl">
          <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Active Searches</p>
          <p className="text-sm font-bold text-indigo-900">42 New Opportunities</p>
        </div>
      </div>

      <div className="grid gap-6">
        {matchingData.jobs.map((job) => (
          <div key={job.id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-wrap md:flex-nowrap items-center gap-8">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Briefcase size={28} />
            </div>

            <div className="flex-1 space-y-1">
              <h3 className="text-xl font-black text-[#111322]">{job.title}</h3>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1 text-indigo-500"><Zap size={14} /> {job.company}</span>
                <span className="flex items-center gap-1 text-emerald-500"><DollarSign size={14} /> {job.salary}</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 px-6 border-l border-gray-50">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">AI Match</p>
              <span className="text-2xl font-black text-indigo-600">{job.match}%</span>
            </div>

            <button className="bg-[#111322] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg">
              Apply Now <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobMatching;