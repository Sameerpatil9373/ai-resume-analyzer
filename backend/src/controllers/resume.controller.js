const path = require("path");
const Resume = require("../models/resume.model");
const parseResume = require("../services/resumeParser.service");
const { generateFullAnalysis } = require("../services/ai.service");
const { analyzeSkills, calculateATS, predictRole, validateResumeStructure } = require("../services/skillAnalyzer.service");
const { analyzeJobMatch } = require("../services/jobMatch.service");

const getUserId = (req) => req.user?.id ?? req.user?.userId ?? req.user?._id ?? req.user?.user?.id;

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const userId = getUserId(req);
    const filePath = path.resolve(req.file.path);
    const extractedText = await parseResume(filePath);

    if (!validateResumeStructure(extractedText)) {
      return res.status(400).json({ message: "Invalid resume format." });
    }

    const detectedSkills = analyzeSkills(extractedText);
    const savedResume = await Resume.create({
      userId,
      fileName: req.file.originalname,
      extractedText,
      skillsDetected: detectedSkills,
      atsScore: calculateATS(detectedSkills, extractedText),
      predictedRole: predictRole(detectedSkills),
    });

    res.status(201).json({ data: savedResume });
  } catch (error) {
    res.status(500).json({ message: "Error processing resume", error: error.message });
  }
};

const getResumeInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const resume = await Resume.findOne({ _id: id, userId });
    
    if (!resume) return res.status(404).json({ message: "Resume not found" });

    // FIX: If insights already exist in DB, return them immediately (0.1s instead of 30s)
    if (resume.aiInsights && resume.aiInsights.summary) {
      return res.status(200).json(resume.aiInsights);
    }

    // Call AI only if we don't have cached data
    const insights = await generateFullAnalysis(resume.extractedText, resume.predictedRole, resume.skillsDetected);
    
    // Save the insights to the database for future instant access
    resume.aiInsights = insights;
    await resume.save();

    res.status(200).json(insights);
  } catch (error) {
    res.status(500).json({ message: "AI Analysis failed", error: error.message });
  }
};

const getAllResumes = async (req, res) => {
  try {
    const userId = getUserId(req);
    // This will now include the aiInsights in the list for the Dashboard to use
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ data: resumes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const matchResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    const userId = getUserId(req);
    const resume = await Resume.findOne({ _id: resumeId, userId });
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    const result = await analyzeJobMatch(resume.extractedText, jobDescription);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadResume, getAllResumes, matchResume, getResumeInsights };