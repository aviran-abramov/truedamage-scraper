import { closePage, launchPage } from "../lib/browser";
import { scrollDown } from "../lib/pageUtils";

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

  const finalArr = matchesArr.map((match) => match?.url);

  const pagination = page.locator("nav[aria-label='pagination navigation']");
  const paginationNextPageButton = pagination.locator(
    "button[aria-label='Go to next page']"
  );

  scrollDown(page, 2, 1500);
  await paginationNextPageButton.click();
  await page.waitForLoadState("networkidle");

  // TODO: Check if 0m means 1h 0m or just 1h in upcoming time

  // Finish
  // await closePage(context, browser);

  // if (finalArr.length === 0) {
  //   return null;
  // }
  console.log(`Match links extracted. ${finalArr.length} matches found.`);

  // return finalArr;
}
