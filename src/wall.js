import fs from "node:fs";
import path from "node:path";
import { WALL_MAX_ENTRIES, WALL_TEXT_MIN, WALL_TEXT_MAX, WALL_PAGE_SIZE } from "./config.js";

let wallPath = "wall.json";
let entries = [];
let byId = new Map();
let writeQueued = false;

const BANNED = [
  "amk", "aq", "oç", "orospu", "piç", "sikt", "sik", "yarrak", "göt", "gavat",
  "ananı", "anan", "bacını", "ibne", "puşt", "kahpe", "şerefsiz", "pezeven",
  "fuck", "shit", "bitch", "cunt",
];

const LINK = /(https?:\/\/|www\.|\b[\w-]+\.(com|net|org|io|tr|co)\b)/i;

export function initWall(dir) {
  const dataDir = path.join(dir, "data");
  fs.mkdirSync(dataDir, { recursive: true });
  wallPath = path.join(dataDir, "wall.json");
  try {
    const parsed = JSON.parse(fs.readFileSync(wallPath, "utf8"));
    entries = Array.isArray(parsed?.entries) ? parsed.entries : [];
  } catch {
    entries = [];
  }
  byId = new Map(entries.map((e) => [e.id, e]));
}

function persist() {
  if (writeQueued) return;
  writeQueued = true;
  setTimeout(() => {
    writeQueued = false;
    fs.writeFile(wallPath, JSON.stringify({ entries }), () => {});
  }, 400);
}

function makeId() {
  let id;
  do {
    id = Math.random().toString(36).slice(2, 9);
  } while (byId.has(id));
  return id;
}

function normalize(text) {
  return text
    .toLocaleLowerCase("tr")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function checkText(raw) {
  const text = String(raw || "").replace(/\s+/g, " ").trim();
  if (text.length < WALL_TEXT_MIN) {
    return { error: "Biraz daha anlatın. En az birkaç kelime bekliyoruz." };
  }
  if (text.length > WALL_TEXT_MAX) {
    return { error: `En fazla ${WALL_TEXT_MAX} karakter. Red mektupları bile bu kadar uzun değil.` };
  }
  if (LINK.test(text)) {
    return { error: "Link paylaşılamaz. Burası ilan panosu değil, dert panosu." };
  }
  if (/(.)\1{6,}/.test(text)) {
    return { error: "Bu bir cümle değil. Tekrar deneyin." };
  }
  const words = normalize(text).split(" ");
  if (words.some((w) => BANNED.some((bad) => w.startsWith(bad)))) {
    return { error: "Duvarımız küfürsüzdür. Öfkeyi kurumsal dile çevirin, daha çok acıtıyor." };
  }
  if (new Set(words).size < 3) {
    return { error: "Biraz daha anlatın. En az birkaç kelime bekliyoruz." };
  }
  return { text };
}

export function createWallEntry(payload, fingerprint) {
  const checked = checkText(payload.text);
  if (checked.error) return checked;

  const key = normalize(checked.text);
  if (entries.some((e) => normalize(e.text) === key)) {
    return { error: "Bu itiraf zaten duvarda. Yalnız olmadığınızın kanıtı." };
  }

  const entry = {
    id: makeId(),
    text: checked.text,
    role: String(payload.role || "").slice(0, 40).trim(),
    at: new Date().toISOString(),
    sames: 0,
    fp: fingerprint,
  };
  entries.unshift(entry);
  byId.set(entry.id, entry);
  while (entries.length > WALL_MAX_ENTRIES) {
    const dropped = entries.pop();
    byId.delete(dropped.id);
  }
  persist();
  return { entry: publicEntry(entry) };
}

export function markSame(id) {
  const entry = byId.get(String(id || "").slice(0, 12));
  if (!entry) return null;
  entry.sames += 1;
  persist();
  return entry.sames;
}

const publicEntry = (e) => ({
  id: e.id,
  text: e.text,
  role: e.role,
  at: e.at,
  sames: e.sames,
});

export function listWall(sort, offset) {
  const start = Math.max(0, Number(offset) || 0);
  const sorted =
    sort === "top" ? [...entries].sort((a, b) => b.sames - a.sames) : entries;
  return {
    total: entries.length,
    entries: sorted.slice(start, start + WALL_PAGE_SIZE).map(publicEntry),
  };
}

export function ownedByFingerprint(fingerprint) {
  return entries.filter((e) => e.fp === fingerprint).length;
}
