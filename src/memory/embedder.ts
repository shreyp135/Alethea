import dotenv from "dotenv";
import { generateAiResponse } from "src/utils/ai_model";
dotenv.config();

export async function getEmbedding(text: string): Promise<number[]> {
  const prompt = `
You are an embedding generator.
Convert the text below into exactly 32 floating point numbers between -1 and 1.
Output ONLY a JSON array of 32 numbers. No explanation.

Text:
${text}
`;
  const response: any = await generateAiResponse(prompt);
  const raw = response.choices[0].message.content.trim() || "";

  try {
    const vector = JSON.parse(raw);
    if (Array.isArray(vector) && vector.length === 32) {
      return vector;
    }
  } catch (err) {
    console.error("Error parsing embedding response:", err);
  }

  // Fallback: generate random vector (safe fallback)
  console.warn("⚠️ Using fallback random vector (32 dims)");
  return Array.from({ length: 32 }, () => Math.random() * 2 - 1);
}
