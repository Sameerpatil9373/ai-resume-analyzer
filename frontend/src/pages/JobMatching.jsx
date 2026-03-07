import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Briefcase,
  ExternalLink,
  Loader2,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  Sparkles,
} from "lucide-react";

const JobMatching = () => {
  const [jobMatches, setJobMatches] = useState([]);
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // 1. Get your latest resume data
        const resumeRes = await api.get("/api/resume/all");
        const latest = resumeRes.data.data[0];

        if (latest) {
          setResumeData(latest);

          // 2. Proactive Job Matching:
          // We send a specific flag/request to the backend to "recommend" 
          // roles based on the detected skills rather than a single JD.
          const matchRes = await api.post("/api/resume/match", {
            resumeId: latest._id,
            // We pass a prompt instead of a JD to trigger "Discovery Mode"
            jobDescription: "RECOMMEND_MULTIPLE_ROLES_BASED_ON_SKILLS" 
          });

          setJobMatches(Array.isArray(matchRes.data) ? matchRes.data : [matchRes.data]);
        }
      } catch (err) {
        console.error("Discovery error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleApply = (role) => {
    const query = encodeURIComponent(`"${role}" jobs`);
    window.open(
      `https://www.linkedin.com/jobs/search/?keywords=${query}&location=India`,
      "_blank"
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h2 className="text-3xl font-black text-[#111322]">Market Matcher</h2>
          <p className="text-gray-500 text-sm mt-1">
            AI-powered career paths based on your <span className="text-indigo-600 font-bold">{resumeData?.predictedRole}</span> profile.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
          <Sparkles className="text-indigo-600" size={18} />
          <span className="text-xs font-bold uppercase text-indigo-600">Career Discovery Active</span>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobMatches.map((job, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-indigo-600" />
                    <h3 className="text-lg font-bold leading-tight">{job.role}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black px-2 py-1 rounded-full text-white ${getScoreColor(job.matchScore)}`}>
                    {job.matchScore}% FIT
                  </span>
                </div>
              </div>

              {/* Matching Skills */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Top Strengths</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchingSkills?.slice(0, 4).map((skill) => (
                    <span key={skill} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-100">
                      <CheckCircle2 size={10} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              {job.missingSkills?.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Skills to Gain</p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.missingSkills.slice(0, 3).map((skill) => (
                      <span key={skill} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100">
                        <XCircle size={10} />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                {job.explanation}
              </p>
            </div>

            <button
              onClick={() => handleApply(job.role)}
              className="mt-6 flex items-center justify-center gap-2 bg-[#111322] text-white py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600 transition shadow-md"
            >
              Explore {job.role} Jobs <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobMatching;