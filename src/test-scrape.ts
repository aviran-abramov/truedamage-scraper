import { chromium } from 'playwright';

const MATCH_URL = "https://www.gosugamers.net/counterstrike/tournaments/62664-cct-season-3-european-series-16/matches/640993-prime-vs-hyperspirit";

const launchPage = async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    return { browser, context, page }
}

(async () => {
    // Initializing
    const { browser, context, page } = await launchPage();

    // Main content
    // Match page
    await page.goto(MATCH_URL);

    // Today's date
    const dateToday = new Date().toLocaleDateString();
    console.log(`Date of today: ${dateToday}`);

    // Teams Data
    const teamContainers = page.locator('a[href*="/teams/"]');
    const teamNames = teamContainers.locator('.MuiTypography-root.MuiTypography-p4');

    const teamANameFinal = await teamNames.first().textContent();
    console.log(`Team A Name: ${teamANameFinal}`); // Gentle Mates

    const teamBNameFinal = await teamNames.last().textContent();
    console.log(`Team B Name: ${teamBNameFinal}`);

    // Best of Data
    const bestOfText = await page.getByText('Best of').textContent();
    const bestOfFinal = Number(bestOfText?.slice(-1));
    console.log(`Best of: ${bestOfFinal}`);

    // Date, time data
    const dateTimeText = await page
        .locator('span.MuiTypography-root.MuiTypography-p2')
        .filter({ hasText: /\d{2}\s\w{3}\s\d{4}/ })
        .textContent();
    const dateTimeArr = dateTimeText?.split(',');
    let dateFinal, timeFinal;
    if (dateTimeArr) {
        dateFinal = dateTimeArr[0];
        timeFinal = dateTimeArr[1].trim();
    }
    console.log(`Date: ${dateFinal}`);
    console.log(`Time: ${timeFinal}`);

    // Country data
    const teamACountryCodeFinal = await teamContainers
        .first()
        .locator('img')
        .last()
        .getAttribute('alt');
    console.log(`Team A Country Code: ${teamACountryCodeFinal}`);

    const teamBCountryCodeFinal = await teamContainers
        .last()
        .locator('img')
        .last()
        .getAttribute('alt');
    console.log(`Team B Country Code: ${teamBCountryCodeFinal}`);

    // Ranks
    const teamARank = await teamContainers
        .first()
        .getByText('World Ranking')
        .textContent();
    const teamARankFinal = teamARank
        ?.split(":")[1]
        .trim();
    console.log(`Team A Rank: ${teamARankFinal}`);

    const teamBRank = await teamContainers
        .last()
        .getByText('World Ranking')
        .textContent();
    const teamBRankFinal = teamBRank
        ?.split(":")[1]
        .trim();
    console.log(`Team B Rank: ${teamBRankFinal}`);

    // Tournament name
    const matchTitle = page.locator('h1.MuiTypography-t2');
    const tournamentNameFinal = await matchTitle.locator('a.MuiTypography-inherit').textContent();
    console.log(`Tournament: ${tournamentNameFinal}`);


    // Finish
    await context.close();
    await browser.close();
})();