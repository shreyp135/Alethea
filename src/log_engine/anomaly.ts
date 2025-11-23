import { LogEvent } from "./parser";

export interface Anomaly {
  type: string;
  timestamp: Date | null;
  message: string;
}

export function detectAnomalies(events: LogEvent[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  let errorCount = 0;
  let lastErrorTime = 0;

  const messageFrequency: Record<string, number> = {};
  const servicesSeen = new Set<string>();

  let previousTimestamp: number | null = null;

  for (const e of events) {
    const ts = e.timestamp?.getTime() ?? null;
    const msg = e.message.toLowerCase();

    // 1. ERROR Spike
    if (e.level === "ERROR") {
      if (previousTimestamp !== null && ts !== null && ts - previousTimestamp < 4000) {
        errorCount++;
      } else {
        errorCount = 1;
      }
      previousTimestamp = ts ?? previousTimestamp;

      if (errorCount >= 3) {
        anomalies.push({
          type: "ERROR_SPIKE",
          timestamp: e.timestamp,
          message: "Multiple errors in a short period"
        });
      }
    }

    // 2. Retry Loop Detection
    if (/retry|attempt|backoff/i.test(msg)) {
      anomalies.push({
        type: "RETRY_LOOP",
        timestamp: e.timestamp,
        message: e.message
      });
    }

    // 3. Timeout Detection
    if (/timeout|timed out|504|gateway/i.test(msg)) {
      anomalies.push({
        type: "TIMEOUT",
        timestamp: e.timestamp,
        message: e.message
      });
    }

    // 4. Resource Exhaustion
    if (/exhaust|oom|memory|pool|limit/i.test(msg)) {
      anomalies.push({
        type: "RESOURCE_EXHAUSTION",
        timestamp: e.timestamp,
        message: e.message
      });
    }

    // 5. Repeated Message
    messageFrequency[e.message] = (messageFrequency[e.message] || 0) + 1;
    if (messageFrequency[e.message] === 3) {
      anomalies.push({
        type: "REPETITIVE_ERROR",
        timestamp: e.timestamp,
        message: `Message repeated 3 times: "${e.message}"`
      });
    }

    // 6. Multi-Service Failure
    if (e.service) {
      servicesSeen.add(e.service);
      if (servicesSeen.size >= 2) {
        anomalies.push({
          type: "CASCADE",
          timestamp: e.timestamp,
          message: `Multiple services failing: ${Array.from(servicesSeen).join(", ")}`
        });
      }
    }

    // 7. Timestamp Gap Detection
    if (ts !== null && previousTimestamp !== null) {
      const gap = ts - previousTimestamp;
      if (gap > 30000) {
        anomalies.push({
          type: "TIMESTAMP_GAP",
          timestamp: e.timestamp,
          message: `Unusual gap between logs: ${Math.round(gap / 1000)} seconds`
        });
      }
    }

    previousTimestamp = ts;
  }

  return anomalies;
}
