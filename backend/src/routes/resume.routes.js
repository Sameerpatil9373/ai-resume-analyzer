const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const auth = require("../middleware/auth.middleware");

const {
  uploadResume,
  getAllResumes,
  matchResume,
  getResumeSummary,
  getInterviewQuestions,
  getRoleExplanation,
} = require("../controllers/resume.controller");

// Resume Routes (ALL PROTECTED)
router.post("/upload", auth, upload.single("resume"), uploadResume);
router.get("/all", auth, getAllResumes);
router.post("/match", auth, matchResume);
router.get("/summary/:id", auth, getResumeSummary);
router.get("/questions/:id", auth, getInterviewQuestions);
router.get("/explain/:id", auth, getRoleExplanation);

module.exports = router;