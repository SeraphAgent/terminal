"use client";

import { useState, useCallback } from 'react';
import { APIService } from '../api-service';
import { ChatMessage, ChatState } from '../types';
import { useWalletConnection } from '@/lib/web3/hooks/use-wallet-connection';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    type: "output",
    content: "Initializing Seraph Neural Interface...",
    timestamp: Date.now()
  },
  {
    type: "output",
    content: "Connected to Virtuals Protocol.",
    timestamp: Date.now() + 1
  },
  {
    type: "output",
    content: 'Ready for interaction. Type a message to begin.',
    timestamp: Date.now() + 2
  }
];

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: INITIAL_MESSAGES,
    isLoading: false,
    error: null
  });
  
  const { address } = useWalletConnection();

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, {
        type: 'input',
        content: message,
        timestamp: Date.now()
      }],
      isLoading: true,
      error: null
    }));

    try {
      console.log('Sending message:', message);
      const response = await APIService.sendMessage(address, message);
      console.log('Received response:', response);
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          type: 'output',
          content: response,
          timestamp: Date.now()
        }],
        isLoading: false
      }));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          type: 'output',
          content: `Error: ${errorMessage}. Please try again.`,
          timestamp: Date.now()
        }],
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [address]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage
  };
}