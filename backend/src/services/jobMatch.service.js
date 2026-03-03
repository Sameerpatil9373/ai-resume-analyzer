const { OpenRouter } = require("@openrouter/sdk");
const { analyzeSkills } = require("./skillAnalyzer.service");

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const uniq = (arr) => [...new Set((arr || []).filter(Boolean))];

// ✅ IMPROVED: Semantic implied skills logic
const impliedSkillsFromRoleText = (text) => {
  const t = (text || "").toLowerCase();
  const implied = [];

  if (t.includes("mern") || t.includes("mongodb") || t.includes("react")) {
    implied.push("javascript", "react", "node.js", "express", "mongodb", "rest api");
  }
  if (t.includes("full stack") || t.includes("fullstack")) {
    implied.push("html", "css", "javascript", "react", "node.js", "express", "api", "git");
  }
  if (t.includes("java")) {
    implied.push("java", "oops", "sql", "api");
  }
  if (t.includes("python") || t.includes("ai") || t.includes("ml")) {
    implied.push("python", "pandas", "machine learning");
  }

  return uniq(implied);
};

// ✅ ROBUST FALLBACK: Fixes the 'React dev knows JS' logic manually
const buildHeuristicMatch = (resumeText, jobDescription, reason) => {
  const resumeSkills = uniq(analyzeSkills(resumeText || "").map((s) => s.toLowerCase()));
  const jdSkillsExplicit = uniq(analyzeSkills(jobDescription || "").map((s) => s.toLowerCase()));
  const jdSkillsImplied = impliedSkillsFromRoleText(jobDescription || "");
  const required = uniq([...jdSkillsExplicit, ...jdSkillsImplied]);

  if (required.length === 0) {
    return {
      matchScore: 0,
      matchingSkills: [],
      missingSkills: [],
      explanation: reason || "Provide a detailed JD for better AI matching."
    };
  }

  // ✅ CRITICAL FIX: Explicitly check for implied JS
  const matching = required.filter((s) => {
    if (resumeSkills.includes(s)) return true;
    // Logical Rule: React/Node on resume = JavaScript match
    if (s === "javascript" && (resumeSkills.includes("react") || resumeSkills.includes("node.js"))) return true;
    return false;
  });

  const missing = required.filter((s) => !matching.includes(s));
  const score = Math.max(10, Math.min(100, Math.round((matching.length / required.length) * 100)));

  return {
    matchScore: score,
    matchingSkills: matching,
    missingSkills: missing,
    explanation: reason || "Heuristic match based on tech stack alignment."
  };
};

const enrichJobDescription = (jobDescription) => {
  const jd = (jobDescription || "").trim();
  const explicit = analyzeSkills(jd);
  const implied = impliedSkillsFromRoleText(jd);
  const skills = uniq([...explicit.map((s) => s.toLowerCase()), ...implied]);

  if (jd.length < 100 || explicit.length === 0) {
    if (skills.length === 0) return jd;
    return `${jd}\n\nImplied requirements: ${skills.join(", ")}.`;
  }
  return jd;
};

const analyzeJobMatch = async (resumeText, jobDescription) => {
  try {
    const enrichedJD = enrichJobDescription(jobDescription);
    
    // ✅ Using Trinity-Large Reasoning
    const response = await openrouter.chat.send({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "system",
          content: `You are an expert ATS. 
          REASONING RULE: If a candidate has 'React' or 'Node.js', they implicitly have 'JavaScript' skills. DO NOT mark JavaScript as missing.
          Always return ONLY a valid JSON object.`
        },
        {
          role: "user",
          content: `Resume: ${resumeText}\n\nJob: ${enrichedJD}\n\n
          Return JSON:
          {
            "matchScore": number,
            "matchingSkills": [],
            "missingSkills": [],
            "explanation": "Brief semantic suitability analysis."
          }`
        }
      ]
    });

    const content = response.choices[0]?.message?.content;
    const jsonMatch = (content || "").match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON from AI");
    
    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("Match Analysis Error:", error.message);
    return buildHeuristicMatch(
      resumeText,
      jobDescription,
      "AI service rate-limited. Showing heuristic match based on detected stack."
    );
  }
};

module.exports = { analyzeJobMatch };