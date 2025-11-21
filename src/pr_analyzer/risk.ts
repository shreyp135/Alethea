export interface RiskAssessment {
  score: number;
  tags: string[];
}

export function assessRisk(diff: any): RiskAssessment {
  const tags: string[] = [];
  let score = 0;

  if (/timeout/i.test(diff)) tags.push("TIMEOUT_CHANGE");
  if (/retry/i.test(diff)) tags.push("RETRY_LOGIC_CHANGE");
  if (/ttl|cache/i.test(diff)) tags.push("CACHE_TTL_CHANGE");
  if (/pool|connection/i.test(diff)) tags.push("DB_CONNECTION_POOL_CHANGE");
  if (/concurrency|thread/i.test(diff)) tags.push("CONCURRENCY_CHANGE");
  if (/sleep|wait\(/i.test(diff)) tags.push("ARTIFICIAL_DELAY_ADDED");

  return { score: tags.length * 10, tags };
}
