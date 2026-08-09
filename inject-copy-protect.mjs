import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const GUIDES_DIR = path.join(ROOT, 'guides');

const VERSION = '1';

let total = 0;
let changed = 0;
let alreadyProtected = 0;
let warned = 0;
let missingAfter = [];

function toWebPath(fromFileDir, targetFile) {
  let rel = path.relative(fromFileDir, targetFile).replaceAll(path.sep, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;

    total++;

    const fileDir = path.dirname(full);

    const cssHref = `${toWebPath(fileDir, path.join(ROOT, 'copy-protect.css'))}?v=${VERSION}`;
    const jsSrc = `${toWebPath(fileDir, path.join(ROOT, 'copy-protect.js'))}?v=${VERSION}`;

    const CSS_LINE = `<link rel="stylesheet" href="${cssHref}">`;
    const JS_LINE = `<script src="${jsSrc}" defer></script>`;

    let html = fs.readFileSync(full, 'utf8');
    const original = html;

    const hasCopyProtectCss = html.includes('copy-protect.css');
    const hasCopyProtectJs = html.includes('copy-protect.js');

    if (hasCopyProtectCss && hasCopyProtectJs) {
      alreadyProtected++;
      return;
    }

    if (!hasCopyProtectCss) {
      if (html.includes('</head>')) {
        html = html.replace('</head>', `  ${CSS_LINE}\n</head>`);
      } else {
        console.warn(`No </head> found: ${path.relative(ROOT, full)}`);
        warned++;
      }
    }

    if (!hasCopyProtectJs) {
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${JS_LINE}\n</body>`);
      } else {
        console.warn(`No </body> found: ${path.relative(ROOT, full)}`);
        warned++;
      }
    }

    const finalHasCss = html.includes('copy-protect.css');
    const finalHasJs = html.includes('copy-protect.js');

    if (!finalHasCss || !finalHasJs) {
      missingAfter.push(path.relative(ROOT, full));
    }

    if (html !== original) {
      fs.writeFileSync(full, html, 'utf8');
      changed++;
      console.log(`Updated: ${path.relative(ROOT, full)}`);
    }
  }
}

if (!fs.existsSync(GUIDES_DIR)) {
  console.error('Cannot find guides folder.');
  process.exit(1);
}

walk(GUIDES_DIR);

console.log('');
console.log('Done.');
console.log(`Total HTML scanned: ${total}`);
console.log(`Updated: ${changed} files`);
console.log(`Already protected: ${alreadyProtected} files`);
console.log(`Warnings: ${warned}`);
console.log(`Missing after scan: ${missingAfter.length}`);

if (missingAfter.length) {
  console.log('');
  console.log('Files still missing copy protect:');
  missingAfter.forEach(file => console.log(`- ${file}`));
}
