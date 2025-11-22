// tests/test_phase4.ts
import dotenv from "dotenv";
dotenv.config();

// --- IMPORT YOUR MODULES ---
import { connectToMongo } from "../src/memory/mongodb";
import { generateSummary } from "../src/utils/summarize_text";
import { getEmbedding } from "../src/memory/embedder";
import { ingestLogs } from "../src/memory/ingest_logs";
import { chatWithAlethea } from "../src/chatbot/handler";
import { correlateAndStore } from "../src/incidents/correlate";

// --- SAMPLE LOGS ---
const sampleLogs = `
2025-01-12T10:14:01Z ERROR [auth] DBConnPool exhausted
2025-01-12T10:14:02Z ERROR [auth] DBConnPool exhausted
2025-01-12T10:14:03Z WARN  [api] retrying operation
2025-01-12T10:14:05Z ERROR [api] timeout on /login
2025-01-12T10:14:09Z ERROR [api] retry storm detected
`;

async function run() {
  console.log("Initializing MongoDB...");
  await connectToMongo();

  // -------------------------------
  // 1. SUMMARY TEST
  // -------------------------------
  console.log("\n Testing summarization...");
  const sum = await generateSummary("Database connection pool exhausted in auth service");
  console.log("Summary:", sum);

  // -------------------------------
  // 2. EMBEDDING TEST
  // -------------------------------
  console.log("\n Testing pseudo embedding...");
  const embed = await getEmbedding("auth db connection failure");
  console.log("Embedding length:", embed.length);
  console.log("Embedding sample:", embed.slice(0, 5));

  // -------------------------------
  // 3. LOG INGEST TEST
  // -------------------------------
  console.log("\n Testing log ingestion...");
  const ingested = await ingestLogs(sampleLogs);
  console.log("Parsed events:", ingested);

  // -------------------------------
  // 4. INCIDENT CORRELATION TEST
  // -------------------------------
  console.log("\n Testing incident correlation...");
  const incidents = await correlateAndStore(ingested.events);
  console.log("Detected incidents:", incidents.length);
  console.log("First incident summary:", incidents[0].summary);

  // -------------------------------
  // 5. CHATBOT / RAG TEST
  // -------------------------------
  console.log("\n Testing RAG chatbot...");
  const chat = await chatWithAlethea("Why did the API fail?");
  console.log("Chatbot answer:\n", chat.answer);

  console.log("\n ALL PHASE 4 TESTS COMPLETED SUCCESSFULLY");
}

run().catch(err => {
  console.error(" Test failed:", err);
});
