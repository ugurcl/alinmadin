let keys = [];
let cursor = 0;
const benched = new Map();

export function initKeys() {
  const raw = [process.env.GEMINI_API_KEYS, process.env.GEMINI_API_KEY]
    .filter(Boolean)
    .join(",");
  keys = [...new Set(raw.split(",").map((k) => k.trim()).filter(Boolean))];
  return keys.length;
}

export function keyCount() {
  return keys.length;
}

export function hasKeys() {
  return keys.length > 0;
}

export function nextKey() {
  const now = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const key = keys[(cursor + i) % keys.length];
    if ((benched.get(key) || 0) < now) {
      cursor = (cursor + i + 1) % keys.length;
      return key;
    }
  }
  return null;
}

export function benchKey(key, ms = 60000) {
  benched.set(key, Date.now() + ms);
}
