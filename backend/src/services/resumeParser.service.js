const fs = require("fs");
const pdfParse = require("pdf-parse-debugging-disabled");
const mammoth = require("mammoth");

const parseResume = async (filePath) => {
  const ext = filePath.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (ext === "docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  throw new Error("Unsupported file format");
};

module.exports = parseResume;