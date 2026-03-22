import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AIMatchResult } from "@/lib/ai-types";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are an expert automotive advisor for CarFect Match. A user has completed a detailed preference quiz and you must match them to the best vehicles.

Given the user's quiz answers (JSON), respond ONLY with a valid JSON object matching this structure:
{
  "summary": "<2–3 sentences personally describing this buyer's profile and what they need in a car>",
  "topPicks": [
    {
      "make": "Toyota",
      "model": "RAV4 Prime",
      "year": 2024,
      "priceRange": "$43,000–$50,000",
      "bodyStyle": "SUV",
      "engine": "Plug-in Hybrid",
      "mpg": "38/35",
      "range": "42 miles electric",
      "horsepower": 302,
      "passengers": 5,
      "drivetrain": "AWD",
      "highlights": ["42-mile EV range", "AWD standard", "Spacious cargo area"],
      "matchReason": "Perfectly balances your need for AWD capability, green credentials, and family-sized space within your $55k budget.",
      "pros": ["Best-in-class EV range for PHEVs", "No range anxiety", "Strong resale value"],
      "cons": ["Long dealer waitlists", "Infotainment feels dated"],
      "manufacturerUrl": "https://www.toyota.com/rav4prime",
      "carsComUrl": "https://www.cars.com/shopping/results/?keyword=2024+Toyota+RAV4+Prime",
      "carGurusUrl": "https://www.cargurus.com/Cars/new/nl?zip=&types[]=new&makes[]=Toyota"
    }
  ],
  "alternativePicks": [
    {
      "make": "Honda",
      "model": "CR-V Hybrid",
      "year": 2024,
      "priceRange": "$35,000–$42,000",
      "bodyStyle": "SUV",
      "engine": "Hybrid",
      "mpg": "40/34",
      "horsepower": 204,
      "passengers": 5,
      "drivetrain": "AWD",
      "highlights": ["Exceptional fuel economy", "Honda reliability", "Roomy interior"],
      "matchReason": "A more budget-friendly alternative that still delivers hybrid efficiency and AWD capability.",
      "pros": ["Outstanding fuel economy", "Spacious rear seats", "Refined ride"],
      "cons": ["Less EV-only range", "Sportier alternatives available"],
      "manufacturerUrl": "https://www.honda.com/crv",
      "carsComUrl": "https://www.cars.com/shopping/results/?keyword=2024+Honda+CR-V+Hybrid",
      "carGurusUrl": "https://www.cargurus.com/Cars/new/nl?zip=&types[]=new&makes[]=Honda"
    }
  ],
  "advice": "<2–3 sentences of personalized, specific car-buying advice based on their answers. Mention specific features, financing tips, or timing advice relevant to their situation.>"
}

Quiz answer keys and what they mean:
- primaryUse: "daily" | "family" | "adventure" | "performance" | "luxury" | "utility"
- budget: "$20k–$30k" | "$30k–$45k" | "$45k–$65k" | "$65k–$90k" | "$90k+"
- bodyStyle: "sedan" | "suv" | "truck" | "coupe" | "convertible" | "van" | "any"
- passengers: "2" | "5" | "7+"
- engine: "gasoline" | "hybrid" | "plugin" | "electric" | "any"
- performance: "comfort" | "balanced" | "sporty" | "extreme"
- condition: "new" | "certified" | "used" | "any"
- origin: "american" | "european" | "japanese" | "korean" | "any"
- features: array of strings like ["AWD/4WD", "Sunroof", "Apple CarPlay"]

Rules:
- Return 3–5 topPicks ranked by match quality, 2–3 alternativePicks (budget-friendly or wildcard)
- Personalize matchReason specifically to their answers
- Use REAL 2024/2025 vehicle specs
- mpg omitted for pure EVs, use range instead; PHEVs can have both
- ONLY output JSON, no markdown fences, no explanation`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = body as { answers: Record<string, unknown> };

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ error: "answers object is required" }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 6000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Here are the user's quiz answers: ${JSON.stringify(answers, null, 2)}\n\nPlease match them to the best vehicles and return the JSON result.`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    let result: AIMatchResult;
    try {
      result = JSON.parse(textBlock.text);
    } catch {
      const match = textBlock.text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse JSON from response");
      result = JSON.parse(match[0]);
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limit reached. Please try again." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "AI service unavailable." }, { status: 503 });
    }
    console.error("ai-match error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
