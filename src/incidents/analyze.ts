import { LogEvent } from "../log_engine/parser";

export function analyzeIncident(events: LogEvent[]) {
  const services = new Set<string>();
  const timeline: string[] = [];
  let rootCause = "unknown";

  for (const evt of events) {
    if (evt.service) services.add(evt.service);

    const tl = `${evt.timestamp.toISOString()} - ${evt.level} [${evt.service}] ${evt.message}`;
    timeline.push(tl);

    if (evt.level === "ERROR" && rootCause === "unknown") {
      rootCause = `${evt.service}: ${evt.message}`;
    }
  }

  return {
    services: Array.from(services),
    timeline,
    rootCause,
  };
}
