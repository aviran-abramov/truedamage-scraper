import { Page } from "playwright";
import { closePage, launchPage } from "../lib/browser";

// TODOS

// 1.
// Check if 0m means 1h 0m or just 1h in upcoming time

// 2.
// Loop pages to load urls, stop when link.time does not show live | time and does not have the letter d

const baseUrl = "https://gosugamers.net";
const matchesUrl = "https://www.gosugamers.net/counterstrike/matches";

export default async function scrapeMatchLinks() {
  // Initialize
  const { browser, context, page } = await launchPage(matchesUrl);

  const urls: string[] = [];

  let currentPageNumber = 1;

  while (true) {
    const currentPage = await loadPageMatchLinks(page);
    urls.push(...currentPage.urls);

    if (currentPage.shouldStop) {
      break;
    }

    currentPageNumber++;
    await goToNextPage(page, currentPageNumber)
  }


  await closePage(context, browser);

  if (urls.length === 0) {
    console.log(`No upcoming matches found within 24 hours`);
    return [];
  }

  console.log(`Match links extracted. ${urls.length} matches found.`);

  return urls;
}

async function loadPageMatchLinks(page: Page) {
  // Wait till page fully loads
  const matchListIndicator = page.locator("span.MuiTypography-p3").first();
  await matchListIndicator.waitFor();

  const matchesContainer = page
    .locator("div[role='tabpanel']")
    .locator("a.MuiCardActionArea-root");

  const matchLocatorArr = await matchesContainer.all();

  const allMatchesData = (
    await Promise.all(
      matchLocatorArr.map(async (match) => {
        const url = `${baseUrl}${await match.getAttribute("href")}`;
        const time = await match
          .locator("p.MuiTypography-body1")
          .last()
          .textContent();

        return { url, time };
      })
    )
  );

  const validUrls = allMatchesData
    .filter((match) => match.time?.includes("h") && match.time?.includes("m"))
    .map((match) => match.url);

  const shouldStop = allMatchesData.some(match => match.time?.includes("d"));

  return {
    urls: validUrls,
    shouldStop
  }
};

async function goToNextPage(page: Page, pageNumber: number) {
  const pagination = page.locator("nav[aria-label='pagination navigation']");
  const nextPageButton = pagination.locator(`button[aria-label="Go to page ${pageNumber}"]`);

  const currentUrl = page.url();
  await nextPageButton.click();
  await page.waitForFunction((url) => window.location.href !== url, currentUrl);
  await page.waitForTimeout(2000)
}
