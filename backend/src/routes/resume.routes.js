const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const auth = require("../middleware/auth.middleware");
const { uploadResume, getAllResumes, matchResume, getResumeInsights } = require("../controllers/resume.controller");

router.post("/upload", auth, upload.single("resume"), uploadResume);
router.get("/all", auth, getAllResumes);
router.post("/match", auth, matchResume);
router.get("/insights/:id", auth, getResumeInsights); // Consolidated endpoint

module.exports = router;