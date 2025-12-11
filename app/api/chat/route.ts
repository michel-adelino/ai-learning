import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const XANO_API_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "";
const AUTH_TOKEN_COOKIE = "xano_auth_token";

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

    // Call Xano AI chat endpoint
    const aiResponse = await fetch(`${XANO_API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!aiResponse.ok) {
      const error = await aiResponse.text();
      return new NextResponse(error, { status: aiResponse.status });
    }

    const data = await aiResponse.json();

    // Return response in format expected by the UI
    return NextResponse.json({
      role: "assistant",
      content: data.message,
      sources: data.sources || [],
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
