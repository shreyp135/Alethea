
export interface LogEvent {
  timestamp: Date | null;
  level: string | null;
  service: string | null;
  message: string;
  raw: string;
}
const LOG_LEVELS = [
  "INFO",
  "WARN",
  "WARNING",
  "ERROR",
  "DEBUG",
  "TRACE",
  "CRITICAL",
  "FATAL",
  "NOTICE",
];

const PATTERNS: RegExp[] = [
  // Pattern 0: Strict ISO timestamp + LEVEL + [service] + message
  /^(?<timestamp>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s+(?<level>INFO|WARN|ERROR|DEBUG)\s+\[(?<service>[^\]]+)\]\s+(?<message>.*)$/,

  // Pattern 1: ISO timestamp + LEVEL + [service] + message
  /^(?<timestamp>\S+)\s+(?<level>[A-Z]+)\s+\[(?<service>[^\]]+)\]\s+(?<message>.*)$/,

  // Pattern 2: ISO timestamp + LEVEL + message
  /^(?<timestamp>\S+)\s+(?<level>[A-Z]+)\s+(?<message>.*)$/,

  // Pattern 3: timestamp + [service] + message
  /^(?<timestamp>\S+)\s+\[(?<service>[^\]]+)\]\s+(?<message>.*)$/,

  // Pattern 4: LEVEL + [service] + message
  /^(?<level>[A-Z]+)\s+\[(?<service>[^\]]+)\]\s+(?<message>.*)$/,

  // Pattern 5: LEVEL + message
  /^(?<level>[A-Z]+)\s+(?<message>.*)$/,

  // Pattern 6: service: message
  /^(?<service>[a-zA-Z0-9-_]+):\s+(?<message>.*)$/,

  // Pattern 7: Nginx/Apache style
  /^(?<timestamp>\S+\s+\S+)\s+\[(?<level>[A-Z]+)\]\s+(?<message>.*)$/,

  // Pattern 8: JSON log
  /^\{.*"message":.*\}$/,
];

// timestamp parser
function tryParseTimestamp(str: string): Date | null {
  const ts = Date.parse(str);
  return new Date(ts);
  }

// detect log level if missing
function detectLevel(text: string): string | null {
  for (const level of LOG_LEVELS) {
    if (text.includes(level)) return level;
  }
  return null;
}

/**
 * UNIVERSAL LOG PARSER
 */
export function parseLogLine(line: string): LogEvent | null {
  const raw = line.trim();
  if (!raw) return null;

  // JSON logs:
  if (PATTERNS[8].test(raw)) {
    try {
      const obj = JSON.parse(raw);
      return {
        timestamp: tryParseTimestamp(obj.timestamp),
        level: obj.level || detectLevel(obj.message),
        service: obj.service || null,
        message: obj.message || raw,
        raw,
      };
    } catch {}
  }

  // Try regex patterns:
  for (const p of PATTERNS) {
    const m = p.exec(raw);
    if (!m?.groups) continue;

    const { timestamp, level, service, message } = m.groups;

    return {
      timestamp: tryParseTimestamp(timestamp),
      level: level || detectLevel(raw),
      service: service || null,
      message: message || raw,
      raw,
    };
  }

  // Fallback
  return {
    timestamp: null,
    level: detectLevel(raw),
    service: null,
    message: raw,
    raw,
  };
}

/**
 * Parse multiline log text into a list of LogEvent objects
 */
export function parseLogFiles(logs: string): LogEvent[] {
  return logs
    .split("\n")
    .map(line => parseLogLine(line))
    .filter((evt): evt is LogEvent => evt !== null);
}
