const analyzeJobMatch = async (resumeText, skills, userTargetRole = "") => {
  // Normalize resume skills to lowercase
  let resumeSkills = skills.map(s => s.toLowerCase());

  // Problem 3 Fix Safety Net: JS Inference
  if (resumeSkills.some(s => ["react", "node.js", "node", "express"].includes(s))) {
    if (!resumeSkills.includes("javascript")) resumeSkills.push("javascript");
  }

  // MERN Stack Indicator
  if (
    resumeSkills.includes("react") && 
    (resumeSkills.includes("node.js") || resumeSkills.includes("node")) &&
    resumeSkills.includes("mongodb")
  ) {
    if (!resumeSkills.includes("mern stack")) resumeSkills.push("mern stack");
  }

  // Frontend Capability
  if (resumeSkills.includes("react") || resumeSkills.includes("javascript")) {
    if (!resumeSkills.includes("frontend")) resumeSkills.push("frontend");
  }

  // Backend Capability
  if (
    resumeSkills.includes("node.js") || 
    resumeSkills.includes("express") || 
    resumeSkills.includes("python")
  ) {
    if (!resumeSkills.includes("backend")) resumeSkills.push("backend");
  }

  // Database Management
  if (resumeSkills.some(s => ["sql", "mysql", "mongodb", "postgres", "postgresql"].includes(s))) {
    if (!resumeSkills.includes("database management")) resumeSkills.push("database management");
  }

  const roleTemplates = {
    "Full Stack Developer": [
      "react", "node.js", "express", "mongodb", "javascript", "rest api"
    ],
    "MERN Stack Specialist": [
      "mongodb", "express", "react", "node.js", "mern stack", "redux", "tailwind"
    ],
    "Frontend Engineer": [
      "html", "css", "javascript", "react", "bootstrap", "responsive ui", "frontend"
    ],
    "Backend Developer": [
      "node.js", "express", "mongodb", "sql", "api", "postman", "backend"
    ],
    "JavaScript Developer": [
      "javascript", "es6", "react", "node.js", "git", "npm"
    ],
    "Software Engineer": [
      "java", "python", "c++", "dsa", "git", "oops"
    ],
    "Database Administrator": [
      "sql", "mysql", "mongodb", "database design", "database management"
    ],
    "Software Tester": [
      "testing", "automation", "selenium", "postman", "test scripts"
    ],
    "Python Developer": [
      "python", "django", "flask", "pandas", "numpy"
    ],
    "AI / ML Engineer": [
      "python", "machine learning", "tensorflow", "pytorch", "data analysis"
    ]
  };

  const results = [];

  for (const role in roleTemplates) {
    // FIX: Much smarter, stricter matching for user input
    if (userTargetRole && userTargetRole !== "RECOMMEND_MULTIPLE_ROLES_BASED_ON_SKILLS") {
      const searchTarget = userTargetRole.toLowerCase().trim();
      const roleName = role.toLowerCase();
      
      // 1. Check for a direct match first
      if (!roleName.includes(searchTarget) && !searchTarget.includes(roleName)) {
        
        // 2. If no direct match, check unique keywords (ignore generic words)
        const genericWords = ["software", "developer", "engineer", "specialist", "analyst", "administrator"];
        const searchWords = searchTarget.split(" ").filter(w => w.length > 2 && !genericWords.includes(w));
        
        const isMatch = searchWords.length > 0 && searchWords.some(word => roleName.includes(word));
        
        if (!isMatch) {
          continue; // Skip this role if it is definitely not a match
        }
      }
    }

    const roleSkills = roleTemplates[role];

    // Strict string matching to prevent "java" matching inside "javascript"
    const matchingSkills = roleSkills.filter(skill =>
      resumeSkills.some(s => {
        if (skill === "java" && s === "javascript") return false;
        if (skill === "node" && s === "node.js") return true;
        return s === skill || s.includes(skill) || skill.includes(s);
      })
    );

    // Identify missing skills
    const missingSkills = roleSkills.filter(skill => !matchingSkills.includes(skill));

    // Match score calculation
    const matchScore = Math.round((matchingSkills.length / roleSkills.length) * 100);

    // If the user specifically searched for this role, show it even if the score is 0%
    if (matchScore >= 25 || userTargetRole) {
      results.push({
        role,
        matchScore,
        matchingSkills,
        missingSkills,
        explanation:
          matchScore >= 80
            ? "Strong alignment with your current stack."
            : matchScore >= 50
            ? "Good fit. Focus on identified skill gaps to qualify."
            : "Foundation present. Consider learning the missing technologies for this path."
      });
    }
  }

  // Sort by score and return top results
  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
};

module.exports = { analyzeJobMatch };