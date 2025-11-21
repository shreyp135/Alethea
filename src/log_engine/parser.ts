
const LOG_REGEX =   /^(?<timestamp>\S+)\s+(?<level>INFO|WARN|ERROR|DEBUG)\s+\[?(?<service>[a-zA-Z0-9-_]+)?\]?\s*(?<message>.*)$/;

export interface LogEvent {
    timestamp: Date;
    level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
    service?: string;
    message: string;
}   

export function parseLogLine(line: string): LogEvent | null {
    const match = LOG_REGEX.exec(line);
    if (!match || !match.groups) {
        return null;
    }

    const { timestamp, level, service, message } = match.groups;
    return {
        timestamp: new Date(timestamp),
        level: level as 'INFO' | 'WARN' | 'ERROR' | 'DEBUG',
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
