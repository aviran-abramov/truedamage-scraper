export interface Team {
  name: string;
  countryCode: string;
  rank: number;
}

export interface Format {
  bestOf: string;
  status: string;
  date: string;
  time: string;
}

export interface Match {
  pushDate: string;
  teamAName: string;
  teamBName: string;
  tournament: string;
  bestOf: string | number;
  status: string;
  date: string;
  time: string;
  teamACountryCode: string;
  teamBCountryCode: string;
  teamARank: string | number;
  teamBRank: string | number;
  scores: string[];
}

export type ScrapeMatchResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
