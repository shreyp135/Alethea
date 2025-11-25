import express from "express";
import {parseLogFiles} from "../../src/log_engine/parser";
import {detectAnomalies} from "../../src/log_engine/anomaly";
import {correlateAndStore} from "../../src/incidents/correlate";
import {storeLog} from "../../src/memory/store";
import {memoryClient} from "../../src/utils/mongodb";


const router = express.Router();


router.post("/ingest", async (req, res) => {
  const { logs } = req.body;

  const events = parseLogFiles(logs);
  const anomalies = detectAnomalies(events);

  for (const e of events)
    await storeLog(e.message, { timestamp: e.timestamp });

  const incidents = await correlateAndStore(events);

  res.json({ events, anomalies, incidents });
});


router.get("/", async (req, res) => {
  const logs = await memoryClient.find({ type: "log" }).sort({ createdAt: -1 }).toArray();
  res.json(logs);
});

export default router;