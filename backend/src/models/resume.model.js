const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    skillsDetected: {
      type: [String],
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
    },
    predictedRole: {
      type: String,
      required: true,
    },
    // Add this field to your existing schema
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
},
  },
  { timestamps: true }

);

module.exports = mongoose.model("Resume", resumeSchema);