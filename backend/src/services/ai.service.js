const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const generateContent = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    return response.data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    throw new Error("Gemini API request failed");
  }
};

/* ================================
   GENERATE RESUME SUMMARY
================================ */
const generateResumeSummary = async (resumeText) => {
  const prompt = `
Generate a short professional resume summary (4-5 lines) based on this resume:

${resumeText}
`;

  return await generateContent(prompt);
};

/* ================================
   GENERATE INTERVIEW QUESTIONS
================================ */
const generateInterviewQuestions = async (skills) => {
  const prompt = `
Generate 5 technical interview questions based on these skills:
${skills.join(", ")}
Return only bullet points.
`;

  return await generateContent(prompt);
};

/* ================================
   EXPLAIN ROLE SUITABILITY
================================ */
const explainRoleSuitability = async (skills, role) => {
  const prompt = `
Explain in 4-5 lines why a candidate with these skills:
${skills.join(", ")}
is suitable for the role of ${role}.
`;

  return await generateContent(prompt);
};

module.exports = {
  generateResumeSummary,
  generateInterviewQuestions,
  explainRoleSuitability,
};