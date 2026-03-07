const analyzeJobMatch = async (resumeText, skills) => {

  // Normalize resume skills
  let resumeSkills = skills.map(s => s.toLowerCase());

  /**
   * Smart Skill Inference
   * If certain skills exist, infer related skills automatically
   */

  // Node + Express → API
  if (
    resumeSkills.includes("node") ||
    resumeSkills.includes("node.js")
  ) {
    if (resumeSkills.includes("express") && !resumeSkills.includes("api")) {
      resumeSkills.push("api");
    }
  }

  // React + JS → Frontend capability
  if (
    resumeSkills.includes("react") &&
    resumeSkills.includes("javascript")
  ) {
    resumeSkills.push("frontend");
  }

  // Python + Pandas → Data science related
  if (
    resumeSkills.includes("python") &&
    resumeSkills.includes("pandas")
  ) {
    resumeSkills.push("data analysis");
  }


  const roleTemplates = {

    "Frontend Developer": [
      "html","css","javascript","react","vue","angular"
    ],

    "Backend Developer": [
      "node","express","mongodb","sql","api"
    ],

    "Full Stack Developer": [
      "react","node","express","mongodb","javascript"
    ],

    "Software Tester": [
      "testing","automation","selenium","test"
    ],

    "AI / ML Engineer": [
      "python","machine learning","tensorflow","pytorch"
    ],

    "Data Scientist": [
      "python","pandas","numpy","machine learning"
    ],

    "Data Analyst": [
      "sql","excel","tableau","power bi"
    ],

    "Cyber Security Analyst": [
      "cyber","penetration","firewall","security"
    ],

    "DevOps Engineer": [
      "docker","kubernetes","aws","ci","cd"
    ],

    "Java Developer": [
      "java","spring","hibernate"
    ],

    "Python Developer": [
      "python","django","flask"
    ]

  };


  const results = [];

  for (const role in roleTemplates) {

    const roleSkills = roleTemplates[role];

    const matchingSkills = roleSkills.filter(skill =>
      resumeSkills.some(s =>
        s.includes(skill) || skill.includes(s)
      )
    );

    const missingSkills = roleSkills.filter(skill =>
      !resumeSkills.some(s =>
        s.includes(skill) || skill.includes(s)
      )
    );

    const matchScore =
      roleSkills.length > 0
        ? Math.round(
            (matchingSkills.length /
              (matchingSkills.length + missingSkills.length)) * 100
          )
        : 0;

    if (matchScore >= 30) {

      results.push({
        role,
        matchScore,
        matchingSkills,
        missingSkills,
        explanation:
          matchScore >= 80
            ? "Strong alignment with required skills."
            : matchScore >= 50
            ? "Partial alignment. Improve missing skills."
            : "Low alignment. Consider learning missing skills."
      });

    }

  }

  return results
    .sort((a,b) => b.matchScore - a.matchScore)
    .slice(0,5);

};

module.exports = { analyzeJobMatch };