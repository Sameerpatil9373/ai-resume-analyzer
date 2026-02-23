const express = require("express");
const cors = require("cors");

const resumeRoutes = require("./routes/resume.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("AI Resume Analyzer Backend Running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

app.use((err, req, res, next) => {
  console.error("🔥 FULL ERROR:", err);
  res.status(500).json({ error: err.message });
});

module.exports = app;