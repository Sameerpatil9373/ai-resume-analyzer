const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  uploadResume,
  getAllResumes,
  matchResume,
  getResumeSummary,
  getInterviewQuestions,
  getRoleExplanation,
} = require("../controllers/resume.controller");

// Resume Routes Only
router.post("/upload", upload.single("resume"), uploadResume);
router.get("/all", getAllResumes);
router.post("/match", matchResume);
router.get("/summary/:id", getResumeSummary);
router.get("/questions/:id", getInterviewQuestions);
router.get("/explain/:id", getRoleExplanation);

module.exports = router;