const path = require("path");
const Resume = require("../models/resume.model");

const parseResume = require("../services/resumeParser.service");
const { generateFullAnalysis } = require("../services/ai.service");

const {
  analyzeSkillsAI,
  calculateATS,
  predictRole
} = require("../services/skillAnalyzer.service");

const { analyzeJobMatch } = require("../services/jobMatch.service");

const getUserId = (req) =>
  req.user?.id ?? req.user?.userId ?? req.user?._id;


/**
 * Upload Resume
 */
exports.uploadResume = async (req, res) => {
  try {

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const userId = getUserId(req);

    const filePath = path.resolve(req.file.path);

    const extractedText = await parseResume(filePath);

    console.log("📄 Resume parsed");


    /**
     * Resume Validation
     */
    const resumeKeywords = [
      "education",
      "experience",
      "skills",
      "projects",
      "certifications",
      "internship",
      "contact",
      "linkedin"
    ];

    const textLower = extractedText.toLowerCase();

    const matchedKeywords = resumeKeywords.filter(keyword =>
      textLower.includes(keyword)
    );

    if (matchedKeywords.length < 2) {
      return res.status(400).json({
        message: "Uploaded file does not appear to be a resume."
      });
    }


    /**
     * AI Skill Detection
     */
    const detectedSkills = await analyzeSkillsAI(extractedText);

    console.log("🧠 Detected Skills:", detectedSkills);


    /**
     * Save Resume
     */
    const savedResume = await Resume.create({
      userId,
      fileName: req.file.originalname,
      extractedText,
      skillsDetected: detectedSkills,
      atsScore: calculateATS(detectedSkills, extractedText),
      predictedRole: predictRole(detectedSkills),
      aiInsights: null
    });


    /**
     * Send response immediately (fast UX)
     */
    res.status(201).json({
      data: savedResume,
      message: "Resume uploaded. AI analysis running..."
    });


    /**
     * Background AI Analysis
     */
    setTimeout(async () => {

      try {

        console.log("🚀 Starting background AI analysis...");

        const insights = await generateFullAnalysis(
          extractedText,
          savedResume.predictedRole,
          detectedSkills
        );

        await Resume.findByIdAndUpdate(
          savedResume._id,
          { aiInsights: insights }
        );

        console.log("✅ Background AI insights saved");

      } catch (error) {

        console.log("❌ Background AI generation failed:", error.message);

      }

    }, 2000);

  } catch (error) {

    console.log("❌ Resume upload error:", error.message);

    res.status(500).json({
      message: "Resume upload failed",
      error: error.message
    });

  }
};


/**
 * Get All Resumes
 */
exports.getAllResumes = async (req, res) => {
  try {

    const userId = getUserId(req);

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: resumes });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }
};


/**
 * AI Insights
 */
exports.getResumeInsights = async (req, res) => {

  try {

    const { id } = req.params;

    const refresh = req.query.refresh === "true";

    const userId = getUserId(req);

    console.log("📊 AI Insights Requested");
    console.log("Resume ID:", id);

    const resume = await Resume.findOne({
      _id: id,
      userId
    });

    if (!resume)
      return res.status(404).json({ message: "Resume not found" });


    /**
     * If AI still running
     */
    if (!resume.aiInsights && !refresh) {

      return res.status(200).json({
        summary: "",
        questions: [],
        explanation: "",
        processing: true
      });

    }


    /**
     * Return cached insights
     */
    if (resume.aiInsights && !refresh) {

      console.log("⚡ Returning cached AI insights");

      return res.status(200).json(resume.aiInsights);

    }


    /**
     * Force refresh
     */
    console.log("🚀 Regenerating AI insights");

    const insights = await generateFullAnalysis(
      resume.extractedText,
      resume.predictedRole,
      resume.skillsDetected
    );

    resume.aiInsights = insights;

    await resume.save();

    res.status(200).json(insights);

  } catch (error) {

    console.log("❌ AI Insights Error:", error.message);

    res.status(500).json({
      message: "AI analysis failed",
      error: error.message
    });

  }

};


/**
 * Market Job Matching
 */
exports.matchResume = async (req, res) => {
  try {

    const { resumeId } = req.body;

    const userId = getUserId(req);

    const resume = await Resume.findOne({
      _id: resumeId,
      userId
    });

    if (!resume)
      return res.status(404).json({ message: "Resume not found" });

    console.log("📄 Resume Skills:", resume.skillsDetected);

    const results = await analyzeJobMatch(
      resume.extractedText,
      resume.skillsDetected
    );

    console.log("🎯 Job Match Results:", results);

    res.status(200).json(results);

  } catch (error) {

    console.log("❌ Job Matching Error:", error.message);

    res.status(500).json({ error: error.message });

  }
};