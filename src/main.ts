import scrapeMatch from "./scrape/match";
import scrapeMatchLinks from "./scrape/matchLinks";

const matchUrl =
  "https://www.gosugamers.net/dota2/tournaments/62605-fissure-universe-episode-8/matches/639158-aurora-gaming-vs-1w-team";

async function main() {
  // await scrapeMatch(matchUrl);
  const urls = await scrapeMatchLinks();
  console.log(urls);
}
main();
