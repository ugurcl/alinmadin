import fs from "node:fs";
import path from "node:path";

export function loadEnv(dir) {
  try {
    const raw = fs.readFileSync(path.join(dir, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
      if (m && m[2] && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {}
}
