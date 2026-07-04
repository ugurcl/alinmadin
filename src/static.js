import fs from "node:fs";
import path from "node:path";

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
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
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 — Bu sayfa da sizi reddetti.");
    }
    const type = MIME[path.extname(fullPath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    res.end(data);
  });
}
