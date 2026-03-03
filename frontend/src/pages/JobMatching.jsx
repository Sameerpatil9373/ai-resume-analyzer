import { useEffect, useState } from "react";
import api from "../services/api";
import { Briefcase, ExternalLink, Loader2, Target, Cpu } from "lucide-react";

const ROLE_TEMPLATES = {
  MERN: {
    title: "MERN Stack Developer",
    jd: "Hiring a MERN developer with strong skills in JavaScript, React, Node.js, Express, MongoDB, REST APIs, and Git. Candidate should build end-to-end web apps and collaborate with product teams."
  },
  "Java/Backend": {
    title: "Java Backend Developer",
    jd: "Looking for a backend developer with Java, SQL, API design, OOP, and scalable service development experience. Familiarity with microservices and cloud deployment is preferred."
  },
  "AI/ML": {
    title: "AI/ML Engineer",
    jd: "Seeking an AI/ML engineer proficient in Python, machine learning, pandas, model evaluation, and deployment. Experience in building intelligent features for products is preferred."
  }
};

const JobMatching = () => {
  const [jobMatch, setJobMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("MERN");
  const [hasResume, setHasResume] = useState(true);

  const fetchMatches = async (roleType) => {
    setLoading(true);
    try {
      const resumeRes = await api.get("/api/resume/all");
      const latestResume = resumeRes.data.data[0];

      if (!latestResume) {
        setHasResume(false);
        setJobMatch(null);
        return;
      }

      setHasResume(true);
      const role = ROLE_TEMPLATES[roleType];
      const matchRes = await api.post("/api/resume/match", {
        resumeId: latestResume._id,
        jobDescription: role.jd
      });

      setJobMatch({
        id: roleType,
        title: role.title,
        ...matchRes.data
      });
    } catch (error) {
      console.error(error);
      setJobMatch(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(activeTab);
  }, [activeTab]);

  const handleApply = (title) => {
    const query = encodeURIComponent(`${title} jobs in India`);
    window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      <div className="flex justify-between items-center border-b pb-6">
        <h2 className="text-4xl font-black text-[#111322]">Market Matcher</h2>
        <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
          {Object.keys(ROLE_TEMPLATES).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
      ) : !hasResume ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm font-semibold text-amber-800">Upload a resume on Dashboard to view market matches.</div>
      ) : !jobMatch ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">Unable to generate market match right now. Please retry.</div>
      ) : (
        <div className="grid gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
              {activeTab === "AI/ML" ? <Cpu size={28} /> : <Briefcase size={28} />}
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-black text-[#111322]">{jobMatch.title}</h3>
              <div className="flex flex-wrap gap-2">
                {jobMatch.matchingSkills?.map((s) => <span key={s} className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded-md">✓ {s}</span>)}
                {jobMatch.missingSkills?.map((s) => <span key={s} className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-bold rounded-md">× {s}</span>)}
              </div>
              {jobMatch.source && <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Source: {jobMatch.source}</p>}
            </div>
            <div className="text-center px-8 border-l"><span className="text-3xl font-black text-indigo-600">{jobMatch.matchScore}%</span></div>
            <button onClick={() => handleApply(jobMatch.title)} className="bg-[#111322] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-indigo-600 transition-all">
              LinkedIn Apply <ExternalLink size={14} className="inline ml-1" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-indigo-900 rounded-[3rem] p-10 text-white flex items-center gap-8">
        <Target size={32} className="text-indigo-400 shrink-0" />
        <div>
          <h4 className="text-lg font-black uppercase tracking-widest">Market Strategy</h4>
          <p className="text-sm text-indigo-200">
            {activeTab === "AI/ML"
              ? "To pivot into AI roles, strengthen model deployment and project-level ML outcomes on your resume."
              : "Increase your score by adding missing tools to projects and quantifying impact in work experience."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobMatching;
