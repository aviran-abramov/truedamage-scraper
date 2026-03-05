import { launchPage } from "./lib/browser";

// Goals
// 1. Go to https://www.gosugamers.net/matches
// 2. Extract links
// 4. Get games with time left & time is less than 1 day
// 5. Add rows to the Google SpreadSheet
// 6. Go to the next page and repeat 4,5 if needed

const baseUrl = "https://gosugamers.net";
const matchesUrl = "https://www.gosugamers.net/matches";

export async function scrapeMatchLinks() {
  // Initialize
  const { browser, context, page } = await launchPage(matchesUrl);

  const matchListIndicator = page.locator('span.MuiTypography-p3').first();
  await matchListIndicator.waitFor();

  const matchesContainer = page.locator("div[role='tabpanel']").locator('a.MuiCardActionArea-root');

  const linkLocatorArr = await matchesContainer.all();

  for (const link of linkLocatorArr) {
    console.log(`${baseUrl}${await link.getAttribute('href')}`);
  }

  // Finish
  await context.close();
  await browser.close();
}
