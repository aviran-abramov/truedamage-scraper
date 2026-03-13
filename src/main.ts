import scrapeMatch from "./scrape/match";
import scrapeMatchLinks from "./scrape/matchLinks";

async function main() {
  const urls = await scrapeMatchLinks();
  const first = await scrapeMatch(urls[0]);
  console.log(first);
}
main();
