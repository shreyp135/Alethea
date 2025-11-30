import { generateRAGAnswer } from "./answer.js";
import { retrieveRelevant } from "src/memory/retrieve.js";
import { generateAiResponse } from "src/utils/ai_model.js";

export async function chatWithAlethea(question: string) {
  // const contextItems = await retrieveRelevant(question);
  // const answer = await generateRAGAnswer(question, contextItems);

  // to use RAG, uncomment the above lines and comment out the below lines.
  const prompt = `You are Alethea AI Assistant, a helpful, knowledgeable AI that answers questions clearly, concisely, and accurately without requiring any external documents or RAG systems.
                  Use the following question to provide an accurate answer.
                  Question:
                  ${question}

                  Answer to the point and clearly only in paragraphs
      `;


  const answer: any = await generateAiResponse(prompt);

  return {
    answer,
    // contextUsed: contextItems,
  };
      }
