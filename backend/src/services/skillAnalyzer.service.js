const skillsList = require("../utils/skillsList");

const analyzeSkills = (text) => {
  const detectedSkills = [];
  const lowerText = text.toLowerCase();

  skillsList.forEach((skill) => {
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // UPDATED: Advanced Regex to handle symbols like React/Node or Java|Python
    const regex = new RegExp(`(?:^|\\s|[\\/\\|•,])(${escapedSkill})(?=$|\\s|[\\/\\|•,])`, "i");

    if (regex.test(lowerText)) {
      detectedSkills.push(skill);
    }
  });

  return detectedSkills;
};

const detectExperience = (text) => {
  const lowerText = text.toLowerCase();
  return lowerText.includes("year") || lowerText.includes("experience") || lowerText.includes("worked at");
};

const detectEducation = (text) => {
  const lowerText = text.toLowerCase();
  return lowerText.includes("bachelor") || lowerText.includes("master") || lowerText.includes("b.tech") || lowerText.includes("university") || lowerText.includes("degree");
};

const detectProjects = (text) => text.toLowerCase().includes("project");

const detectQualityKeywords = (text) => {
  const lowerText = text.toLowerCase();
  const qualityWords = ["developed", "implemented", "designed", "optimized", "managed", "created"];
  return qualityWords.filter(word => lowerText.includes(word)).length;
};

const validateResumeStructure = (text) => {
  const lowerText = text.toLowerCase();
  const hasSkills = lowerText.includes("skills") || lowerText.includes("technical");
  const hasEducation = lowerText.includes("education") || lowerText.includes("bachelor") || lowerText.includes("degree");
  const hasExperience = lowerText.includes("experience") || lowerText.includes("projects") || lowerText.includes("worked");
  return !!(hasSkills && (hasEducation || hasExperience));
};

const calculateATS = (detectedSkills, text) => {
  let score = 0;
  if (skillsList.length > 0) score += (detectedSkills.length / skillsList.length) * 50;
  if (detectExperience(text)) score += 20;
  if (detectEducation(text)) score += 15;
  if (detectProjects(text)) score += 10;
  if (detectQualityKeywords(text) >= 2) score += 5;
  return Math.round(score);
};

const predictRole = (detectedSkills) => {
  const skills = detectedSkills.map(s => s.toLowerCase());

  // 1. DevOps Priority
  if (skills.includes("docker") || skills.includes("kubernetes") || skills.includes("aws") || skills.includes("jenkins")) {
    return "DevOps Engineer";
  }
  
  // 2. Python Developer
  if (skills.includes("python") || skills.includes("django") || skills.includes("flask")) {
    return "Python Developer";
  }

  // 3. Full Stack vs Backend vs Frontend
  const hasBackend = skills.includes("node.js") || skills.includes("express") || skills.includes("mongodb") || skills.includes("postgresql");
  const hasFrontend = skills.includes("react") || skills.includes("next.js") || skills.includes("javascript");

  if (hasBackend && hasFrontend) return "Full Stack Developer";
  if (hasBackend) return "Backend Developer";
  if (hasFrontend) return "Frontend Developer";

  if (skills.includes("java")) return "Java Developer";

  return "Software Developer";
};

module.exports = { analyzeSkills, calculateATS, predictRole, validateResumeStructure };