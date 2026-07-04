import { MAX_TURNS, MAX_HISTORY, MAX_MESSAGE_LENGTH } from "../config.js";
import { isRateLimited } from "../rateLimit.js";
import { askInterviewer } from "../gemini.js";
import { mockInterviewer } from "../mock.js";
import { hasKeys } from "../keys.js";

function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

export function handleChat(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
  if (isRateLimited(ip)) {
    return send(res, 429, { error: "Sakin olun, İK departmanımız da yorulur. Birazdan tekrar deneyin." });
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 50000) req.destroy();
  });

  req.on("end", async () => {
    try {
      const { history = [], name = "" } = JSON.parse(body);
      if (!Array.isArray(history) || history.length > MAX_HISTORY + 4) {
        return send(res, 400, { error: "Geçersiz istek." });
      }
      const clean = history.slice(-MAX_HISTORY).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: String(m.text || "").slice(0, MAX_MESSAGE_LENGTH),
      }));
      const userTurns = clean.filter((m) => m.role === "user").length;
      const isFinal = userTurns > MAX_TURNS;
      const reply = hasKeys()
        ? await askInterviewer(clean, isFinal)
        : mockInterviewer(clean, isFinal, String(name).slice(0, 60));
      send(res, 200, reply);
    } catch (err) {
      console.error(err.message);
      send(res, 500, { error: "İK sistemimizde teknik bir aksaklık oluştu. Yine de alınmayacaktınız." });
    }
  });
}
