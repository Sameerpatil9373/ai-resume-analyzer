// backend/src/utils/skillNormalization.js refactor

const ALIAS_TO_CANONICAL = {
  mern: "mern",
  node: "node.js",
  nodejs: "node.js",
  "node js": "node.js",
  reactjs: "react",
  "react js": "react",
  mongodb: "mongodb",
  expressjs: "express",
  "express js": "express",
  js: "javascript",
  "machine-learning": "machine learning",
  ml: "machine learning",
};

const uniqLower = (arr = []) => [...new Set(arr.filter(Boolean).map((v) => v.toLowerCase()))];

const canonicalizeSkill = (skill = "") => ALIAS_TO_CANONICAL[skill.toLowerCase()] || skill.toLowerCase();

module.exports = {
  canonicalizeSkill,
  uniqLower,
};