import { SYSTEM_PROMPT } from "./config.js";
import { nextKey, benchKey, keyCount } from "./keys.js";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const RETRYABLE = /429|401|403|quota|RESOURCE_EXHAUSTED|API_KEY_INVALID/i;

async function callOnce(apiKey, history, isFinal) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const contents = history.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.text }],
  }));
  if (isFinal) {
    contents.push({ role: "user", parts: [{ text: "SON_TUR: Mülakatı bitir ve red mektubunu yaz." }] });
  }

  const res = await fetch(`${BASE}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 1.1,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200);
    throw new Error(`gemini ${res.status}: ${detail}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const reply = JSON.parse(text);
  if (reply.type !== "question" && reply.type !== "rejection") {
    throw new Error("unexpected reply shape");
  }
  return reply;
}

export async function askInterviewer(history, isFinal) {
  let lastError;
  const attempts = Math.max(keyCount(), 1);
  for (let i = 0; i < attempts; i++) {
    const key = nextKey();
    if (!key) break;
    try {
      return await callOnce(key, history, isFinal);
    } catch (err) {
      lastError = err;
      if (RETRYABLE.test(err.message)) {
        benchKey(key);
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error("no available gemini key");
}
