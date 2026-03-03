const { OpenRouter } = require("@openrouter/sdk");
const { analyzeSkills } = require("./skillAnalyzer.service");
const {
  canonicalizeSkill,
  extractRoleImpliedSkills,
  uniqLower,
} = require("../utils/skillNormalization");

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const buildHeuristicMatch = (resumeText, jobDescription, reason) => {
  const resumeSkills = uniqLower(analyzeSkills(resumeText || "").map(canonicalizeSkill));
  const jdSkillsExplicit = uniqLower(analyzeSkills(jobDescription || "").map(canonicalizeSkill));
  const jdSkillsImplied = extractRoleImpliedSkills(jobDescription || "");
  const required = uniqLower([...jdSkillsExplicit, ...jdSkillsImplied]);

  if (required.length === 0) {
    return {
      matchScore: 0,
      matchingSkills: [],
      missingSkills: [],
      source: "heuristic",
      explanation: reason || "Provide a detailed JD for better matching.",
    };
  }

  const matching = required.filter((skill) => {
    if (resumeSkills.includes(skill)) return true;
    if (skill === "javascript" && (resumeSkills.includes("react") || resumeSkills.includes("node.js"))) return true;
    if (skill === "api" && resumeSkills.includes("rest")) return true;
    return false;
  });

  const missing = required.filter((skill) => !matching.includes(skill));
  const score = Math.max(10, Math.min(100, Math.round((matching.length / required.length) * 100)));

  return {
    matchScore: score,
    matchingSkills: matching,
    missingSkills: missing,
    source: "heuristic",
    explanation: reason || "Deterministic skill match based on normalized skills and role implications.",
  };
};

const enrichJobDescription = (jobDescription) => {
  const jd = (jobDescription || "").trim();
  const explicit = analyzeSkills(jd).map(canonicalizeSkill);
  const implied = extractRoleImpliedSkills(jd);
  const skills = uniqLower([...explicit, ...implied]);

  if (jd.length < 100 || explicit.length === 0) {
    if (skills.length === 0) return jd;
    return `${jd}\n\nInterpreted required skills: ${skills.join(", ")}.`;
  }

  return jd;
};

const analyzeJobMatch = async (resumeText, jobDescription) => {
  const heuristicResult = buildHeuristicMatch(resumeText, jobDescription);

  if ((jobDescription || "").trim().length < 60) {
    return {
      ...heuristicResult,
      explanation: "Short job prompt detected. Used deterministic matching from interpreted role skills.",
    };
  }

  try {
    const enrichedJD = enrichJobDescription(jobDescription);

    const response = await openrouter.chat.send({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS assistant.
Always return ONLY valid JSON with this shape:
{
  "matchScore": number,
  "matchingSkills": string[],
  "missingSkills": string[],
  "explanation": string
}
Ground your response on the provided interpreted skills and resume text.`,
        },
        {
          role: "user",
          content: `Resume: ${resumeText}\n\nJob: ${enrichedJD}\n\nBaseline deterministic analysis: ${JSON.stringify(
            heuristicResult
          )}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const jsonMatch = (content || "").match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON from AI");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      ...parsed,
      source: "ai+heuristic",
      matchingSkills: uniqLower((parsed.matchingSkills || []).map(canonicalizeSkill)),
      missingSkills: uniqLower((parsed.missingSkills || []).map(canonicalizeSkill)),
    };
  } catch (error) {
    console.error("Match Analysis Error:", error.message);
    return buildHeuristicMatch(
      resumeText,
      jobDescription,
      "AI unavailable. Showing deterministic match based on normalized and implied skills."
    );
  }
};

module.exports = { analyzeJobMatch, buildHeuristicMatch };
