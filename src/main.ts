import { scrapeMatch } from "./scrapeMatch";
import { scrapeMatchLinks } from "./scrapeMatchLinks";

const matchUrl =
  "https://www.gosugamers.net/dota2/tournaments/62605-fissure-universe-episode-8/matches/639158-aurora-gaming-vs-1w-team";

async function main() {
  // await scrapeMatch(matchUrl);
  await scrapeMatchLinks();
}
main();
