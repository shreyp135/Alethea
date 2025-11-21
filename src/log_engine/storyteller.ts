import { LogEvent } from "./parser";
import { Anomaly } from "./anomaly";
import { generateAiResponse } from "../utils/ai_model";

export async function generateStory(
  events: LogEvent[],
  anomalies: Anomaly[]
): Promise<string> {
  const prompt = `
You are Alethea, an incident forensics AI.

Given the following log events and detected anomalies, generate a clear and technical incident report.

Events:
${events
  .map(
    e => `${e.timestamp.toISOString()} ${e.level} [${e.service}] ${e.message}`
  )
  .join("\n")}

Anomalies:
${anomalies
  .map(a => `${a.type} @ ${a.timestamp.toISOString()} → ${a.message}`)
  .join("\n")}

Explain:
1. What likely happened?
2. What triggered the failure?
3. What was the escalation chain?
4. What is the root cause?
5. How to fix or mitigate it?
`;
console.log(anomalies,events);
    const story = await generateAiResponse(prompt);
    return story;
}
