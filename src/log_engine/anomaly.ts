import { LogEvent } from "./parser";

export interface Anomaly {
  type: string;
  timestamp: Date;
  message: string;
}

export function detectAnomalies(events: LogEvent[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  let errorCount = 0;
  let lastErrorTime = 0;

  for (const e of events) {
    const ts = e.timestamp.getTime();

    if (e.level === "ERROR") {
      if (ts - lastErrorTime < 4000) {
        errorCount++;
      } else {
        errorCount = 1;
      }
      lastErrorTime = ts;

      if (errorCount >= 3) {
        anomalies.push({
          type: "ERROR_SPIKE",
          timestamp: e.timestamp,
          message: "Multiple errors in short period"
        });
      }
    }

    if (e.message.toLowerCase().includes("retry")) {
      anomalies.push({
        type: "RETRY_LOOP",
        timestamp: e.timestamp,
        message: e.message
      });
    }

    if (e.message.toLowerCase().includes("timeout")) {
      anomalies.push({
        type: "TIMEOUT",
        timestamp: e.timestamp,
        message: e.message
      });
    }
  }

  return anomalies;
}


