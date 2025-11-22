import { LogEvent } from "../log_engine/parser";

export function groupEvents(events: LogEvent[]): LogEvent[][] {
  const incidents: LogEvent[][] = [];
  let current: LogEvent[] = [];

  const TIME_GAP_MS = 30_000; // 30 sec

  for (let i = 0; i < events.length; i++) {
    const evt = events[i];

    if (i === 0) {
      current.push(evt);
      continue;
    }

    const prev = events[i - 1];
    const gap = evt.timestamp.getTime() - prev.timestamp.getTime();

    if (gap > TIME_GAP_MS) {
      incidents.push(current);
      current = [];
    }

    current.push(evt);
  }

  if (current.length > 0) incidents.push(current);

  return incidents;
}
