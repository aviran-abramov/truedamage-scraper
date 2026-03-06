import { Browser, BrowserContext, chromium } from "playwright";

export const launchPage = async (url: string) => {
  console.log("🟡 Connecting to Chromium browser...");
  const browser = await chromium.launch({ headless: false });
  console.log("🟢 Success!");
  console.log("🟡 Creating context and page...");
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);
  console.log("🟢 Success!");

  return { browser, context, page };
};

export const closePage = async (context: BrowserContext, browser: Browser) => {
  await context.close();
  await browser.close();
};
