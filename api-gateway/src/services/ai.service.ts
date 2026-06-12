import axios from "axios";

const AI_URL =
  process.env.AI_SERVICE_URL ||
  "http://localhost:8000";

export const askAI = async (
  question: string
) => {
  const response =
    await axios.post(
      `${AI_URL}/ask`,
      { question }
    );

  return response.data;
};