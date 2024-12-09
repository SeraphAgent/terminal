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

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export class APIError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'APIError';
  }
}