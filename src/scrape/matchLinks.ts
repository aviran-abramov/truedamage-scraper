import { Page } from "playwright";
import { closePage, launchPage } from "../lib/browser";
import { scrollDown } from "../lib/pageUtils";

// TODOS

// 1.
// Check if 0m means 1h 0m or just 1h in upcoming time

// 2.
// Loop pages to load urls, stop when link.time does not show live | time and does not have the letter d

const baseUrl = "https://gosugamers.net";
const matchesUrl = "https://www.gosugamers.net/matches";

export async function scrapeMatchLinks() {
  // Initialize
  const { browser, context, page } = await launchPage(matchesUrl);

  const urls = await loadUrls(page);

  const pagination = page.locator("nav[aria-label='pagination navigation']");
  const paginationNextPageButton = pagination.locator(
    "button[aria-label='Go to next page']"
  );

  await scrollDown(page, 2, 1500);
  await paginationNextPageButton.click();
  // await page.waitForLoadState("networkidle"); worked and moved to page 2
  const matchListIndicator = page.locator("span.MuiTypography-p3").first();
  await matchListIndicator.waitFor();

  await closePage(context, browser);

  if (urls.length === 0) {
    console.log(`No upcoming matches found within 24 hours`);
    return null;
  }

  // Finish
  console.log(`Match links extracted. ${urls.length} matches found.`);

  return urls;
}

async function loadUrls(page: Page) {
  const matchListIndicator = page.locator("span.MuiTypography-p3").first();
  await matchListIndicator.waitFor();

  const matchesContainer = page
    .locator("div[role='tabpanel']")
    .locator("a.MuiCardActionArea-root");

  const matchLocatorArr = await matchesContainer.all();

  const matchesArr = (
    await Promise.all(
      matchLocatorArr.map(async (match) => {
        const url = `${baseUrl}${await match.getAttribute("href")}`;
        const time = await match
          .locator("p.MuiTypography-body1")
          .last()
          .textContent();
        const isTimeWithin24hours = time?.includes("h") && time?.includes("m");

        if (isTimeWithin24hours) {
          return { url, time };
        }
      })
    )
  ).filter(Boolean);

  return matchesArr.map((match) => match?.url);
};