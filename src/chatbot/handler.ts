import { generateRAGAnswer } from "./answer.js";
import { retrieveRelevant } from "src/memory/retrieve.js";

export async function chatWithAlethea(question: string) {
  const contextItems = await retrieveRelevant(question);

  const answer = await generateRAGAnswer(question, contextItems);

  return {
    answer,
    contextUsed: contextItems,
  };
}
