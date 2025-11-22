import { generateAiResponse } from "src/utils/ai_model";

export async function generateIncidentStoryline(analysis: any): Promise<string> {
    const prompt = `You are Alethea, an SRE intelligence assistant.

Generate a clear, concise incident report based on the following:

Root Cause:
${analysis.rootCause}

Services involved:
${analysis.services.join(", ")}

Timeline:
${analysis.timeline.join("\n")}

Write the story as:
- What failed
- Why it failed
- How it propagated
- Final impact
`;
    const response: any = await generateAiResponse(prompt);
    return response;
}
