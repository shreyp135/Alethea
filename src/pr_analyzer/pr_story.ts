import { generateAiResponse } from "../utils/ai_model";

export async function generatePRStory(diff: any,risk:any): Promise<string> {
  const prompt = `
    You are Alethea, an AI code reviewer and outage predictor.

Analyze this Pull Request diff:

${diff}

Detected Risk Tags: ${risk.tags.join(", ") || "None"}
Risk Score: ${risk.score}/100

Write a detailed but concise analysis covering:
- Risky patterns or anti-patterns
- Potential failure scenarios
- Cascading effects on services
- Likely production impact
- Suggestions to make the PR safer
`;
  const story = await generateAiResponse(prompt);
  return story;
}
