import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AISearchResult } from "@/lib/ai-types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert automotive advisor for CarFect Match, a premium car matching platform. Your job is to interpret natural language car search queries and return highly relevant vehicle recommendations.

When given a search query, respond ONLY with a valid JSON object matching this exact structure:
{
  "query": "<the original query>",
  "interpretation": "<1 sentence: what you understood the user to be looking for>",
  "cars": [
    {
      "make": "Toyota",
      "model": "Camry XSE",
      "year": 2024,
      "priceRange": "$28,000–$35,000",
      "bodyStyle": "Sedan",
      "engine": "2.5L 4-cylinder",
      "mpg": "28/39",
      "horsepower": 203,
      "passengers": 5,
      "drivetrain": "FWD",
      "highlights": ["Refined cabin", "Strong resale value", "Apple CarPlay/Android Auto"],
      "matchReason": "Ideal daily commuter with excellent fuel economy and a refined interior that fits comfortably within budget.",
      "pros": ["Excellent reliability", "Comfortable ride", "Strong fuel economy"],
      "cons": ["Not the most exciting to drive", "Trunk slightly smaller than rivals"],
      "manufacturerUrl": "https://www.toyota.com/camry",
      "carsComUrl": "https://www.cars.com/shopping/results/?keyword=2024+Toyota+Camry",
      "carGurusUrl": "https://www.cargurus.com/Cars/new/nl?zip=&sourceContext=carGurusHomePageModel&trim=&mileage=&sortDir=ASC&action=search&types[]=new&makes[]=Toyota&models[]=Camry"
    }
  ],
  "totalFound": 4,
  "searchSuggestions": ["luxury SUV under $60k", "hybrid sedan with AWD"]
}

Rules:
- Return 3–6 cars per search, always ranked by relevance
- Include a mix of makes/styles unless query is very specific
- Use REAL, accurate 2024/2025 model specs from your knowledge
- priceRange should be realistic MSRP ranges
- mpg format: "city/highway" e.g. "28/35" (omit for EVs, use range instead)
- range format for EVs: "310 miles"
- manufacturerUrl: the official brand/model page URL
- carsComUrl: https://www.cars.com/shopping/results/?keyword=<year+make+model URL-encoded>
- carGurusUrl: https://www.cargurus.com/Cars/new/nl?zip=&types[]=new&makes[]=<Make>
- highlights: 3–5 short feature bullet points
- pros/cons: 3 items each
- ONLY output JSON, no markdown, no explanation`;

// Simple in-memory cache for common searches
const cache = new Map<string, { result: AISearchResult; ts: number }>();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body as { query: string };

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) {
      return NextResponse.json({ error: "query too short" }, { status: 400 });
    }

    // Check cache
    const cached = cache.get(trimmed);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.result);
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: query }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    let result: AISearchResult;
    try {
      result = JSON.parse(textBlock.text);
    } catch {
      // Attempt to extract JSON if there's extra text
      const match = textBlock.text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse JSON from response");
      result = JSON.parse(match[0]);
    }

    // Store in cache
    cache.set(trimmed, { result, ts: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limit reached. Please try again in a moment." }, { status: 429 });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "API configuration error." }, { status: 500 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "AI service unavailable. Please try again." }, { status: 503 });
    }
    console.error("ai-search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
