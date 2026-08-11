import { MAX_TURNS, MAX_HISTORY, MAX_MESSAGE_LENGTH } from "../config.js";
import { isRateLimited } from "../rateLimit.js";
import { askInterviewer } from "../gemini.js";
import { mockInterviewer } from "../mock.js";
import { hasKeys } from "../keys.js";
import { countRejection } from "../stats.js";

function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

export function handleChat(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
  if (isRateLimited(ip, "chat")) {
    return send(res, 429, { error: "Sakin olun, İK departmanımız da yorulur. Birazdan tekrar deneyin." });
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 50000) req.destroy();
  });

  req.on("end", async () => {
    try {
      const { history = [], name = "", mode = "" } = JSON.parse(body);
      if (!Array.isArray(history) || history.length > MAX_HISTORY + 4) {
        return send(res, 400, { error: "Geçersiz istek." });
      }
      const clean = history.slice(-MAX_HISTORY).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: String(m.text || "").slice(0, MAX_MESSAGE_LENGTH),
      }));
      const userTurns = clean.filter((m) => m.role === "user").length;
      const turnMode =
        mode === "appeal" || mode === "therapy"
          ? mode
          : userTurns > MAX_TURNS
            ? "final"
            : "question";
      const safeName = String(name).slice(0, 60);
      let reply;
      if (hasKeys()) {
        try {
          reply = await askInterviewer(clean, turnMode);
        } catch (err) {
          console.error(new Date().toISOString(), "gemini failed, falling back to mock:", err.message);
          reply = mockInterviewer(clean, turnMode, safeName);
        }
      } else {
        reply = mockInterviewer(clean, turnMode, safeName);
      }
      if (turnMode === "appeal" || turnMode === "therapy") reply.type = turnMode;
      if (turnMode === "final") {
        reply.type = "rejection";
        countRejection();
      }
      send(res, 200, reply);
    } catch (err) {
      console.error(new Date().toISOString(), err.message);
      send(res, 500, { error: "İK sistemimizde teknik bir aksaklık oluştu. Yine de alınmayacaktınız." });
    }
  });
}
