import { chromium } from 'playwright';

(async () => {
    // Initializing
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Main content
    // Match page
    await page.goto("https://www.gosugamers.net/counterstrike/tournaments/62664-cct-season-3-european-series-16/matches/640993-prime-vs-hyperspirit");

    // Team Data
    const teamData = page.locator('a[href*="/teams/"]');
    const teamNames = teamData.locator('.MuiTypography-root.MuiTypography-p4');
    const teamAName = await teamNames.first().textContent();
    const teamBName = await teamNames.last().textContent();
    console.log(`Team A: ${teamAName}, Team B: ${teamBName}`);

    // Finish
    await context.close();
    await browser.close();
})();