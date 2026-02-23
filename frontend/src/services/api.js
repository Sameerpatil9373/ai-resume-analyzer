import axios from "axios";

const API_URL = "http://localhost:5000/api/resume";

// Helper to get the auth config with token
const getAuthConfig = (isFormData = false) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const headers = {
    Authorization: `Bearer ${user?.token}`,
  };
  
  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  }
  
  return { headers };
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  // Added auth config with token and multipart header
  const response = await axios.post(
    `${API_URL}/upload`, 
    formData, 
    getAuthConfig(true)
  );
  return response.data;
};

export const getResumeInsights = async (id) => {
  const authConfig = getAuthConfig();

  // Added auth config to each GET request
  const [summary, questions, explanation] = await Promise.all([
    axios.get(`${API_URL}/summary/${id}`, authConfig),
    axios.get(`${API_URL}/questions/${id}`, authConfig),
    axios.get(`${API_URL}/explain/${id}`, authConfig),
  ]);

  return {
    summary: summary.data.summary,
    questions: questions.data.questions,
    explanation: explanation.data.explanation,
  };
};