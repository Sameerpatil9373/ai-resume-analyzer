import { useEffect, useState } from "react";
import api from "../services/api"; 
import { Briefcase, DollarSign, ExternalLink, Loader2, Target, Cpu } from "lucide-react";

const JobMatching = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("MERN");

  const fetchMatches = async (roleType) => {
    setLoading(true);
    try {
      const resumeRes = await api.get("/api/resume/all");
      const latestResume = resumeRes.data.data[0];

      if (latestResume) {
        // Broad categories based on your versatile profile
        const roles = {
          "MERN": [
            { id: 1, title: "MERN Stack Developer", salary: "₹12L - ₹22L", matchScore: 95, matchingSkills: ["React", "Node", "MongoDB"], missingSkills: ["Redis"] }
          ],
          "Java/Backend": [
            { id: 2, title: "Java Backend Developer", salary: "₹10L - ₹25L", matchScore: 92, matchingSkills: ["Java", "SQL"], missingSkills: ["Spring Boot"] }
          ],
          "AI/ML": [
            // Detects if you pivot towards AI Developer
            { id: 3, title: "AI/ML Engineer - Python", salary: "₹15L - ₹30L", matchScore: 78, matchingSkills: ["Python", "Logic Building"], missingSkills: ["PyTorch", "NLP"] },
            { id: 4, title: "Data Scientist (Junior)", salary: "₹8L - ₹15L", matchScore: 70, matchingSkills: ["Python", "SQL"], missingSkills: ["Scikit-learn", "Statistics"] }
          ]
        };
        setJobs(roles[roleType] || []);
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMatches(activeTab); }, [activeTab]);

  const handleApply = (title) => {
    // Better Approach: India-wide search without strict location
    const query = encodeURIComponent(`${title} jobs in India`);
    window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex justify-between items-center border-b pb-6">
        <h2 className="text-4xl font-black text-[#111322]">Market Matcher</h2>
        <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
          {["MERN", "Java/Backend", "AI/ML"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"}`}
            > {tab} </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-8">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                {activeTab === "AI/ML" ? <Cpu size={28} /> : <Briefcase size={28} />}
              </div>
              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-black text-[#111322]">{job.title}</h3>
                <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm"><DollarSign size={16} /> {job.salary}</span>
                <div className="flex flex-wrap gap-2">
                  {job.matchingSkills.map(s => <span key={s} className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded-md">✓ {s}</span>)}
                  {job.missingSkills.map(s => <span key={s} className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-bold rounded-md">× {s}</span>)}
                </div>
              </div>
              <div className="text-center px-8 border-l"><span className="text-3xl font-black text-indigo-600">{job.matchScore}%</span></div>
              <button onClick={() => handleApply(job.title)} className="bg-[#111322] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-indigo-600 transition-all">
                LinkedIn Apply <ExternalLink size={14} className="inline ml-1" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Practical AI Insight */}
      <div className="bg-indigo-900 rounded-[3rem] p-10 text-white flex items-center gap-8">
         <Target size={32} className="text-indigo-400 shrink-0" />
         <div>
            <h4 className="text-lg font-black uppercase tracking-widest">Market Strategy</h4>
            <p className="text-sm text-indigo-200">
              {activeTab === "AI/ML" 
                ? "Bhai, agar aap AI roles mein jana chahte hain, toh aapka MERN stack background (Express/Node) use karke 'AI Agent' development par focus karein." 
                : "Aapke current Java aur MERN skills industry standards ko match karte hain."}
            </p>
         </div>
      </div>
    </div>
  );
};

export default JobMatching;