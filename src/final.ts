import { chromium, type Locator } from 'playwright';

const MATCH_URL = "https://www.gosugamers.net/counterstrike/tournaments/62664-cct-season-3-european-series-16/matches/640993-prime-vs-hyperspirit";

async function extractTeamData(teamContainer: Locator) {
    const name = await teamContainer
        .locator('.MuiTypography-root.MuiTypography-p4')
        .textContent();

    const countryCode = await teamContainer
        .locator('img')
        .last()
        .getAttribute('alt');

    const rankText = await teamContainer
        .getByText('World Ranking')
        .textContent();
    const rank = rankText?.split(":")[1].trim() ?? null;

    return { name, countryCode, rank };
}

async function extractMatchDateTime(page: import('playwright').Page) {
    const dateTimeText = await page
        .locator('span.MuiTypography-root.MuiTypography-p2')
        .filter({ hasText: /\d{2}\s\w{3}\s\d{4}/ })
        .textContent();

    const parts = dateTimeText?.split(',');
    if (!parts) return { date: null, time: null };

    return {
        date: parts[0],
        time: parts[1].trim(),
    };
}

async function scrapeMatch(url: string) {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(url);

        const teamContainers = page.locator('a[href*="/teams/"]');
        const teamA = await extractTeamData(teamContainers.first());
        const teamB = await extractTeamData(teamContainers.last());

        const bestOfText = await page.getByText('Best of').textContent();
        const bestOf = Number(bestOfText?.slice(-1));

        const { date, time } = await extractMatchDateTime(page);

        const tournament = await page
            .locator('h1.MuiTypography-t2')
            .locator('a.MuiTypography-inherit')
            .textContent();

        const matchData = {
            teamA,
            teamB,
            bestOf,
            date,
            time,
            tournament,
        };

        console.log(matchData);
    } finally {
        await context.close();
        await browser.close();
    }
}

scrapeMatch(MATCH_URL);
