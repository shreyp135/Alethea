import { generateAiResponse } from "src/utils/ai_model.js";
import { buildRAGPrompt } from "./prompt";


export async function generateRAGAnswer(question: string, context: any[]) {
  const prompt = buildRAGPrompt(question, context);

    const response: any = await generateAiResponse(prompt);
    return response;
}
