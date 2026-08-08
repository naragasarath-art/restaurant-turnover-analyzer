import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      instructions:
        "You are a helpful assistant for a Restaurant Monthly Turnover Analyzer. Answer questions clearly and simply.",
      input: message,
    });

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to get AI response" },
      { status: 500 }
    );
  }
}