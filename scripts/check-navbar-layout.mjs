#!/usr/bin/env node
/**
 * Navbar layout + contrast report.
 *
 * Captures the navbar strip (not just the logo element) so the logo can be
 * scored against the *real* navbar background it sits on, then prints:
 *   - geometry: rendered box, navbar height, clearance above/below, gap to the
 *     hamburger, left padding, horizontal overflow
 *   - the strip screenshot, which scripts/navbar_contrast.py turns into
 *     WCAG contrast ratios for the logo's red and black regions
 *
 * Usage: node scripts/check-navbar-layout.mjs <url> [outDir] [tag]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] || "http://localhost:3000";
const outDir = process.argv[3] || "/tmp/navlogo";
const tag = process.argv[4] || "run";
const VIEWPORTS = [320, 360, 390, 768, 1440];

mkdirSync(outDir, { recursive: true });

for (const width of VIEWPORTS) {
  const isMobile = width < 768;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width, height: 800 },
    deviceScaleFactor: isMobile ? 3 : 2,
    isMobile,
    hasTouch: isMobile,
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(500);

  const stripH = isMobile ? 48 : 64;
  const shot = `${outDir}/${tag}-strip-${width}.png`;
  await page.screenshot({ path: shot, clip: { x: 0, y: 0, width, height: stripH } });

  const m = await page.evaluate(() => {
    const img = document.querySelector('nav img[alt*="Logo TBM"]');
    const burger = document.querySelector('nav button[aria-label="Menu"]');
    const nav = document.querySelector("nav");
    if (!img || !nav) return { error: "logo or navbar missing" };
    const ir = img.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    const br = burger ? burger.getBoundingClientRect() : null;
    const burgerVisible = br ? br.width > 0 : false;
    return {
      logo: { w: +ir.width.toFixed(1), h: +ir.height.toFixed(1) },
      ratio: +(ir.width / ir.height).toFixed(4),
      navH: +nr.height.toFixed(1),
      clearTop: +(ir.y - nr.y).toFixed(1),
      clearBottom: +(nr.bottom - ir.bottom).toFixed(1),
      leftPad: +ir.x.toFixed(1),
      gapToBurger: burgerVisible ? +(br.x - ir.right).toFixed(1) : null,
      clipped: ir.y < nr.y - 0.5 || ir.bottom > nr.bottom + 0.5,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
    };
  });

  console.log(`${width}px ${JSON.stringify(m)} -> ${shot}`);
  await browser.close();
}
