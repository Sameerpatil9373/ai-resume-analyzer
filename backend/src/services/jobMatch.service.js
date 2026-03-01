const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini with your existing environment key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeJobMatch = async (resumeText, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // The prompt is now dynamic and works for Python, Java, MERN, etc.
    const prompt = `
      You are an expert ATS (Applicant Tracking System). 
      Analyze the compatibility between the following Resume and Job Description.
      
      Resume: ${resumeText}
      Job Description: ${jobDescription}

      Instructions:
      1. Identify technical skills, tools, and experience levels.
      2. A Python Developer should be matched against Python libraries (Django, Flask, Pandas).
      3. A MERN developer should be matched against Web technologies.
      4. Calculate a matchScore (0-100) based on how well the candidate fits the requirements.

      Return ONLY a JSON object with this exact structure:
      {
        "matchScore": number,
        "matchingSkills": ["list", "of", "found", "skills"],
        "missingSkills": ["list", "of", "required", "but", "missing", "skills"],
        "explanation": "Short 2-line explanation of the fit"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Safety check: Extract JSON from AI text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI Response");

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("AI Matching Error:", error.message);
    // Fallback if API fails so the UI doesn't crash
    return {
      matchScore: 0,
      matchingSkills: [],
      missingSkills: [],
      explanation: "AI analysis currently unavailable. Check API Key."
    };
  }
};

module.exports = { analyzeJobMatch };