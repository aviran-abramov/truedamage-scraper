import { chromium } from "playwright";

const MATCH_URL =
  "https://www.gosugamers.net/lol/tournaments/62568-lol-japan-league-ljl-2026-winter/matches/642422-l-guide-gaming-vs-new-meta";

const launchPage = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  return { browser, context, page };
};

async function scrapeMatch() {
  try {
    // Initializing
    const { browser, context, page } = await launchPage();

    // Main content
    // Match page
    await page.goto(MATCH_URL);

    // Containers
    const matchPreviewContainer = page
      .locator(".MuiCard-root")
      .filter({ hasText: "Live Score" });
    const teamContainers = page.locator('a[href*="/teams/"]');
    const teamAContainer = teamContainers.first();
    const vsContainer = matchPreviewContainer.locator(".MuiGrid-grid-lg-3");
    const teamBContainer = teamContainers.last();

    // Push date
    const pushDate = new Date().toLocaleDateString();

    // Team names
    const teamAName = await teamAContainer
      .locator(".MuiTypography-p4")
      .textContent();
    const teamBName = await teamBContainer
      .locator(".MuiTypography-p4")
      .textContent();

    // Best of
    const bestOfData = await vsContainer
      .locator(".MuiTypography-p3")
      .textContent();
    const bestOf = bestOfData?.slice(-1);

    // Status
    const status = await vsContainer
      .locator("p")
      .textContent({ timeout: 500 })
      .catch(() => "OTHER");

    // Date, time data
    const dateTimeText = await page
      .locator("span.MuiTypography-root.MuiTypography-p2")
      .filter({ hasText: /\d{2}\s\w{3}\s\d{4}/ })
      .textContent();
    const dateTimeArr = dateTimeText?.split(",");
    let dateFinal, timeFinal;
    if (dateTimeArr) {
      dateFinal = dateTimeArr[0];
      timeFinal = dateTimeArr[1].trim();
    }

    // Country data
    const teamACountryCodeFinal = await teamContainers
      .first()
      .locator("img")
      .last()
      .getAttribute("alt");

    const teamBCountryCodeFinal = await teamContainers
      .last()
      .locator("img")
      .last()
      .getAttribute("alt");

    // Ranks
    const teamARank = await teamContainers
      .first()
      .getByText("World Ranking")
      .textContent();
    const teamARankFinal = teamARank?.split(":")[1].trim();

    const teamBRank = await teamContainers
      .last()
      .getByText("World Ranking")
      .textContent();
    const teamBRankFinal = teamBRank?.split(":")[1].trim();

    // Tournament name
    const matchTitle = page.locator("h1.MuiTypography-t2");
    const tournamentNameFinal = await matchTitle
      .locator("a.MuiTypography-inherit")
      .textContent();

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
  } catch (error) {
    console.error(error);
  }
}
scrapeMatch();
