import { SYSTEM_PROMPT } from "./config.js";
import { nextKey, benchKey, keyCount } from "./keys.js";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const RETRYABLE = /429|401|403|quota|RESOURCE_EXHAUSTED|API_KEY_INVALID/i;

function buildContents(history, isFinal) {
  const contents = [];
  for (const m of history) {
    const role = m.role === "user" ? "user" : "model";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n${m.text}`;
    } else {
      contents.push({ role, parts: [{ text: m.text }] });
    }
  }
  if (isFinal) {
    const last = contents[contents.length - 1];
    const marker = "SON_TUR: Mülakatı bitir ve red mektubunu yaz.";
    if (last && last.role === "user") last.parts[0].text += `\n${marker}`;
    else contents.push({ role: "user", parts: [{ text: marker }] });
  }
  return contents;
}

async function callOnce(apiKey, history, isFinal) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const contents = buildContents(history, isFinal);

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
        maxOutputTokens: 4096,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });

  if (!res.ok) {
    const detail = (await res.text()).slice(0, 200);
    throw new Error(`gemini ${res.status}: ${detail}`);
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const text = parts.map((p) => p.text || "").join("").trim();
  if (!text) {
    throw new Error(`empty response, finishReason: ${data.candidates?.[0]?.finishReason}`);
  }
  const cleaned = text.replace(/^```(json)?\s*/i, "").replace(/```\s*$/, "");
  const reply = JSON.parse(cleaned);
  if (reply.type !== "question" && reply.type !== "rejection") {
    throw new Error("unexpected reply shape");
  }
  reply.text = String(reply.text);
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
