import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AIChatResult } from "@/lib/ai-types";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carMake, carModel, carYear, messages } = body as {
      carMake: string;
      carModel: string;
      carYear: number;
      messages: { role: "user" | "assistant"; content: string }[];
    };

    if (!carMake || !carModel || !messages?.length) {
      return NextResponse.json({ error: "carMake, carModel, and messages are required" }, { status: 400 });
    }

    const systemPrompt = `You are an expert automotive advisor embedded on the ${carYear} ${carMake} ${carModel} detail page of CarFect Match, a premium car shopping platform.

Your role is to answer questions specifically about this vehicle and help the user decide if it's right for them. You have deep knowledge about:
- The ${carYear} ${carMake} ${carModel}'s specs, features, trim levels, and options
- How it compares to rivals (e.g., common alternatives in its segment)
- Real ownership costs, reliability, insurance, and maintenance
- Who this vehicle is best suited for
- Any known issues or recalls
- Best trims and packages for different needs
- Negotiation tips and typical dealer discounts

Be conversational, honest, and genuinely helpful. If you're unsure about something, say so.
Keep responses concise (2–4 sentences typically) unless a detailed answer is clearly needed.

After your reply, optionally suggest 2–3 follow-up questions the user might find helpful.

Respond ONLY with a JSON object:
{
  "reply": "<your conversational response>",
  "suggestions": ["What trim level should I choose?", "How does it compare to the <rival>?"]
}`;

    // Build conversation messages for Claude
    const claudeMessages: Anthropic.MessageParam[] = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: claudeMessages,
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    let result: AIChatResult;
    try {
      result = JSON.parse(textBlock.text);
    } catch {
      const match = textBlock.text.match(/\{[\s\S]*\}/);
      if (!match) {
        // Fallback: treat the whole response as a plain reply
        result = { reply: textBlock.text };
      } else {
        result = JSON.parse(match[0]);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "Rate limit reached. Please try again." }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "AI service unavailable." }, { status: 503 });
    }
    console.error("ai-chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
