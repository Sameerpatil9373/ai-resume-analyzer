const { OpenRouter } = require("@openrouter/sdk");

// ✅ Using the new OpenRouter SDK
const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const generateFullAnalysis = async (resumeText, role, skills) => {
  try {
    // ✅ Using Trinity-Large for deep reasoning
    const response = await openrouter.chat.send({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "system",
          content: `You are an advanced technical recruiter with deep reasoning capabilities. 
          Your goal is to perform a semantic analysis. 
          CRITICAL: Always return ONLY a valid JSON object. 
          LOGIC RULE: If a user knows 'React', 'Node.js', or any JS framework, they implicitly know 'JavaScript'. Do not mark it as missing.`
        },
        {
          role: "user",
          content: `Perform a semantic analysis for a ${role} position. 
          Identify latent technical strengths and project complexity beyond keywords.
          Resume Text: ${resumeText}. 
          Detected Skills: ${skills.join(", ")}.
          
          Return exactly this JSON structure: 
          { 
            "summary": "Deep insight into engineering capabilities (4-5 lines).", 
            "questions": ["Q1", "Q2", "Q3", "Q4", "Q5"], 
            "explanation": "Suitability analysis for the tech market (4-5 lines)." 
          }`
        }
      ]
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) throw new Error("Empty response from AI model");

    // Robust parsing for reasoning models
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI JSON structure");
    
    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Log internal reasoning tokens
    if (response.usage?.reasoning_tokens) {
        console.log(`AI Insights Reasoning: ${response.usage.reasoning_tokens} tokens.`);
    }

    return parsedData;

  } catch (error) {
    console.error("OpenRouter SDK Analysis Error:", error.message);
    // Robust fallback for Rate Limits
    return {
      summary: "The reasoning engine is currently busy. Your profile shows strong technical alignment.",
      questions: [
        "How would you optimize your MERN stack application for scale?",
        "Explain the logic behind your micro-investment app's calculation engine.",
        "How do you handle state management in complex React projects?"
      ],
      explanation: "Analysis is limited due to high traffic. Your skills match industry standards."
    };
  }
};

module.exports = { generateFullAnalysis };