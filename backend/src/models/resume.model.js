const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    extractedText: { type: String, required: true },
    skillsDetected: { type: [String], required: true },
    atsScore: { type: Number, required: true },
    predictedRole: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Cache field to store AI results
    aiInsights: {
      summary: String,
      questions: [String],
      explanation: String,
    },
  },
  { timestamps: true }
);

// FIX: Check if the model exists before compiling it
module.exports = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);