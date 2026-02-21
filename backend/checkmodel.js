require("dotenv").config();
const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
    );

    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

listModels();