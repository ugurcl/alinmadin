import { RATE_WINDOW_MS, RATE_MAX_HITS } from "./config.js";

const buckets = new Map();

export function isRateLimited(ip, bucket = "default", max = RATE_MAX_HITS) {
  let hits = buckets.get(bucket);
  if (!hits) {
    hits = new Map();
    buckets.set(bucket, hits);
  }
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
