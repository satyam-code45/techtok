import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import type {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionAssistantMessageParam,
} from 'openai/resources';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables.");
}

const client = new OpenAI({ apiKey });

export async function POST(request: Request) {
  try {
    const { history, message } = await request.json() as {
      history: { role: "user" | "model"; text: string }[];
      message: string;
    };

    // Type messages as ChatCompletionMessageParam[]
    const messages: ChatCompletionMessageParam[] = [
      ...history.map((m): ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam => ({
        role: m.role === "model" ? "assistant" : "user", 
        content: m.text,
      })),
      {
        role: "user",
        content: message,
      },
    ];

    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
    });

    const resp = completion.choices[0].message.content;
    console.log({resp});
    
    return NextResponse.json({ resp });
  } catch (e) {
    console.error("API /chat error:", e);
    return NextResponse.json(
      { error: "Could not generate reply." },
      { status: 500 }
    );
  }
}
