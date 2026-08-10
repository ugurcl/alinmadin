import fs from "node:fs";
import path from "node:path";

let statsPath = "stats.json";
let stats = { rejections: 0 };

export function initStats(dir) {
  const dataDir = path.join(dir, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  statsPath = path.join(dataDir, "stats.json");
  try {
    stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
  } catch {}
  if (typeof stats.rejections !== "number") stats = { rejections: 0 };
}

export function getStats() {
  return stats;
}

export function countRejection() {
  stats.rejections += 1;
  fs.writeFile(statsPath, JSON.stringify(stats), () => {});
}
