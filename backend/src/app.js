const express = require("express");
const cors = require("cors");
const resumeRoutes = require("./routes/resume.routes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Test Route
app.get("/", (req, res) => {
  res.send("AI Resume Analyzer Backend Running...");
});
app.use("/api/resume", resumeRoutes);

module.exports = app;