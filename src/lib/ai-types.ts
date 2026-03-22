export interface AICar {
  make: string;
  model: string;
  year: number;
  priceRange: string; // e.g. "$35,000–$42,000"
  bodyStyle: string;
  engine: string;
  mpg?: string;       // e.g. "28/35"
  range?: string;     // e.g. "330 miles" for EVs
  horsepower: number;
  passengers: number;
  drivetrain: string;
  highlights: string[];      // 3–5 bullet points
  matchReason: string;       // 1–2 sentences explaining why this matches
  pros: string[];
  cons: string[];
  manufacturerUrl: string;
  carsComUrl: string;
  carGurusUrl: string;
}

export interface AISearchResult {
  query: string;
  interpretation: string;   // Claude's understanding of the query
  cars: AICar[];
  totalFound: number;
  searchSuggestions?: string[]; // follow-up queries user might try
}

export interface AIMatchResult {
  summary: string;            // personalized summary of the user's profile
  topPicks: AICar[];          // 3–6 top matches
  alternativePicks: AICar[];  // 2–3 budget/wildcard alternatives
  advice: string;             // 2–3 sentences of personalized car-buying advice
}

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatResult {
  reply: string;
  suggestions?: string[]; // follow-up questions the user might ask
}
