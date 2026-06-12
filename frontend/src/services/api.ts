import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function askAI(question: string) {
  const response = await axios.post(
    `${API_URL}/ask`,
    {
      question,
    }
  );

  return response.data;
}

export async function streamAI(question: string) {
  return fetch(`${API_URL}/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
    }),
  });
}