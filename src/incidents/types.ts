export interface Incident {
  id: string;
  startTime: Date;
  endTime: Date;
  services: string[];
  events: any[];
  rootCause: string;
  timeline: string[];
  summary: string;
  story: string;   // AI narrative
}
