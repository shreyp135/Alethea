
const LOG_REGEX =
  /^(?<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s+(?<level>INFO|WARN|ERROR|DEBUG)\s+\[(?<service>[^\]]+)\]\s+(?<message>.*)$/;

export interface LogEvent {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
}

export function parseLogLine(line: string): LogEvent | null {
  const match = LOG_REGEX.exec(line.trim());

  if (!match || !match.groups) {
    console.log("No match:", line);
    return null;
  }

  const { timestamp, level, service, message } = match.groups;

  return {
    timestamp: new Date(timestamp),
    level: level as LogEvent["level"],
    service,
    message,
  };
}


export function parseLogFiles(logs: string): LogEvent[] {
    const lines = logs.split('\n');
    const events: LogEvent[] = [];
    for (const line of lines) {
        const event = parseLogLine(line);
        if (event) {   
            events.push(event);
        }   
    }
    return events;
}
