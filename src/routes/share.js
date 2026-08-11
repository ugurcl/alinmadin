import { isRateLimited } from "../rateLimit.js";
import { RATE_MAX_SHARES } from "../config.js";
import { createShare, getShare } from "../shares.js";

function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

export function handleCreateShare(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
  if (isRateLimited(ip, "share", RATE_MAX_SHARES)) {
    return send(res, 429, { error: "Çok fazla paylaşım. İK departmanımız yoruldu." });
  }
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 20000) req.destroy();
  });
  req.on("end", () => {
    try {
      const id = createShare(JSON.parse(body));
      if (!id) return send(res, 400, { error: "Paylaşılacak bir red bulunamadı." });
      send(res, 200, { id });
    } catch (err) {
      console.error(new Date().toISOString(), "share failed:", err.message);
      send(res, 500, { error: "Paylaşım oluşturulamadı." });
    }
  });
}

export function handleGetShare(res, id) {
  const share = getShare(id);
  if (!share) return send(res, 404, { error: "Bu red bulunamadı. O da mı reddedildi." });
  send(res, 200, share);
}
