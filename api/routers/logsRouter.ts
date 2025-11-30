import express from "express";
import {parseLogFiles} from "../../src/log_engine/parser";
import {detectAnomalies} from "../../src/log_engine/anomaly";
// import {correlateAndStore} from "../../src/incidents/correlate";
// import {storeLog} from "../../src/memory/store";
import {memoryClient} from "../../src/utils/mongodb";
import {generateStory} from "../../src/log_engine/storyteller";


const router = express.Router();


router.post("/ingest", async (req, res) => {
  console.log("Received logs for ingestion:", req.body);
  const { logs } = req.body;

  const events = await parseLogFiles(logs);
  console.log("Parsed events:", events);
  const anomalies = await detectAnomalies(events);
  console.log("Detected anomalies:", anomalies);
  const story = await generateStory(events,anomalies);
  console.log("Generated story:", story);

  // for (const e of events)
  //   await storeLog(e.message, { timestamp: e.timestamp });

  // const incidents = await correlateAndStore(events);
  // console.log("Ingestion complete. Events, anomalies, incidents, and story generated.");

  res.json({ events, anomalies, story });
});


router.get("/", async (req, res) => {
  const logs = await memoryClient.find({ type: "log" }).sort({ createdAt: -1 }).toArray();
  res.json(logs);
});

export default router;