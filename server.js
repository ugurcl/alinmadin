import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "./src/env.js";
import { handleChat } from "./src/routes/chat.js";
import { serveStatic } from "./src/static.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv(__dirname);

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (req.method === "POST" && url.pathname === "/api/chat") {
    return handleChat(req, res);
  }
  serveStatic(PUBLIC_DIR, url.pathname, res);
});

server.listen(PORT, () => {
  const mode = process.env.GEMINI_API_KEY
    ? `gemini: ${process.env.GEMINI_MODEL || "gemini-2.5-flash"}`
    : "mock mode, add GEMINI_API_KEY to .env";
  console.log(`alinmadin (${mode}) -> http://localhost:${PORT}`);
});
