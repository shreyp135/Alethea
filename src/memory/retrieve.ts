import { findSimilar } from "./query";

export async function retrieveRelevant(question: string): Promise<any[]> {
    const similarMemories = await findSimilar(question, 5);

    return similarMemories.map(r => ({
    type: r.type,
    summary: r.summary,
    text: r.text,
    metadata: r.metadata,
  }));
}
