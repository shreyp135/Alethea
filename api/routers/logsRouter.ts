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
  // const story = "**Incident Report: Database Connection Pool Exhaustion and Retry Storm** **Summary:** On 2025-01-12T10:14:01.000Z, a series of errors occurred due to the exhaustion of the database connection pool, leading to a retry storm and multiple service failures. This report analyzes the events and anomalies to determine the likely cause, escalation chain, and root cause, and provides recommendations for mitigation and resolution. **1. What likely happened?** The database connection pool (DBConnPool) became exhausted, causing errors in the authentication (auth) and API services. As a result, the system attempted to retry operations, leading to a retry storm and further exacerbating the issue. This, in turn, caused multiple services to fail, including auth and API, resulting in timeouts and errors. **2. What triggered the failure?** The initial trigger for the failure was the exhaustion of the DBConnPool, which occurred at 2025-01-12T10:14:01.000Z. This was likely caused by an unexpected increase in traffic or a prolonged database query, leading to a depletion of available connections. **3. What was the escalation chain?** The escalation chain can be summarized as follows: 1. DBConnPool exhaustion (2025-01-12T10:14:01.000Z) 2. Auth service errors (2025-01-12T10:14:01.000Z and 2025-01-12T10:14:02.000Z) 3. API service retrying operations (2025-01-12T10:14:03.000Z) 4. Retry storm detection (2025-01-12T10:14:09.000Z) 5. Multiple service failures (auth, API) and timeouts (2025-01-12T10:14:05.000Z and 2025-01-12T10:14:09.000Z) **4. What is the root cause?** The root cause of the incident is likely a combination of factors, including: * Insufficient database connection pool sizing * Inefficient database queries or transactions * Inadequate retry mechanisms and exponential backoff strategies * Lack of monitoring and alerting for DBConnPool utilization and retry storms **5. How to fix or mitigate it?** To prevent similar incidents in the future, the following recommendations are made: 1. **Increase DBConnPool size**: Review and adjust the database connection pool size to accommodate expected traffic and query loads. 2. **Optimize database queries**: Analyze and optimize database queries to reduce execution time and minimize the load on the database. 3. **Implement efficient retry mechanisms**: Develop and implement retry mechanisms with exponential backoff strategies to prevent retry storms. 4. **Monitor and alert on DBConnPool utilization**: Set up monitoring and alerting for DBConnPool utilization, retry storms, and other key metrics to detect potential issues before they escalate. 5. **Conduct regular capacity planning and testing**: Regularly review and test the system's capacity to handle expected and unexpected traffic loads, and adjust resources accordingly. By addressing these areas, the likelihood and impact of similar incidents can be reduced, and the overall resilience and reliability of the system can be improved.";
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