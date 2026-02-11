import { chromium } from 'playwright';

(async () => {
    // Initializing
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Main content
    // Match page
    await page.goto("https://www.gosugamers.net/counterstrike/tournaments/62664-cct-season-3-european-series-16/matches/640993-prime-vs-hyperspirit");
    await page.screenshot({ path: 'screenshot.png' });
    await page.waitForTimeout(5000);
    console.log(await page.title());

    // Finish
    await context.close();
    await browser.close();
})();