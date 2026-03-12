import "dotenv/config";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export class GoogleSheet {
  public readonly auth_email: string;
  public readonly auth_key: string;
  public readonly spreadsheet_id: string;
  public readonly spreadsheet_tab_id: string;

  constructor() {
    this.auth_email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
    this.auth_key = process.env.GOOGLE_PRIVATE_KEY!;
    this.spreadsheet_id = process.env.GOOGLE_SPREADSHEET_ID!;
    this.spreadsheet_tab_id = process.env.GOOGLE_SHEET_ID!;
  }

  public async loadSheet() {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID!, serviceAccountAuth)
    await doc.loadInfo();

    return doc.sheetsById[Number(this.spreadsheet_tab_id)];
  }
}