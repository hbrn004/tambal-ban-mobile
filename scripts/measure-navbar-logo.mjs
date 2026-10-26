#!/usr/bin/env node
/**
 * Measure the navbar TBM logo exactly as a user sees it.
 *
 * For each viewport it:
 *   - screenshots ONLY the navbar logo element at a high device scale factor
 *   - records computed box size, natural size, currentSrc and text visibility
 *
 * The screenshots are then scored for sharpness (Laplacian variance +
 * edge gradient energy) by scripts/logo_sharpness.py.
 *
 * Usage: node scripts/measure-navbar-logo.mjs <url> <outDir> [tag]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const url = process.argv[2] || "http://localhost:3000";
const outDir = process.argv[3] || "/tmp/navlogo";
const tag = process.argv[4] || "run";

const VIEWPORTS = [
  { name: "320", width: 320, height: 800, dpr: 3, mobile: true },
  { name: "360", width: 360, height: 800, dpr: 3, mobile: true },
  { name: "390", width: 390, height: 800, dpr: 3, mobile: true },
  { name: "1440", width: 1440, height: 900, dpr: 2, mobile: false },
];

mkdirSync(outDir, { recursive: true });
const results = [];

for (const vp of VIEWPORTS) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });

  const img = page.locator('nav img[alt*="Logo TBM"]').first();
  await img.waitFor({ state: "visible", timeout: 30000 });
  // Force decode so the screenshot can never capture a half-painted image.
  await img.evaluate((el) => (el.decode ? el.decode() : null).catch?.(() => {}));
  await page.waitForTimeout(400);

  const info = await img.evaluate((el) => {
    const r = el.getBoundingClientRect();
    // The text block lives in the same flex anchor as the logo.
    const anchor = el.closest("a");
    const textBlock = anchor ? anchor.querySelector("h1") : null;
    const tbWrap = textBlock ? textBlock.parentElement : null;
    const cs = tbWrap ? getComputedStyle(tbWrap) : null;
    const nav = el.closest("nav");
    return {
      cssW: +r.width.toFixed(2),
      cssH: +r.height.toFixed(2),
      naturalW: el.naturalWidth,
      naturalH: el.naturalHeight,
      currentSrc: el.currentSrc || el.src,
      complete: el.complete,
      objectFit: getComputedStyle(el).objectFit,
      filter: getComputedStyle(el).filter,
      opacity: getComputedStyle(el).opacity,
      imageRendering: getComputedStyle(el).imageRendering,
      navHeight: nav ? +nav.getBoundingClientRect().height.toFixed(1) : null,
      navBg: nav ? getComputedStyle(nav).backgroundColor : null,
      textVisible: cs ? cs.display !== "none" : null,
      textDisplayClass: cs ? cs.display : null,
    };
  });

  const shot = `${outDir}/${tag}-${vp.name}.png`;
  await img.screenshot({ path: shot });

  results.push({ viewport: vp.name, dpr: vp.dpr, shot, ...info, errors: [...new Set(errors)] });
  await browser.close();
}

console.log(JSON.stringify(results, null, 2));
