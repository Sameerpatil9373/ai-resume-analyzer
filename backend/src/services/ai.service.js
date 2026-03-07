const axios = require("axios");

const generateFullAnalysis = async (resumeText, role, skills) => {

  try {

    console.log("🚀 Calling Ollama AI (gemma3:1b)");

    const trimmedResume = resumeText.substring(0, 600);

    const prompt = `
You are a senior software engineering interviewer.

Analyze the candidate resume and generate a hiring insight report.

Return ONLY valid JSON.

FORMAT:
{
 "summary": "4-5 line candidate summary",
 "questions": [
  "Question 1",
  "Question 2",
  "Question 3",
  "Question 4",
  "Question 5",
  "Question 6",
  "Question 7"
 ],
 "explanation": "short explanation about candidate suitability"
}

Rules:
- EXACTLY 7 questions
- Use ONLY the provided skills
- Output ONLY JSON

Role: ${role}
Skills: ${skills.join(", ")}

Resume:
${trimmedResume}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "gemma3:1b",
        prompt,
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 220
        }
      }
    );

    let raw = response.data.response;

    console.log("🧠 Ollama Raw (first 250 chars):", raw.substring(0,250));

    /**
     * Remove markdown code blocks
     */
    raw = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");

    if (start !== -1 && end !== -1) {

      let jsonText = raw.substring(start, end + 1);

      jsonText = jsonText
        .replace(/\n/g, " ")
        .replace(/\r/g, "")
        .replace(/,\s*]/g, "]")
        .replace(/,\s*}/g, "}");

      let parsed;

      try {
        parsed = JSON.parse(jsonText);
      } catch (err) {

        console.log("❌ JSON.parse failed:", err.message);
        console.log("Raw JSON text snippet:", jsonText.substring(0,400));

        return fallback(skills);

      }

      let questions = [];

      if (Array.isArray(parsed.questions)) {

        questions = parsed.questions.map(q => {

          if (typeof q === "string") return q;

          if (typeof q === "object") {
            const value = Object.values(q)[0];
            return value;
          }

          return "";
        });

      }

      questions = questions.filter(Boolean).slice(0,7);

      while (questions.length < 7) {

        const skill = skills[questions.length % skills.length] || "this technology";

        questions.push(
          `Explain how ${skill} works in real-world software development.`
        );

      }

      return {
        summary: parsed.summary || "Candidate demonstrates relevant technical knowledge.",
        questions,
        explanation: parsed.explanation || "Candidate shows alignment with modern development roles."
      };

    }

    return fallback(skills);

  } catch (error) {

    console.log("❌ Ollama Error:", error.message);

    return fallback(skills);

  }

};


function fallback(skills = []) {

  return {
    summary:
      "Candidate demonstrates knowledge of modern web development frameworks and programming tools.",
    questions: [
      "Explain the difference between REST and GraphQL.",
      "How does the Node.js event loop work?",
      "What are React hooks?",
      "Explain JWT authentication.",
      "How would you optimize MongoDB queries?",
      "Explain middleware in Express.",
      "How would you secure a REST API?"
    ],
    explanation:
      "Based on detected skills, the candidate aligns with modern web development roles."
  };

}

module.exports = { generateFullAnalysis };