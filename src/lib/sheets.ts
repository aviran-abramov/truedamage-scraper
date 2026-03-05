import "dotenv/config";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { Match } from "./types";

export async function useGoogleSheets(matchData: Match) {
  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SPREADSHEET_ID!,
    serviceAccountAuth
  );

  await doc.loadInfo();
  console.log(`🟢 Google Spreadsheet Loaded - ${doc.title}`);

  const sheet = doc.sheetsById[Number(process.env.GOOGLE_SHEET_ID)];
  await sheet.addRow({
    "Push Date": matchData.pushDate,
    "Team A Name": matchData.teamAName,
    "Team B Name": matchData.teamBName,
    Tournament: matchData.tournament,
    "Best Of": matchData.bestOf,
    Status: matchData.status,
    Date: matchData.date,
    Time: matchData.time,
    "Team A Country Code": matchData.teamACountryCode,
    "Team B Country Code": matchData.teamBCountryCode,
    "Team A Rank": matchData.teamARank,
    "Team B Rank": matchData.teamBRank,
    Scores: matchData.scores.join(", "),
  });
}
