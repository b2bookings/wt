// Renders site/og-image.html to site/og-image.png (1200×630).
// Usage: node site/scripts/render-og.mjs   (needs the `playwright` package)
import { chromium } from 'playwright';
import { statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const siteDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(siteDir, 'og-image.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(join(siteDir, 'og-image.html')).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.locator('#og').screenshot({ path: out });
await browser.close();

const kb = statSync(out).size / 1024;
console.log(`Wrote ${out} (${kb.toFixed(0)} KB)`);
if (kb >= 1024) { console.error('OG image must be under 1MB'); process.exit(1); }
