import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, "index.html"), "utf8");
const port = Number(process.env.PORT || 8080);

createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}).listen(port, "0.0.0.0", () => {
  console.log(`[preview-web] placeholder running on http://0.0.0.0:${port}`);
});
