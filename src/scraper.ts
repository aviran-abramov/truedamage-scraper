import { chromium, Locator, Page } from "playwright";

const MATCH_URL =
  "https://www.gosugamers.net/lol/tournaments/62568-lol-japan-league-ljl-2026-winter/matches/642422-l-guide-gaming-vs-new-meta";

const launchPage = async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  return { browser, context, page };
};

interface Team {
  name: string;
  countryCode: string;
  rank: string;
}

async function extractTeamData(teamContainers: Locator): Promise<Team[]> {
  // Team Containers
  const teamAContainer = teamContainers.first();
  const teamBContainer = teamContainers.last();

  // Team names
  const teamAName = await teamAContainer
    .locator(".MuiTypography-p4")
    .textContent();
  const teamBName = await teamBContainer
    .locator(".MuiTypography-p4")
    .textContent();

  // Country data
  const teamACountryCode = await teamContainers
    .first()
    .locator("img")
    .last()
    .getAttribute("alt");

  const teamBCountryCode = await teamContainers
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

  return [
    {
      name: teamAName || "NOT_FOUND",
      countryCode: teamACountryCode || "NOT_FOUND",
      rank: teamARankFinal || "NOT_FOUND",
    },
    {
      name: teamBName || "NOT_FOUND",
      countryCode: teamBCountryCode || "NOT_FOUND",
      rank: teamBRankFinal || "NOT_FOUND",
    },
  ];
}

interface Format {
  bestOf: string;
  status: string;
  date: string;
  time: string;
}

async function extractMatchFormat(page: Page): Promise<Format> {
  // Containers
  const matchPreviewContainer = page
    .locator(".MuiCard-root")
    .filter({ hasText: "Live Score" });
  const vsContainer = matchPreviewContainer.locator(".MuiGrid-grid-lg-3");

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

  const dateFinal = dateTimeArr?.[0] ?? "NOT FOUND";
  const timeFinal = dateTimeArr?.[1]?.trim() ?? "NOT FOUND";

  return {
    bestOf: bestOf || "NOT FOUND",
    status: status || "NOT FOUND",
    date: dateFinal,
    time: timeFinal
  }
}

interface Match {
  pushDate: string,
  teamAName: string,
  teamBName: string,
  tournament: string,
  bestOf: string | number,
  status: string,
  date: string,
  time: string,
  teamACountryCode: string,
  teamBCountryCode: string,
  teamARank: string | number,
  teamBRank: string | number,
}

type ScrapeMatchResult<T> =
  | { success: true, data: T }
  | { success: false, error: string }

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
    const vsContainer = matchPreviewContainer.locator(".MuiGrid-grid-lg-3");

    // Push date
    const pushDate = new Date().toLocaleDateString();

    // Tournament name
    const matchTitle = page.locator("h1.MuiTypography-t2");
    const tournamentNameFinal = await matchTitle
      .locator("a.MuiTypography-inherit")
      .textContent();

    const teamsData = await extractTeamData(teamContainers);
    const matchFormatData = await extractMatchFormat(page);

    const matchData = {
      pushDate,
      teamAName: teamsData[0].name,
      teamBName: teamsData[1].name,
      tournament: tournamentNameFinal,
      bestOf: matchFormatData.bestOf,
      status: matchFormatData.status,
      date: matchFormatData.date,
      time: matchFormatData.time,
      teamACountryCode: teamsData[0].countryCode,
      teamBCountryCode: teamsData[1].countryCode,
      teamARank: teamsData[0].rank,
      teamBRank: teamsData[1].rank,
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
