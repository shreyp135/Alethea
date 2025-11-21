import fs from "fs";
import { parseLogFiles } from "../src/log_engine/parser";
import { detectAnomalies } from "../src/log_engine/anomaly";
import { buildTimeline } from "../src/log_engine/timeline";
import { generateStory } from "../src/log_engine/storyteller";

async function runDemo() {
  const raw = fs.readFileSync("C:\\Users\\Shrey\\Documents\\Vsc projects\\Alethea\\docs\\example_logs\\sample1.log", "utf-8");

  const events = parseLogFiles(raw);
  const anomalies = detectAnomalies(events);
  const timeline = buildTimeline(events, anomalies);

  console.log("\n==== Parsed Events ====");
  console.log(events);

  console.log("\n==== Detected Anomalies ====");
  console.log(anomalies);

  console.log("\n==== Generating Story ====\n");
  const story = await generateStory(events, anomalies);

  console.log(story);
}

runDemo();
