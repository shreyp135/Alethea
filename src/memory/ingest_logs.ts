import { raw } from "body-parser";
import { parseLogLine } from "src/log_engine/parser";
import { storeLog } from "src/memory/store";

export async function ingestLogs(rawLogs: string) {
  const lines = rawLogs
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const events = [];

    for (const line of lines) {
      const evt = parseLogLine(line);
      if (!evt) continue;

      const cleanText = `${evt.level} [${evt.service}] ${evt.message}`;

      await storeLog(cleanText, {
        timestamp: evt.timestamp,
        service: evt.service,
        level: evt.level,
      });

      events.push(evt);
    }

    return {
      ingested: events.length,
      events,
    };
  }

