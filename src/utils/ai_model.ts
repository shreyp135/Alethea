import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const llama = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
    "HTTP-Referer": process.env.FRONTEND_URL,
    "X-Title": "Alethea",
  },

});

export async function generateAiResponse(prompt: string): Promise<string> {
    const response = await llama.chat.completions.create({
        model: "google/gemma-4-31b-it:free",
        messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content?.toString() || "";
}
