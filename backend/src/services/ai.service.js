const { OpenAI } = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Consolidates all AI requests into one call to prevent 500 errors.
 * Dynamically analyzes based on the detected role (Java, Python, MERN, etc.).
 */
const generateFullAnalysis = async (resumeText, role, skills) => {
  try {
    const response = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-nano-30b-a3b:free",
      messages: [
        {
          role: "system",
          content: "You are a professional technical recruiter. Return ONLY a valid JSON object."
        },
        {
          role: "user",
          content: `Analyze this resume for the role of ${role}: ${resumeText}. 
          Detected Skills: ${skills.join(", ")}.
          
          Return JSON with this exact structure: 
          { 
            "summary": "4-5 line professional summary focusing on their top projects and technical strengths.", 
            "questions": ["Q1", "Q2", "Q3", "Q4", "Q5"], 
            "explanation": "4-5 line analysis of suitability for a ${role} position in the Indian tech market." 
          }`
        }
      ],
      response_format: { type: "json_object" } 
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenRouter API Error:", error.message);
    throw new Error("AI analysis failed. Please verify your OpenRouter key.");
  }
};

module.exports = { generateFullAnalysis };