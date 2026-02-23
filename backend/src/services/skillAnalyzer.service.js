const skillsList = require("../utils/skillsList");

/* ================================
   SKILL DETECTION (CORRECTED)
================================ */
/**
 * Detects skills from the resume text.
 * Escapes special characters (like ++ in C++ or . in Node.js) 
 * to prevent Regex "Nothing to repeat" errors.
 */
const analyzeSkills = (text) => {
  const detectedSkills = [];
  const lowerText = text.toLowerCase();

  skillsList.forEach((skill) => {
    // 1. Escape special characters like + . * ? ^ $ { } ( ) [ ] | \
    // This transforms "C++" into "C\+\+" so Regex treats it as literal text
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 2. Use word boundaries (\b) to ensure we match "Java" but not "JavaScript"
    // The "i" flag makes it case-insensitive
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
    lowerText.includes("degree") ||
    lowerText.includes("university")
  );
};

// Detect Projects
const detectProjects = (text) => {
  return text.toLowerCase().includes("project");
};

// Detect Strong Resume Keywords
const detectQualityKeywords = (text) => {
  const lowerText = text.toLowerCase();
  const qualityWords = ["developed", "implemented", "designed", "optimized", "managed", "created"];

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
    lowerText.includes("worked at") ||
    lowerText.includes("employment");

  // Resume must have Skills AND (Education OR Experience)
  return !!(hasSkills && (hasEducation || hasExperience));
};

/* ================================
   WEIGHTED ATS CALCULATION
================================ */
const calculateATS = (detectedSkills, text) => {
  let score = 0;

  // 1️⃣ Skills Match (50%)
  // Calculation: (User Skills / Total Possible Skills) * 50
  if (skillsList.length > 0) {
    const skillScore = (detectedSkills.length / skillsList.length) * 50;
    score += skillScore;
  }

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
  const skills = detectedSkills.map(s => s.toLowerCase());

  if (
    skills.includes("node.js") || 
    skills.includes("express") || 
    skills.includes("mongodb")
  ) {
    return "Backend Developer";
  }

  if (
    skills.includes("react") || 
    skills.includes("javascript") || 
    skills.includes("html")
  ) {
    return "Frontend Developer";
  }

  if (
    skills.includes("python") || 
    skills.includes("django") || 
    skills.includes("flask")
  ) {
    return "Python Developer";
  }

  if (
    skills.includes("java") || 
    skills.includes("spring boot")
  ) {
    return "Java Developer";
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