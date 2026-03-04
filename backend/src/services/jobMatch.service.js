const { analyzeSkills } = require("./skillAnalyzer.service");
const { canonicalizeSkill, uniqLower } = require("../utils/skillNormalization");

/*
  Predefined Industry Role Templates
  You can expand this later if needed
*/
const roleTemplates = {
  "Backend Developer": [
    "nodejs", "express", "mongodb", "api", "jwt",
    "database", "rest", "authentication", "deployment"
  ],

  "Frontend Developer": [
    "react", "javascript", "html", "css",
    "redux", "responsive design", "hooks"
  ],

  "Full Stack Developer": [
    "react", "nodejs", "mongodb", "express",
    "javascript", "api", "deployment"
  ],

  "Java Developer": [
    "java", "spring", "hibernate",
    "rest", "microservices"
  ],

  "Python Developer": [
    "python", "django", "flask",
    "api", "database"
  ],

  "Software Tester": [
    "testing", "selenium",
    "automation", "jira", "test cases"
  ],

  "AI / ML Engineer": [
    "python", "machine learning",
    "tensorflow", "pandas", "data science"
  ],

  "Cyber Security Analyst": [
    "cyber security",
    "network security",
    "penetration testing",
    "firewall"
  ]
};

const analyzeJobMatch = async (resumeText, jobDescription) => {
  const resumeSkills = uniqLower(
    analyzeSkills(resumeText).map(canonicalizeSkill)
  );

  // 🔥 CASE 1 — If user provides job description
  if (jobDescription && jobDescription.trim().length > 10) {
    const jobSkills = uniqLower(
      analyzeSkills(jobDescription).map(canonicalizeSkill)
    );

    if (!jobSkills.length) {
      return [
        {
          role: "Custom Role",
          matchScore: 0,
          matchingSkills: [],
          missingSkills: [],
          explanation: "Job description too short. Add required skills."
        }
      ];
    }

    const matchingSkills = jobSkills.filter(skill =>
      resumeSkills.includes(skill)
    );

    const missingSkills = jobSkills.filter(skill =>
      !resumeSkills.includes(skill)
    );

    const matchScore = Math.round(
      (matchingSkills.length / jobSkills.length) * 100
    );

    return [
      {
        role: "Custom Role",
        matchScore,
        matchingSkills,
        missingSkills,
        explanation: `
You are ${matchScore}% aligned with this role.
To improve your profile, focus on: ${missingSkills.join(", ") || "No major gaps detected"}.
`
      }
    ];
  }

  // 🔥 CASE 2 — No JD → Auto-match with predefined roles
  const results = [];

  for (const role in roleTemplates) {
    const requiredSkills = roleTemplates[role];

    const matchingSkills = requiredSkills.filter(skill =>
      resumeSkills.includes(skill)
    );

    const missingSkills = requiredSkills.filter(skill =>
      !resumeSkills.includes(skill)
    );

    const matchScore = Math.round(
      (matchingSkills.length / requiredSkills.length) * 100
    );

    results.push({
      role,
      matchScore,
      matchingSkills,
      missingSkills,
      explanation:
        matchScore >= 80
          ? "Excellent fit for this role based on core skill alignment."
          : matchScore >= 60
          ? `Good match. Improve skills like ${missingSkills.join(", ")} to strengthen profile.`
          : `Partial match. Consider developing ${missingSkills.join(", ")} for better opportunities.`
    });
  }

  // Sort highest match first
  return results.sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = { analyzeJobMatch };