const skillsList = require("../utils/skillsList");

const extractSkillsFromText = (text) => {
  const foundSkills = [];
  const lowerText = text.toLowerCase();

  skillsList.forEach((skill) => {
    const escapedSkill = skill.replace(".", "\\.");
    const regex = new RegExp(`\\b${escapedSkill}\\b`, "i");

    if (regex.test(lowerText)) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
};
const matchResumeWithJD = (resumeSkills, jobDescriptionText) => {
  const jdSkills = extractSkillsFromText(jobDescriptionText);

  const matchingSkills = resumeSkills.filter((skill) =>
    jdSkills.includes(skill)
  );

  const missingSkills = jdSkills.filter(
    (skill) => !resumeSkills.includes(skill)
  );

  const matchScore =
    jdSkills.length === 0
      ? 0
      : Math.round((matchingSkills.length / jdSkills.length) * 100);

  return {
    matchScore,
    matchingSkills,
    missingSkills,
  };
};

module.exports = matchResumeWithJD;