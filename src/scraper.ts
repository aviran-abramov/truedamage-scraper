import {chromium} from "playwright";

const MATCH_URL =
    "https://www.gosugamers.net/lol/tournaments/62568-lol-japan-league-ljl-2026-winter/matches/642422-l-guide-gaming-vs-new-meta";

const launchPage = async () => {
    const browser = await chromium.launch({headless: false});
    const context = await browser.newContext();
    const page = await context.newPage();

    return {browser, context, page};
};

async function scrapeMatch() {
    // Initializing
    const {browser, context, page} = await launchPage();

    // Main content
    // Match page
    await page.goto(MATCH_URL);

    // Containers
    const matchPreviewContainer = page
        .locator(".MuiCard-root")
        .filter({hasText: "Live Score"});
    const teamContainers = page.locator('a[href*="/teams/"]');
    const teamAContainer = teamContainers.first();
    const vsContainer = matchPreviewContainer.locator(".MuiGrid-grid-lg-3");
    const teamBContainer = teamContainers.last();

    // Push date
    const pushDate = new Date().toLocaleDateString();
    console.log(`Push date: ${pushDate}`);

    // Team names
    const teamAName = await teamAContainer
        .locator(".MuiTypography-p4")
        .textContent();
    console.log(`Team A Name: ${teamAName}`);
    const teamBName = await teamBContainer
        .locator(".MuiTypography-p4")
        .textContent();
    console.log(`Team B Name: ${teamBName}`);

    // Best of
    const bestOfData = await vsContainer
        .locator(".MuiTypography-p3")
        .textContent();
    const bestOf = bestOfData?.slice(-1);
    console.log(`Best of: ${bestOf}`);

    // Status
    const status = await vsContainer
        .locator("p")
        .textContent({timeout: 500})
        .catch(() => "OTHER");
    console.log(`Status: ${status}`);

    // Date, time data
    const dateTimeText = await page
        .locator("span.MuiTypography-root.MuiTypography-p2")
        .filter({hasText: /\d{2}\s\w{3}\s\d{4}/})
        .textContent();
    const dateTimeArr = dateTimeText?.split(",");
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
        .locator("img")
        .last()
        .getAttribute("alt");
    console.log(`Team A Country Code: ${teamACountryCodeFinal}`);

    const teamBCountryCodeFinal = await teamContainers
        .last()
        .locator("img")
        .last()
        .getAttribute("alt");
    console.log(`Team B Country Code: ${teamBCountryCodeFinal}`);

    // Ranks
    const teamARank = await teamContainers
        .first()
        .getByText("World Ranking")
        .textContent();
    const teamARankFinal = teamARank?.split(":")[1].trim();
    console.log(`Team A Rank: ${teamARankFinal}`);

    const teamBRank = await teamContainers
        .last()
        .getByText("World Ranking")
        .textContent();
    const teamBRankFinal = teamBRank?.split(":")[1].trim();
    console.log(`Team B Rank: ${teamBRankFinal}`);

    // Tournament name
    const matchTitle = page.locator("h1.MuiTypography-t2");
    const tournamentNameFinal = await matchTitle
        .locator("a.MuiTypography-inherit")
        .textContent();
    console.log(`Tournament: ${tournamentNameFinal}`);

    const matchData = {
        pushDate,
        teamAName,
        teamBName,
        bestOf,
        status,
        date: dateFinal,
        time: timeFinal,
        teamACountryCode: teamACountryCodeFinal,
        teamBCountryCode: teamBCountryCodeFinal,
        teamARank: teamARankFinal,
        teamBRank: teamBRankFinal,
    };

    console.log(matchData);

    // Finish
    await context.close();
    await browser.close();
}
scrapeMatch();
