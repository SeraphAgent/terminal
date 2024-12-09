import { VIRTUALS_CONFIG } from './config';
import { AccessTokenResponse, ConversationResponse } from './types';

export class VirtualsAPI {
  private static accessToken: string | null = null;
  private static tokenExpiryTime: number | null = null;

  private static async getAccessToken(userAddress: string): Promise<string> {
    // Check if token exists and is not expired (giving 1 minute buffer)
    const now = Date.now();
    if (this.accessToken && this.tokenExpiryTime && now < this.tokenExpiryTime - 60000) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${VIRTUALS_CONFIG.BASE_URL}/api/accesses/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': VIRTUALS_CONFIG.API_KEY,
        },
        body: JSON.stringify({
          data: {
            userUid: userAddress,
            virtualUid: VIRTUALS_CONFIG.VIRTUAL_UID
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data: AccessTokenResponse = await response.json();
      this.accessToken = data.data.accessToken;
      // Set token expiry to 30 minutes from now
      this.tokenExpiryTime = now + 30 * 60 * 1000;
      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  static async sendMessage(userAddress: string, message: string): Promise<string> {
    try {
      const accessToken = await this.getAccessToken(userAddress);

      const response = await fetch(VIRTUALS_CONFIG.CONVERSATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          data: {
            useCaseId: 'roleplay',
            text: message,
            opponent: userAddress,
            additionalContext: 'Seraph is a decentralized neural consensus system operating on the Bittensor network.'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data: ConversationResponse = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}