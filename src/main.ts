import { chromium } from "playwright";

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
