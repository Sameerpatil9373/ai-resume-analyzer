const ALIAS_TO_CANONICAL = {
  mern: "mern",
  "mern stack": "mern",
  node: "node.js",
  nodejs: "node.js",
  "node js": "node.js",
  reactjs: "react",
  "react js": "react",
  mongodb: "mongodb",
  "mongo db": "mongodb",
  expressjs: "express",
  "express js": "express",
  "rest api": "rest api",
  "rest apis": "rest api",
  restful: "rest",
  apis: "api",
  js: "javascript",
  "machine-learning": "machine learning",
  ml: "machine learning",
};

const CANONICAL_VARIANTS = {
  "node.js": ["node.js", "nodejs", "node js", "node"],
  react: ["react", "reactjs", "react js"],
  express: ["express", "expressjs", "express js"],
  mongodb: ["mongodb", "mongo db"],
  javascript: ["javascript", "js"],
  rest: ["rest", "restful"],
  api: ["api", "apis", "rest api", "rest apis"],
  "machine learning": ["machine learning", "machine-learning", "ml"],
};

const ROLE_IMPLICATIONS = [
  {
    keywords: ["mern", "mern stack"],
    skills: ["javascript", "mongodb", "express", "react", "node.js", "rest", "api"],
  },
  {
    keywords: ["fullstack", "full stack"],
    skills: ["html", "css", "javascript", "react", "node.js", "express", "api", "git"],
  },
  {
    keywords: ["ai", "ml", "machine learning"],
    skills: ["python", "machine learning", "pandas"],
  },
];

const uniqLower = (arr = []) => [...new Set(arr.filter(Boolean).map((value) => value.toLowerCase()))];

const canonicalizeSkill = (skill = "") => ALIAS_TO_CANONICAL[skill.toLowerCase()] || skill.toLowerCase();

const getCanonicalSkillVariants = (skill = "") => {
  const canonical = canonicalizeSkill(skill);
  return uniqLower([canonical, ...(CANONICAL_VARIANTS[canonical] || [])]);
};

const normalizeTextForSkillMatch = (text = "") =>
  text
    .toLowerCase()
    .replace(/[(){}\[\],;:|/\\]+/g, " ")
    .replace(/[\-_.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const extractRoleImpliedSkills = (text = "") => {
  const normalized = normalizeTextForSkillMatch(text);
  const implied = [];

  ROLE_IMPLICATIONS.forEach(({ keywords, skills }) => {
    const hasKeyword = keywords.some((keyword) => normalized.includes(keyword));
    if (hasKeyword) implied.push(...skills);
  });

  return uniqLower(implied);
};

module.exports = {
  normalizeTextForSkillMatch,
  getCanonicalSkillVariants,
  extractRoleImpliedSkills,
  canonicalizeSkill,
  uniqLower,
};
