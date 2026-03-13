import { Page } from "playwright";
import { MatchInfo, Match, ScrapeMatchResult, Team } from "../lib/types";
import { closePage, launchPage } from "../lib/browser";
import { scrollDown } from "../lib/pageUtils";

export default async function scrapeMatch(
  matchUrl: string
): Promise<ScrapeMatchResult<Match>> {
  try {
    const { browser, context, page } = await launchPage(matchUrl);

    const teamsData = await extractTeamData(page);
    const matchFormatData = await extractMatchInfo(page);

    await scrollDown(page, 4, 1000);
    const scores = await extractCommonMatchesScores(page);

    const matchData = {
      teamAName: teamsData[0].name,
      teamBName: teamsData[1].name,
      tournament: matchFormatData.tournament,
      bestOf: matchFormatData.bestOf,
      status: matchFormatData.status,
      date: matchFormatData.date,
      time: matchFormatData.time,
      teamACountryCode: teamsData[0].countryCode,
      teamBCountryCode: teamsData[1].countryCode,
      teamARank: teamsData[0].rank || "NOT FOUND",
      teamBRank: teamsData[1].rank || "NOT FOUND",
      scores,
    };

    await closePage(context, browser);

    return {
      success: true,
      data: matchData,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "ERROR",
    };
  }
}

async function extractTeamData(page: Page): Promise<Team[]> {
  const teamContainers = page.locator('a[href*="/teams/"]');

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
  const teamARankFinal = Number(teamARank?.split(":")[1].trim());

  const teamBRank = await teamContainers
    .last()
    .getByText("World Ranking")
    .textContent();
  const teamBRankFinal = Number(teamBRank?.split(":")[1].trim());

  return [
    {
      name: teamAName || "NOT_FOUND",
      countryCode: teamACountryCode || "NOT_FOUND",
      rank: teamARankFinal,
    },
    {
      name: teamBName || "NOT_FOUND",
      countryCode: teamBCountryCode || "NOT_FOUND",
      rank: teamBRankFinal,
    },
  ];
}

async function extractMatchInfo(page: Page): Promise<MatchInfo> {
  // Containers
  const matchPreviewContainer = page
    .locator(".MuiCard-root")
    .filter({ hasText: "Live Score" });
  const vsContainer = matchPreviewContainer.locator(".MuiGrid-grid-lg-3");

  // Tournament name
  const matchTitle = page.locator("h1.MuiTypography-t2");
  const tournamentNameFinal =
    (await matchTitle.locator("a.MuiTypography-inherit").textContent()) ||
    "NOT FOUND";

  // Best of
  const bestOfData =
    (await vsContainer.locator(".MuiTypography-p3").textContent()) ||
    "NOT FOUND";
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
    tournament: tournamentNameFinal || "NOT FOUND",
    bestOf: bestOf || "NOT FOUND",
    status: status || "NOT FOUND",
    date: dateFinal,
    time: timeFinal,
  };
}

async function extractCommonMatchesScores(page: Page): Promise<string[]> {
  const commonMatchLiArr = page
    .locator("span.MuiTypography-t3")
    .filter({ hasText: "Encounters" })
    .locator("xpath=following-sibling::*[1]")
    .locator("li");

  const scores: string[] = [];
  for (const item of await commonMatchLiArr.all()) {
    const matchInfo = item
      .locator(".MuiGrid-grid-xs-12")
      .nth(1)
      .locator(".MuiTypography-p5");

    const teamAScore = await matchInfo.first().textContent();
    const teamBScore = await matchInfo.last().textContent();

    scores.push(`${teamAScore}:${teamBScore}`);
  }

  return scores;
}