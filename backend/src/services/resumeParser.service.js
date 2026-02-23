const fs = require("fs");
const pdfParse = require("pdf-parse-debugging-disabled");
const mammoth = require("mammoth");

const parseResume = async (filePath) => {
  // Check if file exists on disk
  if (!fs.existsSync(filePath)) {
    throw new Error("File not found on server storage.");
  }

  const ext = filePath.split(".").pop().toLowerCase();
  const dataBuffer = fs.readFileSync(filePath);

  // Critical check for empty file content
  if (dataBuffer.length === 0) {
    throw new Error("The uploaded file is empty.");
  }

  if (ext === "pdf") {
    try {
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (err) {
      throw new Error("Failed to parse PDF: " + err.message);
    }
  }

  if (ext === "docx") {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (err) {
      throw new Error("Failed to parse DOCX: " + err.message);
    }
  }

  throw new Error("Unsupported file format. Please upload PDF or DOCX.");
};

module.exports = parseResume;