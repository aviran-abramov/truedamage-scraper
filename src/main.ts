import { chromium } from "playwright";
import { scrapeMatch } from "./scrapeMatch";

const launchPage = async (matchUrl: string) => {
  console.log("🟡 Connecting to Chromium browser...");
  const browser = await chromium.launch({ headless: false });
  console.log("🟢 Success!");
  console.log("🟡 Creating context and page...");
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(matchUrl);
  console.log("🟢 Success!");

  return { browser, context, page };
};

const matchUrl =
  "https://www.gosugamers.net/dota2/tournaments/62605-fissure-universe-episode-8/matches/639158-aurora-gaming-vs-1w-team";

async function main() {
  await scrapeMatch(matchUrl);
}
main();
