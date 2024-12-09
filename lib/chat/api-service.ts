import { VIRTUALS_CONFIG } from './config';
import { ConversationResponse, APIError } from './types';

export class APIService {
  static async sendMessage(userAddress: string | undefined, message: string): Promise<string> {
    try {
      if (!VIRTUALS_CONFIG.ACCESS_TOKEN) {
        throw new APIError('Access token is not configured');
      }

      const response = await fetch(VIRTUALS_CONFIG.CONVERSATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${VIRTUALS_CONFIG.ACCESS_TOKEN}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        },
        mode: 'cors',
        body: JSON.stringify({
          data: {
            useCaseId: 'roleplay',
            text: message,
            opponent: userAddress || 'test-user',
            additionalContext: 'Seraph is a decentralized neural consensus system.'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new APIError(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.response) {
        return data.response;
      } else if (data.text) {
        return data.text;
      } else {
        throw new APIError('Invalid response format from API');
      }
    } catch (error) {
      console.error('Message error:', error);
      throw error;
    }
  }
}