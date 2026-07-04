import { SYSTEM_PROMPT } from "./config.js";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export async function askInterviewer(history, isFinal) {
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
      "x-goog-api-key": process.env.GEMINI_API_KEY,
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
