export function buildRAGPrompt(question: string, contextItems: any[]) {
  const contextText = contextItems
    .map((c, i) => `[#${i+1} - ${c.type}]\nSummary: ${c.summary}\nText: ${c.text}`)
    .join("\n\n");

  return `
You are Alethea, an SRE intelligence assistant.

Use ONLY the provided context to answer the question.

If the answer is not found, say:
"I don't have enough data in memory to answer that."

Context:
${contextText}

Question:
${question}

Answer clearly and precisely:
  `;
}
