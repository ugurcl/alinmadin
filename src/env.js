import fs from "node:fs";
import path from "node:path";

export function loadEnv(dir) {
  try {
    const raw = fs.readFileSync(path.join(dir, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!m) continue;
      const value = m[2].replace(/^(['"])(.*)\1$/, "$2");
      if (value && !process.env[m[1]]) process.env[m[1]] = value;
    }
  } catch {}
}
