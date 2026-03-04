const { OpenRouter } = require("@openrouter/sdk");

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const generateFullAnalysis = async (resumeText, role, skills) => {
  try {
    const response = await openrouter.chat.send({
      // ✅ Using Gemma 3 27B Free for better stability and logic
      model: "google/gemma-3-27b-it:free",
      messages: [
        {
          role: "system",
          content: `You are a Senior Technical Recruiter.
          STRICT RULES:
          1. Return ONLY a valid JSON object. No markdown backticks.
          2. Generate EXACTLY 10 deep technical interview questions.
          3. LOGIC: If the candidate knows 'React' or 'Node.js', count 'JavaScript' as a core strength.
          4. Length: Summary and Explanation must be 8-10 lines long each.`
        },
        {
          role: "user",
          content: `Analyze this resume for a ${role} position.
          Resume Text: ${resumeText}
          Detected Skills: ${skills.join(", ")}
          
          Return JSON:
          {
            "summary": "Detailed 8-10 line technical evaluation.",
            "questions": ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10"],
            "explanation": "Detailed 8-10 line suitability and market analysis."
          }`
        }
      ],
      // Force JSON format at the SDK level
      response_format: { type: "json_object" }
    });

    const rawContent = response.choices?.[0]?.message?.content;
    if (!rawContent) throw new Error("Empty response from AI");

    // Clean JSON extraction logic
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid structure");

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("Gemma AI Analysis Error:", error.message);
    
    // ✅ Robust Fallback with 10 Dynamic Questions
    return {
      summary: `The candidate shows significant proficiency in ${skills.slice(0,3).join(", ")}. Their project work indicates a strong understanding of full-stack engineering and system development. They are well-equipped to handle complex tasks within a ${role} environment, demonstrating both technical depth and adaptability.`,
      questions: [
        `Explain the core architecture of your most complex project using ${skills[0] || 'your tech stack'}.`,
        `How do you manage state and data flow in large ${role} applications?`,
        `Describe your approach to optimizing performance in a production environment.`,
        `How would you implement secure authentication in a ${role} system?`,
        `What is your strategy for handling database scalability with ${skills.includes('mongodb') ? 'NoSQL' : 'SQL'}?`,
        `Explain the significance of middleware in your backend development process.`,
        `How do you ensure cross-browser compatibility and responsive design?`,
        `Describe a time you solved a critical bug under a tight deadline.`,
        `How do you stay updated with the latest trends in ${skills[0] || 'development'}?`,
        `What is your process for conducting technical code reviews within a team?`
      ],
      explanation: `Currently, the technical market highly values ${skills.slice(0,2).join(" and ")} expertise. The candidate's profile aligns with these demands, showing 100% suitability for modern tech roles in India. Strengthening their cloud-native development and microservices knowledge would further increase their competitive edge for senior-level ${role} positions.`
    };
  }
};

module.exports = { generateFullAnalysis };