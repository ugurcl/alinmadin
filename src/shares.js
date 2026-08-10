import fs from "node:fs";
import path from "node:path";
import { MAX_MESSAGE_LENGTH } from "./config.js";

const MAX_SHARES = 5000;
const LETTER_LIMIT = 2000;

let sharesPath = "shares.json";
let shares = {};
let order = [];
let writeQueued = false;

export function initShares(dir) {
  const dataDir = path.join(dir, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  sharesPath = path.join(dataDir, "shares.json");
  try {
    const parsed = JSON.parse(fs.readFileSync(sharesPath, "utf8"));
    if (parsed && typeof parsed === "object") {
      shares = parsed.shares || {};
      order = Array.isArray(parsed.order) ? parsed.order : Object.keys(shares);
    }
  } catch {
    shares = {};
    order = [];
  }
}

function persist() {
  if (writeQueued) return;
  writeQueued = true;
  setTimeout(() => {
    writeQueued = false;
    fs.writeFile(sharesPath, JSON.stringify({ shares, order }), () => {});
  }, 400);
}

function makeId() {
  let id;
  do {
    id = Math.random().toString(36).slice(2, 8);
  } while (shares[id]);
  return id;
}

const clean = (value, limit) => String(value || "").slice(0, limit).trim();

export function createShare(payload) {
  const letter = clean(payload.letter, LETTER_LIMIT);
  if (!letter) return null;
  const id = makeId();
  shares[id] = {
    name: clean(payload.name, 60),
    position: clean(payload.position, 120),
    company: clean(payload.company, 120),
    letter,
    seconds: Number(payload.seconds) > 0 ? Math.min(Number(payload.seconds), 86400) : 0,
    at: new Date().toISOString(),
  };
  order.push(id);
  while (order.length > MAX_SHARES) delete shares[order.shift()];
  persist();
  return id;
}

export function getShare(id) {
  return shares[clean(id, 12)] || null;
}

export const SHARE_FIELD_LIMIT = MAX_MESSAGE_LENGTH;
