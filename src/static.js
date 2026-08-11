import fs from "node:fs";
import path from "node:path";

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".txt": "text/plain",
};

const TEXTUAL = /^(text\/|application\/(json|javascript)|image\/svg)/;

const CACHE = {
  ".png": "public, max-age=604800",
  ".jpg": "public, max-age=604800",
  ".jpeg": "public, max-age=604800",
  ".gif": "public, max-age=604800",
  ".webp": "public, max-age=604800",
  ".svg": "public, max-age=604800",
  ".ico": "public, max-age=604800",
  ".woff": "public, max-age=2592000",
  ".woff2": "public, max-age=2592000",
  ".mp3": "public, max-age=604800",
};

export function serveStatic(rootDir, urlPath, res) {
  let file = urlPath === "/" ? "/index.html" : urlPath;
  file = path.normalize(file).replace(/^([.\\/])+/, "");
  const fullPath = path.join(rootDir, file);
  if (!fullPath.startsWith(rootDir)) {
    res.writeHead(403);
    return res.end();
  }
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      return fs.readFile(path.join(rootDir, "404.html"), (notFoundErr, page) => {
        if (notFoundErr) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("404 — Bu sayfa da sizi reddetti.");
        }
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(page);
      });
    }
    const ext = path.extname(fullPath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const headers = {
      "Content-Type": TEXTUAL.test(type) ? `${type}; charset=utf-8` : type,
      "X-Content-Type-Options": "nosniff",
    };
    headers["Cache-Control"] = CACHE[ext] || "no-cache";
    res.writeHead(200, headers);
    res.end(data);
  });
}
