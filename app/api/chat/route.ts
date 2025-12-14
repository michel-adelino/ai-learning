import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const XANO_API_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "";
const AUTH_TOKEN_COOKIE = "xano_auth_token";

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || "",
});

const SYSTEM_PROMPT = `You are an expert AI learning assistant for an online education platform. Your role is to:

1. Help students understand course concepts and topics
2. Answer questions about programming, web development, and technology
3. Provide clear, concise explanations with code examples when helpful
4. Encourage learning and guide students to discover answers themselves
5. Be friendly, supportive, and patient

Keep responses focused and educational. Use markdown formatting for code blocks and lists.`;

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (!authToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // First verify user has Ultra plan
    const userResponse = await fetch(`${XANO_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!userResponse.ok) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await userResponse.json();

    if (user.tier !== "ultra") {
      return new NextResponse("Ultra membership required", { status: 403 });
    }

    const { messages } = await request.json();

    // Format messages for Gemini
    const formattedMessages = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })
    );

    // Call Gemini 2.5 Flash
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    const text = response.text || "I'm sorry, I couldn't generate a response.";

    // Return response in format expected by the UI
    return NextResponse.json({
      role: "assistant",
      content: text,
    });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "Internal server error",
      { status: 500 }
    );
  }
}
