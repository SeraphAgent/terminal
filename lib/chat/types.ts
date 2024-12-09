export interface AccessTokenResponse {
  data: {
    accessToken: string;
  };
}

export interface ChatMessage {
  type: 'input' | 'output';
  content: string;
  timestamp: number;
}

export interface ConversationResponse {
  response: string;
}