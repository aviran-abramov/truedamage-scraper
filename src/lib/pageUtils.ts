import { Page } from "playwright";

export async function scrollDown(
  page: Page,
  repeat: number = 1,
  delay: number = 1000
) {
  for (let i = 0; i < repeat; i++) {
    await page.waitForTimeout(delay);
    await page.keyboard.press("Space");
  }
}
