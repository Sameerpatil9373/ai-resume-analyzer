import { useEffect, useState } from "react";
import api from "../services/api";
import { Briefcase, ExternalLink, Loader2, Sparkles, BrainCircuit } from "lucide-react";

const JobMatching = () => {
  const [jobMatches, setJobMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [hasResume, setHasResume] = useState(true);

  const fetchDynamicMatches = async () => {
    setLoading(true);
    try {
      const resumeRes = await api.get("/api/resume/all");
      const latestResume = resumeRes.data.data[0];

      if (!latestResume) {
        setHasResume(false);
        setJobMatches([]);
        return;
      }

      setHasResume(true);
      setResumeData(latestResume);

      const matchRes = await api.post("/api/resume/match", {
        resumeId: latestResume._id,
        jobDescription: ""
      });

      setJobMatches(matchRes.data);
    } catch (error) {
      console.error("Match failed:", error);
      setJobMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDynamicMatches();
  }, []);

  // 🔥 FIXED LINKEDIN SEARCH (Exact Role + Skills)
  const handleApply = (title) => {
    const skillKeywords = resumeData?.skillsDetected?.slice(0, 2).join(" ");
    const baseQuery = `"${title}" ${skillKeywords} jobs`;
    const query = encodeURIComponent(baseQuery);

    window.open(
      `https://www.linkedin.com/jobs/search/?keywords=${query}&location=India`,
      "_blank"
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-rose-500";
  };

  if (loading)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
          Analyzing Market Fit...
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 mt-6">

      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-[#111322] tracking-tight">
            Market Matcher
          </h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
            Multi-Role Skill Alignment
          </p>
        </div>

        {resumeData && (
          <div className="px-4 py-2 bg-indigo-50 rounded-xl flex items-center gap-2 border border-indigo-100">
            <BrainCircuit size={16} className="text-indigo-600" />
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {resumeData.predictedRole}
            </span>
          </div>
        )}
      </div>

      {!hasResume ? (
        <div className="p-10 text-center bg-amber-50 border border-amber-200 rounded-2xl">
          <p className="text-lg font-bold text-amber-700">
            No Resume Uploaded
          </p>
        </div>
      ) : jobMatches.length === 0 ? (
        <div className="p-10 text-center bg-rose-50 border border-rose-200 rounded-2xl">
          <p className="text-lg font-bold text-rose-700">
            Matching Failed
          </p>
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {jobMatches.map((job, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <Briefcase size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-[#111322]">
                      {job.role}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.matchingSkills?.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>

                  {job.missingSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.missingSkills.slice(0, 5).map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-lg border border-rose-100"
                        >
                          × {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                    <span>Fit Score</span>
                    <span>{job.matchScore}%</span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className={`h-2 rounded-full ${getScoreColor(job.matchScore)}`}
                      style={{ width: `${job.matchScore}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => handleApply(job.role)}
                    className="mt-4 w-full bg-[#111322] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    Apply <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Growth Section */}
          <div className="bg-indigo-900 rounded-2xl p-8 text-white mt-10 flex items-center gap-6 shadow-lg">
            <Sparkles size={28} className="text-indigo-300" />
            <p className="text-sm leading-relaxed">
              Improve skills like{" "}
              <span className="font-bold underline">
                {jobMatches[0]?.missingSkills?.slice(0, 3).join(", ") ||
                  "Advanced Architecture"}
              </span>{" "}
              to increase your top role match percentage.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default JobMatching;