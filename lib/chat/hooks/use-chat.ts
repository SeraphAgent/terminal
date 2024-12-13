'use client'

import { convertImageFileToBase64 } from '@/lib/utils'
import { useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { APIService } from '../api-service'
import { ChatMessage, ChatState } from '../types'

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    type: 'output',
    content: 'Initializing Seraph Neural Interface...',
    timestamp: Date.now(),
  },
  {
    type: 'output',
    content: 'Connected to Virtuals Protocol.',
    timestamp: Date.now() + 1,
  },
  {
    type: 'output',
    content: 'Ready for interaction. Type a message to begin.',
    timestamp: Date.now() + 2,
  },
  {
    type: 'output',
    content: 'Upload an image to analyze it.',
    timestamp: Date.now() + 3,
  },
]

export function useChat() {
  const [state, setState] = useState<ChatState>({
    messages: INITIAL_MESSAGES,
    isLoading: false,
    error: null,
  })

  const { address } = useAccount()

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return

      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            type: 'input',
            content: message,
            timestamp: Date.now(),
          },
        ],
        isLoading: true,
        error: null,
      }))

      try {
        const response = await APIService.sendMessage(address, message)
        const cleanedResponse = response.replace(/(?:undefined: )+/g, '')

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: 'output',
              content: cleanedResponse,
              timestamp: Date.now(),
            },
          ],
          isLoading: false,
        }))
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: 'output',
              content: `Error: ${errorMessage}. Please try again.`,
              timestamp: Date.now(),
            },
          ],
          isLoading: false,
          error: errorMessage,
        }))
      }
    },
    [address]
  )

  const sendImage = useCallback(
    async (file: File) => {
      if (!file) return

      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            type: 'input',
            content: `detect ${file.name}`,
            timestamp: Date.now(),
          },
        ],
        isLoading: true,
        error: null,
      }))

      try {
        const base64Image = await convertImageFileToBase64(file)
        const response = await APIService.detectImage(address, base64Image)
        const cleanedResponse = response.replace(/(?:undefined: )+/g, '')

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: 'output',
              content: cleanedResponse,
              timestamp: Date.now(),
            },
          ],
          isLoading: false,
        }))
      } catch (error) {
        console.error('Image upload error:', error)
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred'

        setState((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              type: 'output',
              content: `Error: ${errorMessage}. Please try again.`,
              timestamp: Date.now(),
            },
          ],
          isLoading: false,
          error: errorMessage,
        }))
      }
    },
    [address]
  )

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    sendImage,
  }
}
