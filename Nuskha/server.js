/**
 * Nuskha AI - Unified Application Server
 * 
 * Standalone Node.js HTTP server (Zero required external dependencies).
 * Serves the static dashboard, assets, and REST APIs for generic matching.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const { searchAndCompareGenerics } = require("./public/js/core/genericMatcher");
const { getAllMedicines } = require("./public/js/data/medicines");
const { getAllInteractions } = require("./public/js/data/interactions");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME_TYPES = {
  ".html": "text/html; charset=UTF-8",
  ".css": "text/css; charset=UTF-8",
  ".js": "application/javascript; charset=UTF-8",
  ".json": "application/json; charset=UTF-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API 1: Generic Medicine Matcher Search Endpoint
  if (pathname === "/api/generic-match") {
    const query = parsedUrl.query.q || "";
    const result = searchAndCompareGenerics(query);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
    return;
  }

  // API 2: Medicines Catalog Endpoint
  if (pathname === "/api/medicines") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getAllMedicines()));
    return;
  }

  // API 3: Interactions Dataset Endpoint
  if (pathname === "/api/interactions") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getAllInteractions()));
    return;
  }

  // Static File Serving
  let relativePath = pathname === "/" ? "index.html" : pathname;
  // Prevent directory traversal
  const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, "");
  let filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404 handler
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end(`
        <h2 style="font-family:sans-serif; text-align:center; margin-top:50px;">
          404 - File Not Found
        </h2>
        <p style="text-align:center;"><a href="/">Return to Nuskha AI Dashboard</a></p>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, { "Content-Type": contentType });
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log("================================================================================");
  console.log(`        NUSKHA AI — HEALTHCARE ASSISTANT SERVER (STAGE 4 INTEGRATED)           `);
  console.log("================================================================================");
  console.log(`  ✓ Dashboard running at:   http://localhost:${PORT}`);
  console.log(`  ✓ Generic Matcher API:    http://localhost:${PORT}/api/generic-match?q=Amoxil`);
  console.log(`  ✓ Medicines Catalog API:  http://localhost:${PORT}/api/medicines`);
  console.log("================================================================================");
});

module.exports = server;
