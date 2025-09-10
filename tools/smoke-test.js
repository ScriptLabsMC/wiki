// tools/smoke-test.js
// Lightweight smoke test using Playwright to verify pages render icons and header/footer.
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL || "http://127.0.0.1:5500";
const PAGES = [
  "/",
  "/pages/templates.html",
  "/pages/about.html",
  "/pages/community.html",
];

async function checkPage(path) {
  const url = BASE.replace(/\/$/, "") + path;
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "networkidle" });
    // Wait a short time for client-side replacement
    await page.waitForTimeout(500);
    const header = await page.$("header.site-header");
    const footer = await page.$("footer.site-footer");
    const svgs = await page.$$eval(
      "svg, svg-x, svg[data-sl-icon], [data-sl-svg]",
      (els) => els.length,
    );
    const headerFilled = header
      ? (await header.innerHTML()).trim().length > 0
      : false;
    const footerFilled = footer
      ? (await footer.innerHTML()).trim().length > 0
      : false;
    await browser.close();
    return { url, svgs, headerFilled, footerFilled };
  } catch (err) {
    await browser.close();
    throw err;
  }
}

(async () => {
  let failed = false;
  for (const p of PAGES) {
    try {
      const r = await checkPage(p);
      console.log(
        `Checked ${r.url}: svgs=${r.svgs}, header=${r.headerFilled}, footer=${r.footerFilled}`,
      );
      if (r.svgs === 0 || !r.headerFilled || !r.footerFilled) {
        console.error("Smoke test failure on", r.url);
        failed = true;
      }
    } catch (e) {
      console.error("Error checking", p, e && e.message);
      failed = true;
    }
  }
  if (failed) process.exit(1);
  console.log("Smoke tests passed");
  process.exit(0);
})();
