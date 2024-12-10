import { VIRTUALS_CONFIG } from "@/lib/chat/config";
import { ConversationResponse, AccessTokenResponse } from "@/lib/chat/types";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { userAddress, message } = await request.json();

    if (!userAddress || !message) {
      return Response.json(
        { error: "User address and message are required" },
        { status: 400 }
      );
    }

    const tokenRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": VIRTUALS_CONFIG.API_KEY,
      },
      body: JSON.stringify({
        data: {
          userUid: userAddress,
          virtualUid: VIRTUALS_CONFIG.VIRTUAL_UID,
        },
      }),
    };

    const tokenResponse = await fetch(
      `${VIRTUALS_CONFIG.BASE_URL}/api/accesses/tokens`,
      tokenRequestOptions
    );

    if (!tokenResponse.ok) {
      console.error("Token Error:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
      });
      return Response.json(
        { error: "Failed to get access token" },
        { status: tokenResponse.status }
      );
    }

    const tokenData: AccessTokenResponse = await tokenResponse.json();
    const accessToken = tokenData.data.accessToken;

    const messageRequestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        data: {
          useCaseId: "roleplay",
          text: message,
          opponent: userAddress,
          additionalContext:
            "Seraph is a decentralized neural consensus system.",
        },
      }),
    };

    const messageResponse = await fetch(
      VIRTUALS_CONFIG.CONVERSATION_URL,
      messageRequestOptions
    );

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error("Virtuals API Error:", {
        status: messageResponse.status,
        statusText: messageResponse.statusText,
        body: errorText,
      });
      return Response.json(
        { error: `Failed to send message: ${messageResponse.statusText}` },
        { status: messageResponse.status }
      );
    }

    const data: ConversationResponse = await messageResponse.json();
    return Response.json(data);
  } catch (error) {
    console.error("Message route error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
