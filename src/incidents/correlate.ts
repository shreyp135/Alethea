import { groupEvents } from "./group.js";
import { analyzeIncident } from "./analyze.js";
import { generateIncidentStoryline } from "./storyline.js";
import { storeIncident } from "../memory/store.js";

export async function correlateAndStore(events:any[]) {
  const groups = groupEvents(events);

  const incidents = [];

  for (const group of groups) {
    const analysis = analyzeIncident(group);
    const story = await generateIncidentStoryline(analysis);

    const incidentObj = {
      id: crypto.randomUUID(),
      startTime: group[0].timestamp,
      endTime: group[group.length - 1].timestamp,
      services: analysis.services,
      events: group,
      rootCause: analysis.rootCause,
      timeline: analysis.timeline,
      summary: story.slice(0, 150) + "...",
      story,
    };

    await storeIncident(story, {
      services: analysis.services,
      rootCause: analysis.rootCause,
      startTime: group[0].timestamp,
    });

    incidents.push(incidentObj);
  }

  return incidents;
}
