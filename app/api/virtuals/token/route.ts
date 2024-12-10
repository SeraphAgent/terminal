import { VIRTUALS_CONFIG } from "@/lib/chat/config";
import { AccessTokenResponse } from "@/lib/chat/types";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { userAddress } = await request.json();

    if (!userAddress) {
      return Response.json(
        { error: "User address is required" },
        { status: 400 }
      );
    }

    const apiUrl = `${VIRTUALS_CONFIG.BASE_URL}/api/accesses/tokens`;

    const requestBody = {
      data: {
        userUid: userAddress,
        virtualUid: VIRTUALS_CONFIG.VIRTUAL_UID,
      },
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": VIRTUALS_CONFIG.API_KEY,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return Response.json(
        { error: `Failed to get access token: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data: AccessTokenResponse = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
