const { uniqLower, canonicalizeSkill } = require("../utils/skillNormalization");

/**
 * Common technical skills dictionary
 */
const COMMON_SKILLS = [
  "html","css","javascript","react","vue","angular",
  "node","node.js","express","mongodb","mysql","sql",
  "java","python","c++","bootstrap","git","github",
  "postman","rest api","docker","kubernetes","aws",
  "machine learning","tensorflow","pytorch","pandas",
  "selenium","testing","automation","excel","tableau"
];

/**
 * Technology stack detection
 */
const STACK_MAP = {
  "mern": ["mongodb","express","react","node","javascript"],
  "software tester": ["testing","selenium","automation"],
  "qa": ["testing","selenium","automation"],
  "data analyst": ["sql","excel","tableau"]
};


/**
 * Skill detection (dictionary + stack logic)
 */
const analyzeSkillsAI = async (text) => {

  const lowerText = text.toLowerCase();

  let detectedSkills = [];

  /**
   * Detect stacks like MERN
   */
  for (const stack in STACK_MAP) {
    if (lowerText.includes(stack)) {
      detectedSkills.push(...STACK_MAP[stack]);
    }
  }

  /**
   * Detect skills directly from resume text
   */
  const textSkills = COMMON_SKILLS.filter(skill =>
    lowerText.includes(skill)
  );

  detectedSkills.push(...textSkills);

  console.log("🧠 Detected Skills:", detectedSkills);

  return enforceImplicitLogic(detectedSkills);

};


/**
 * Skill normalization + logic
 */
const enforceImplicitLogic = (skills) => {

  const normalized = uniqLower(
    skills.map(canonicalizeSkill)
  );

  /**
   * React implies frontend stack
   */
  if (normalized.includes("react")) {
    if (!normalized.includes("html")) normalized.push("html");
    if (!normalized.includes("css")) normalized.push("css");
  }

  /**
   * MySQL implies SQL
   */
  if (normalized.includes("mysql") && !normalized.includes("sql")) {
    normalized.push("sql");
  }

  return normalized.slice(0, 20);

};


/**
 * ATS Score calculation
 */
const calculateATS = (skills, text) => {

  const finalSkills = enforceImplicitLogic(skills);

  let score = 40;

  if (finalSkills.length >= 8) score += 15;

  if (text.toLowerCase().includes("project")) score += 15;

  if (
    text.toLowerCase().includes("internship") ||
    text.toLowerCase().includes("experience")
  ) score += 15;

  if (text.toLowerCase().includes("education")) score += 10;

  return Math.min(score, 90);

};


/**
 * Role prediction
 */
const predictRole = (skills) => {

  const s = enforceImplicitLogic(skills);

  if (s.includes("react") && s.includes("node"))
    return "Full Stack Developer";

  if (s.includes("react"))
    return "Frontend Developer";

  if (s.includes("node") || s.includes("express"))
    return "Backend Developer";

  if (s.includes("testing") || s.includes("selenium"))
    return "Software Tester";

  if (s.includes("sql") && s.includes("excel"))
    return "Data Analyst";

  return "Software Developer";

};


module.exports = {
  analyzeSkillsAI,
  calculateATS,
  predictRole,
  enforceImplicitLogic
};