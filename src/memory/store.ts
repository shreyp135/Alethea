import { memoryClient } from "./mongodb";
import { getEmbedding } from "./embedder";
import { v4 as uuid } from "uuid";
import { generateSummary } from "src/utils/summarize_text";

export async function storeMemory(
  type: string,
  text: string,
  metadata = {}
): Promise<string> {
  const summary = await generateSummary(text);
  const embedding = await getEmbedding(summary);

  await memoryClient.insertOne({
    _id: uuid(),
    type:type,
    text,
    summary,
    embedding,
    metadata,
    createdAt: new Date(),
  });

  return "Memory stored successfully";
}

export const storeLog = (log: any, meta = {}) => storeMemory("log", log, meta);
export const storePR = (diff: any, meta = {}) => storeMemory("pr", diff, meta);
export const storeIncident = (story: any, meta = {}) =>
  storeMemory("incident", story, meta);
