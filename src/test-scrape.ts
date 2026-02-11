import { chromium } from 'playwright';

(async () => {
    // Initializing
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Main content
    await page.goto("https://example.com");
    await page.screenshot({ path: 'screenshot.png' });
    console.log(await page.title());

    // Finish
    await context.close();
    await browser.close();
})();