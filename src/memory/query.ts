import { memoryClient } from "./mongodb";
import { getEmbedding } from "./embedder";

export async function findSimilar(text: string, limit = 5): Promise<any[]> {
  const embedding = await getEmbedding(text);

  const response = await memoryClient.aggregate([
    {
      $vectorSearch: {
        index: "default",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 50,
        limit,
      },
    },
  ]);

  return response.toArray();
}
