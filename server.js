import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./src/env.js";
import { initKeys } from "./src/keys.js";
import { initStats, getStats } from "./src/stats.js";
import { initShares } from "./src/shares.js";
import { initWall } from "./src/wall.js";
import { handleChat } from "./src/routes/chat.js";
import { handleCreateShare, handleGetShare } from "./src/routes/share.js";
import { handleListWall, handleCreateWall, handleWallSame } from "./src/routes/wall.js";
import { serveStatic } from "./src/static.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv(__dirname);
const keyCount = initKeys();
initStats(__dirname);
initShares(__dirname);
initWall(__dirname);

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "POST" && url.pathname === "/api/chat") {
    return handleChat(req, res);
  }
  if (req.method === "GET" && url.pathname === "/api/stats") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    return res.end(JSON.stringify(getStats()));
  }
  if (req.method === "POST" && url.pathname === "/api/share") {
    return handleCreateShare(req, res);
  }
  const shareApi = url.pathname.match(/^\/api\/share\/([A-Za-z0-9]{1,12})$/);
  if (req.method === "GET" && shareApi) {
    return handleGetShare(res, shareApi[1]);
  }
  if (url.pathname === "/api/wall") {
    if (req.method === "GET") return handleListWall(req, res, url);
    if (req.method === "POST") return handleCreateWall(req, res);
  }
  const sameApi = url.pathname.match(/^\/api\/wall\/([A-Za-z0-9]{1,12})\/same$/);
  if (req.method === "POST" && sameApi) {
    return handleWallSame(req, res, sameApi[1]);
  }
  if (req.method === "GET" && /^\/r\/[A-Za-z0-9]{1,12}$/.test(url.pathname)) {
    return serveStatic(PUBLIC_DIR, "/index.html", res);
  }
  if (req.method === "GET" && /^\/(duvar|cark|terapi)$/.test(url.pathname)) {
    return serveStatic(PUBLIC_DIR, "/index.html", res);
  }
  serveStatic(PUBLIC_DIR, url.pathname, res);
});

server.listen(PORT, () => {
  const mode = keyCount > 0
    ? `gemini: ${process.env.GEMINI_MODEL || "gemini-2.5-flash"}, ${keyCount} key`
    : "mock mode, add GEMINI_API_KEYS to .env";
  console.log(`alinmadin (${mode}) -> http://localhost:${PORT}`);
});
