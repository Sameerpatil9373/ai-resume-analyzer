const skillsList = require("../utils/skillsList");
const {
  normalizeTextForSkillMatch,
  getCanonicalSkillVariants,
  extractRoleImpliedSkills,
  canonicalizeSkill,
  uniqLower,
} = require("../utils/skillNormalization");

const analyzeSkills = (text) => {
  const normalizedText = normalizeTextForSkillMatch(text || "");
  const detected = new Set();

  skillsList.forEach((skill) => {
    const variants = getCanonicalSkillVariants(skill);
    variants.forEach((variant) => {
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?:^|\\s)${escaped}(?=$|\\s)`, "i");
      if (regex.test(normalizedText)) {
        detected.add(canonicalizeSkill(skill));
      }
    });
  });

  extractRoleImpliedSkills(text).forEach((skill) => detected.add(skill));

  return Array.from(detected);
};

const detectExperience = (text) => {
  const lowerText = (text || "").toLowerCase();
  return lowerText.includes("year") || lowerText.includes("experience") || lowerText.includes("worked at");
};

const detectEducation = (text) => {
  const lowerText = (text || "").toLowerCase();
  return lowerText.includes("bachelor") || lowerText.includes("master") || lowerText.includes("b.tech") || lowerText.includes("university") || lowerText.includes("degree");
};

const detectProjects = (text) => (text || "").toLowerCase().includes("project");

const detectQualityKeywords = (text) => {
  const lowerText = (text || "").toLowerCase();
  const qualityWords = ["developed", "implemented", "designed", "optimized", "managed", "created"];
  return qualityWords.filter((word) => lowerText.includes(word)).length;
};

const validateResumeStructure = (text) => {
  const lowerText = (text || "").toLowerCase();
  const hasSkills = lowerText.includes("skills") || lowerText.includes("technical");
  const hasEducation = lowerText.includes("education") || lowerText.includes("bachelor") || lowerText.includes("degree");
  const hasExperience = lowerText.includes("experience") || lowerText.includes("internship") || lowerText.includes("work");

  return hasSkills || hasEducation || hasExperience;
};

const calculateATS = (skills, text) => {
  const skillScore = Math.min((skills.length / skillsList.length) * 60, 60);
  const structureScore = validateResumeStructure(text) ? 20 : 0;
  const qualityScore = Math.min(detectQualityKeywords(text) * 2, 20);

  return Math.round(skillScore + structureScore + qualityScore);
};

const predictRole = (skills) => {
  const normalizedSkills = uniqLower((skills || []).map(canonicalizeSkill));

  if (normalizedSkills.includes("react") && normalizedSkills.includes("node.js")) return "Full Stack Developer";
  if (normalizedSkills.includes("python") && normalizedSkills.includes("machine learning")) return "AI/ML Engineer";
  if (normalizedSkills.includes("java") && normalizedSkills.includes("sql")) return "Backend Developer";
  return "Software Developer";
};

module.exports = {
  analyzeSkills,
  detectExperience,
  detectEducation,
  detectProjects,
  calculateATS,
  predictRole,
  validateResumeStructure,
};
