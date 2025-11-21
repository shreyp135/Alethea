import { LogEvent } from "./parser";
import { Anomaly } from "./anomaly";

export type TimelineEntry = LogEvent | Anomaly;

export function buildTimeline(
  events: LogEvent[],
  anomalies: Anomaly[]
): TimelineEntry[] {
  return [...events, ...anomalies].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );
}
