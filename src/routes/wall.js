import crypto from "node:crypto";
import { isRateLimited } from "../rateLimit.js";
import { RATE_MAX_WALL } from "../config.js";
import { createWallEntry, listWall, markSame } from "../wall.js";

function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

function clientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "";
}

function fingerprint(req) {
  return crypto
    .createHash("sha256")
    .update(`${clientIp(req)}|${req.headers["user-agent"] || ""}`)
    .digest("hex")
    .slice(0, 16);
}

export function handleListWall(req, res, url) {
  send(res, 200, listWall(url.searchParams.get("sort"), url.searchParams.get("offset")));
}

export function handleCreateWall(req, res) {
  if (isRateLimited(clientIp(req), "wall", RATE_MAX_WALL)) {
    return send(res, 429, {
      error: "Bir süredir çok dert döktünüz. Duvar da yorulur, biraz bekleyin.",
    });
  }
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 4000) req.destroy();
  });
  req.on("end", () => {
    try {
      const result = createWallEntry(JSON.parse(body), fingerprint(req));
      if (result.error) return send(res, 400, { error: result.error });
      send(res, 200, result.entry);
    } catch (err) {
      console.error(new Date().toISOString(), "wall failed:", err.message);
      send(res, 500, { error: "İtirafınız duvara asılamadı. O da mı reddedildi." });
    }
  });
}

export function handleWallSame(req, res, id) {
  if (isRateLimited(clientIp(req), "wall-same", 120)) {
    return send(res, 429, { error: "Çok fazla dayanışma. Sakin." });
  }
  const sames = markSame(id);
  if (sames === null) return send(res, 404, { error: "Böyle bir itiraf yok." });
  send(res, 200, { sames });
}
