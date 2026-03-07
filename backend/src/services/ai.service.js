const axios = require("axios");

const generateFullAnalysis = async (resumeText, role, skills) => {
  try {
    console.log("🚀 Calling Ollama AI (gemma3:1b)");

    // Increased substring to 1000 to give AI more context while staying efficient
    const trimmedResume = resumeText.substring(0, 1000);

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
- Output ONLY JSON - No preamble, no postamble.

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
          temperature: 0.1, // Lowered for stricter JSON compliance
          num_predict: 800  // Increased from 220 to prevent truncation errors
        }
      }
    );

    let raw = response.data.response;
    console.log("🧠 Ollama Raw Response Received");

    // 1. Better JSON extraction using Regex
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log("❌ No JSON block found in response");
      return fallback(skills);
    }

    let jsonText = jsonMatch[0];

    // 2. Clean up common LLM syntax errors
    jsonText = jsonText
      .replace(/\\n/g, " ")     // Remove escaped newlines
      .replace(/\n/g, " ")      // Remove actual newlines
      .replace(/\r/g, "")       // Remove carriage returns
      .replace(/,\s*]/g, "]")   // Fix trailing commas in arrays
      .replace(/,\s*\}/g, "}"); // Fix trailing commas in objects

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      console.log("❌ JSON.parse failed after cleanup:", err.message);
      return fallback(skills);
    }

    // 3. Normalize and Validate Questions
    let questions = [];
    if (Array.isArray(parsed.questions)) {
      questions = parsed.questions.map(q => {
        if (typeof q === "string") return q;
        if (typeof q === "object" && q !== null) return Object.values(q)[0];
        return "";
      }).filter(Boolean);
    }

    // Ensure exactly 7 questions
    questions = questions.slice(0, 7);
    while (questions.length < 7) {
      const skill = skills[questions.length % skills.length] || "web development";
      questions.push(`Can you explain your experience working with ${skill}?`);
    }

    return {
      summary: parsed.summary || "Candidate demonstrates relevant technical knowledge.",
      questions,
      explanation: parsed.explanation || "Candidate shows alignment with modern development roles."
    };

  } catch (error) {
    console.log("❌ Ollama Connection Error:", error.message);
    return fallback(skills);
  }
};

function fallback(skills = []) {
  return {
    summary: "Candidate demonstrates knowledge of modern web development frameworks and programming tools.",
    questions: [
      "Explain the difference between REST and GraphQL.",
      "How does the Node.js event loop work?",
      "What are React hooks?",
      "Explain JWT authentication.",
      "How would you optimize MongoDB queries?",
      "Explain middleware in Express.",
      "How would you secure a REST API?"
    ],
    explanation: "Based on detected skills, the candidate aligns with modern web development roles."
  };
}

module.exports = { generateFullAnalysis };