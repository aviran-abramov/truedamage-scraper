import { chromium } from 'playwright';

(async () => {
    // Initializing
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Main content
    // Match page
    await page.goto("https://www.gosugamers.net/counterstrike/tournaments/62664-cct-season-3-european-series-16/matches/640993-prime-vs-hyperspirit");


    // Teams Data
    const teamContainers = page.locator('a[href*="/teams/"]');
    const teamNames = teamContainers.locator('.MuiTypography-root.MuiTypography-p4');

    const teamAName = await teamNames.first().textContent();
    console.log(`Team A: ${teamAName}`); // Gentle Mates

    const teamBName = await teamNames.last().textContent();
    console.log(`Team B: ${teamBName}`);

    // Best of Data
    const bestOfText = await page.getByText('Best of').textContent();
    const bestOf = Number(bestOfText?.slice(-1));
    console.log(`Best of ${bestOf}`);


    // Finish
    await context.close();
    await browser.close();
})();