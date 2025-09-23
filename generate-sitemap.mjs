// generate-sitemap.mjs  —— 單檔 sitemap 版
import { promises as fs } from "fs";
import path from "path";

const BASE = "https://belaug-ffxiv.github.io/FFXIV_Library";
const ROOT = process.cwd();

// 不掃這些資料夾
const EXCLUDE_DIRS = new Set([".git", ".github", "node_modules", "sitemaps", "data"]);
const EXCLUDE_FILES = [/^google[0-9a-f]+\.(html?|htm)$/i];

async function listHtmlFiles(dir = ".") {
  const abs = path.join(ROOT, dir);
  const out = [];
  const entries = await fs.readdir(abs, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.posix.join(dir, e.name).replace(/^\.\//, "");
    if (e.isDirectory()) {
      if (!EXCLUDE_DIRS.has(e.name)) out.push(...(await listHtmlFiles(rel)));
    } else if (e.isFile() && /\.html?$/i.test(e.name)) {
      if (EXCLUDE_FILES.some(re => re.test(e.name))) continue;
      out.push(rel);
    }
  }
  return out;
}

function fileToUrl(rel) {
  const p = rel.split(path.sep).join("/");
  if (p === "index.html") return `${BASE}/`;
  if (p.endsWith("/index.html")) return `${BASE}/${p.replace(/\/index\.html$/, "/")}`;
  return `${BASE}/${p}`;
}

const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const toISO = d => new Date(d).toISOString().slice(0,10);

async function main() {
  let files = await listHtmlFiles(".");
  if (!files.includes("index.html")) files.unshift("index.html");

  // 轉網址 + 依檔案 mtime 製作 lastmod
  const urls = [];
  for (const rel of Array.from(new Set(files))) {
    const loc = fileToUrl(rel);
    let lastmod = toISO(Date.now());
    try { lastmod = toISO((await fs.stat(path.join(ROOT, rel))).mtime); } catch {}
    urls.push({ loc, lastmod });
  }

  const body = urls.map(u => `  <url>\n    <loc>${esc(u.loc)}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  await fs.writeFile(path.join(ROOT, "sitemap.xml"), xml);
  console.log(`Generated sitemap.xml with ${urls.length} urls`);
}

main().catch(e => { console.error(e); process.exit(1); });
