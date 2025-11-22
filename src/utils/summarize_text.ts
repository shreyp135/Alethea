import { generateAiResponse } from "./ai_model";

export async function generateSummary(text: string): Promise<string> {
    const prompt = `
Summarize the following text in one short sentence capturing its essential meaning.
Keep it under 20 words.

Text:
${text}
`;
    const response: any = await generateAiResponse(prompt);
    return response.choices[0].message.content.trim() || "";
}