import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const llama = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.ML_TOKEN,
});

export async function generateAiResponse(prompt: string): Promise<string> {
    const response = await llama.chat.completions.create({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content?.toString() || "";
}
