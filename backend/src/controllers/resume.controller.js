const path = require("path");
const Resume = require("../models/resume.model");
const parseResume = require("../services/resumeParser.service");

const {
  generateResumeSummary,
  generateInterviewQuestions,
  explainRoleSuitability,
} = require("../services/ai.service");

const {
  analyzeSkills,
  calculateATS,
  predictRole,
  validateResumeStructure,
} = require("../services/skillAnalyzer.service");

const matchResumeWithJD = require("../services/jobMatch.service");

/* ===============================
   UPLOAD & ANALYZE RESUME
================================ */
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Ensure user ID is available from authMiddleware (support multiple payload shapes)
    const userId =
      req.user?.id ??
      req.user?.userId ??
      req.user?._id ??
      req.user?.user?.id;

    if (!req.user || !userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const filePath = path.resolve(req.file.path);
    const extractedText = await parseResume(filePath);

    // Validate if the content is actually a resume
    const isValidResume = validateResumeStructure(extractedText);
    if (!isValidResume) {
      return res.status(400).json({
        message: "Uploaded document does not appear to be a valid resume.",
      });
    }

    const detectedSkills = analyzeSkills(extractedText);
    const atsScore = calculateATS(detectedSkills, extractedText);
    const predictedRole = predictRole(detectedSkills);

    // CHANGE: Added userId to link resume to the logged-in user
    const savedResume = await Resume.create({
      userId,
      fileName: req.file.originalname,
      extractedText,
      skillsDetected: detectedSkills,
      atsScore,
      predictedRole,
    });

    res.status(201).json({
      message: "Resume analyzed and saved successfully",
      data: savedResume,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing resume",
      error: error.message,
    });
  }
};

/* ===============================
   GET ALL RESUMES (USER SPECIFIC)
================================ */
const getAllResumes = async (req, res) => {
  try {
    // CHANGE: Filter by userId so users only see their own history
    const userId =
      req.user?.id ??
      req.user?.userId ??
      req.user?._id ??
      req.user?.user?.id;

    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching resumes",
      error: error.message,
    });
  }
};

/* ===============================
   MATCH RESUME WITH JOB DESCRIPTION
================================ */
const matchResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({
        message: "resumeId and jobDescription are required",
      });
    }

    // CHANGE: Ensure user owns the resume being matched
    const userId =
      req.user?.id ??
      req.user?.userId ??
      req.user?._id ??
      req.user?.user?.id;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or access denied",
      });
    }

    const result = matchResumeWithJD(resume.skillsDetected, jobDescription);

    res.status(200).json({
      message: "Job matching completed",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error matching resume",
      error: error.message,
    });
  }
};

/* ===============================
   AI INSIGHTS (USER SECURED)
================================ */

const getResumeSummary = async (req, res) => {
  try {
    const { id } = req.params;
    // Ensure ownership
    const userId =
      req.user?.id ??
      req.user?.userId ??
      req.user?._id ??
      req.user?.user?.id;

    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const summary = await generateResumeSummary(resume.extractedText);
    res.status(200).json({ message: "AI summary generated", summary });
  } catch (error) {
    res.status(500).json({ message: "Error generating summary", error: error.message });
  }
};

const getInterviewQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const userId =
      req.user?.id ??
      req.user?.userId ??
      req.user?._id ??
      req.user?.user?.id;

    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const questions = await generateInterviewQuestions(resume.skillsDetected);
    res.status(200).json({ message: "AI interview questions generated", questions });
  } catch (error) {
    res.status(500).json({ message: "Error generating questions", error: error.message });
  }
};

const getRoleExplanation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId =
      req.user?.id ??
      req.user?.userId ??
      req.user?._id ??
      req.user?.user?.id;

    const resume = await Resume.findOne({ _id: id, userId });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const explanation = await explainRoleSuitability(resume.skillsDetected, resume.predictedRole);
    res.status(200).json({ message: "AI role explanation generated", explanation });
  } catch (error) {
    res.status(500).json({ message: "Error generating explanation", error: error.message });
  }
};

/* ===============================
   EXPORT
================================ */
module.exports = {
  uploadResume,
  getAllResumes,
  matchResume,
  getResumeSummary,
  getInterviewQuestions,
  getRoleExplanation,
};