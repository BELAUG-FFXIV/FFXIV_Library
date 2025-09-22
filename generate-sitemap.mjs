// generate-sitemap.mjs
import { promises as fs } from "fs";
import path from "path";

const BASE = "https://belaug-ffxiv.github.io/FFXIV_Library"; // 你的站根網址
const ROOT = process.cwd();

// 需要排除掃描的資料夾（不影響網站）
const EXCLUDE_DIRS = new Set([".git", ".github", "node_modules", "sitemaps", "data"]);
// 需要排除的檔名（例如 Google 驗證檔）
const EXCLUDE_FILES = [/^google[0-9a-f]+\.(html|htm)$/i];

function isExcludedDir(dir) {
  return EXCLUDE_DIRS.has(dir);
}

async function listHtmlFiles(dir = ".") {
  const abs = path.join(ROOT, dir);
  const out = [];
  const entries = await fs.readdir(abs, { withFileTypes: true });
  for (const e of entries) {
    const rel = path.posix.join(dir, e.name).replace(/^\.\//, "");
    if (e.isDirectory()) {
      const name = e.name;
      if (!isExcludedDir(name)) out.push(...(await listHtmlFiles(rel)));
    } else if (e.isFile() && /\.html?$/.test(e.name)) {
      // 排除特定檔名
      if (EXCLUDE_FILES.some((re) => re.test(e.name))) continue;
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

function xmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toISODate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

async function mkUrlXml(relPath) {
  const loc = fileToUrl(relPath);
  let lastmod = toISODate(Date.now());
  try {
    const stat = await fs.stat(path.join(ROOT, relPath));
    lastmod = toISODate(stat.mtime);
  } catch {}
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

async function main() {
  const files = await listHtmlFiles(".");
  const uniq = Array.from(new Set(files));
  // 確保首頁一定在最前
  if (!uniq.includes("index.html")) uniq.unshift("index.html");

  const urlsXml = await Promise.all(uniq.map(mkUrlXml));
  // 依 Google 規範切檔（這裡 2000/檔，足夠你衝到 3000+）
  const MAX = 2000;
  const chunks = [];
  for (let i = 0; i < urlsXml.length; i += MAX) chunks.push(urlsXml.slice(i, i + MAX));

  await fs.mkdir(path.join(ROOT, "sitemaps"), { recursive: true });

  const today = toISODate(Date.now());
  const childLocs = [];

  for (let i = 0; i < chunks.length; i++) {
    const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks[i].join("\n")}
</urlset>
`;
    const name = `sitemaps/sitemap-${i + 1}.xml`;
    await fs.writeFile(path.join(ROOT, name), xml);
    childLocs.push(`${BASE}/${name}`);
  }

  const indexXml =
`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${childLocs.map(loc => `  <sitemap>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${today}</lastmod>\n  </sitemap>`).join("\n")}
</sitemapindex>
`;
  await fs.writeFile(path.join(ROOT, "sitemap_index.xml"), indexXml);
  // 讓 sitemap.xml 也指向索引（方便舊習慣）
  await fs.writeFile(path.join(ROOT, "sitemap.xml"), indexXml);

  console.log(`Generated ${childLocs.length} sitemap file(s).`);
}

main().catch(e => { console.error(e); process.exit(1); });
