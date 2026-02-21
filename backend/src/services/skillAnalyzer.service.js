const skillsList = require("../utils/skillsList");

/* ================================
   SKILL DETECTION
================================ */
const analyzeSkills = (text) => {
  const detectedSkills = [];
  const lowerText = text.toLowerCase();

  skillsList.forEach((skill) => {
    const escapedSkill = skill.replace(".", "\\."); 
    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");

    if (regex.test(lowerText)) {
      detectedSkills.push(skill);
    }
  });

  return detectedSkills;
};

/* ================================
   HELPER DETECTION FUNCTIONS
================================ */

// Detect Experience
const detectExperience = (text) => {
  const lowerText = text.toLowerCase();

  return (
    lowerText.includes("year") ||
    lowerText.includes("experience") ||
    lowerText.includes("worked at")
  );
};

// Detect Education
const detectEducation = (text) => {
  const lowerText = text.toLowerCase();

  return (
    lowerText.includes("bachelor") ||
    lowerText.includes("master") ||
    lowerText.includes("b.tech") ||
    lowerText.includes("m.tech") ||
    lowerText.includes("degree")
  );
};

// Detect Projects
const detectProjects = (text) => {
  return text.toLowerCase().includes("project");
};

// Detect Strong Resume Keywords
const detectQualityKeywords = (text) => {
  const lowerText = text.toLowerCase();

  const qualityWords = ["developed", "implemented", "designed", "optimized"];

  let count = 0;

  qualityWords.forEach((word) => {
    if (lowerText.includes(word)) {
      count++;
    }
  });

  return count;
};
/* ================================
   RESUME STRUCTURE VALIDATION
================================ */
const validateResumeStructure = (text) => {
  const lowerText = text.toLowerCase();

  const hasSkills =
    lowerText.includes("skills") ||
    lowerText.includes("technical skills");

  const hasEducation =
    lowerText.includes("education") ||
    lowerText.includes("bachelor") ||
    lowerText.includes("b.tech") ||
    lowerText.includes("degree");

  const hasExperience =
    lowerText.includes("experience") ||
    lowerText.includes("worked at");

  // Resume must have Skills AND (Education OR Experience)
  if (hasSkills && (hasEducation || hasExperience)) {
    return true;
  }

  return false;
};

/* ================================
   WEIGHTED ATS CALCULATION
================================ */
const calculateATS = (detectedSkills, text) => {
  let score = 0;

  // 1️⃣ Skills Match (50%)
  const skillScore = (detectedSkills.length / skillsList.length) * 50;
  score += skillScore;

  // 2️⃣ Experience (20%)
  if (detectExperience(text)) {
    score += 20;
  }

  // 3️⃣ Education (15%)
  if (detectEducation(text)) {
    score += 15;
  }

  // 4️⃣ Projects (10%)
  if (detectProjects(text)) {
    score += 10;
  }

  // 5️⃣ Quality Keywords (5%)
  const qualityCount = detectQualityKeywords(text);
  if (qualityCount >= 2) {
    score += 5;
  }

  return Math.round(score);
};

/* ================================
   ROLE PREDICTION
================================ */
const predictRole = (detectedSkills) => {
  if (
    detectedSkills.includes("node.js") &&
    detectedSkills.includes("express") &&
    detectedSkills.includes("mongodb")
  ) {
    return "Backend Developer";
  }

  if (
    detectedSkills.includes("react") &&
    detectedSkills.includes("javascript") &&
    detectedSkills.includes("html")
  ) {
    return "Frontend Developer";
  }

  if (
    detectedSkills.includes("python") &&
    detectedSkills.includes("mysql")
  ) {
    return "Python Developer";
  }

  return "General Software Developer";
};

/* ================================
   EXPORT
================================ */
module.exports = {
  analyzeSkills,
  calculateATS,
  predictRole,
  validateResumeStructure,
};