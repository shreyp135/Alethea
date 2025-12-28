import express from "express";
import {parseLogFiles} from "../../src/log_engine/parser";
import {detectAnomalies} from "../../src/log_engine/anomaly";
// import {correlateAndStore} from "../../src/incidents/correlate";
// import {storeLog} from "../../src/memory/store";
import {memoryClient} from "../../src/utils/mongodb";
import {generateStory} from "../../src/log_engine/storyteller";
import { redisClient } from "../../src/utils/redis";
import crypto from "crypto";


const router = express.Router();


router.post("/ingest", async (req, res) => {
  console.log("Received logs for ingestion:", req.body);
  const { logs } = req.body;
  if (!logs || typeof logs !== "string") {
    return res.status(400).json({ error: "logs is required" });
  }
  try {
    const hash = crypto.createHash('sha256').update(logs).digest('hex');
    
    const cacheKey = `logs:${hash}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("Returning cached log ingestion result");
      return res.json(JSON.parse(cached));
    }
  
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

  const response = { events, anomalies, story };
  await redisClient.set(cacheKey, JSON.stringify(response), { EX: 600 });

  res.json(response);

  } catch (error) {
    console.error("Error during log ingestion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/", async (req, res) => {
  const logs = await memoryClient.find({ type: "log" }).sort({ createdAt: -1 }).toArray();
  res.json(logs);
});

export default router;