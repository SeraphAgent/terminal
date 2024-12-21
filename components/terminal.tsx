'use client'

import { useChat } from '@/lib/chat/hooks/use-chat'
import { useEffect, useState } from 'react'
import { ChatInput } from './chat/input'
import { ChatMessage } from './chat/message'

export function Terminal() {
  const { messages, isLoading, sendMessage, sendImage } = useChat()
  const [input, setInput] = useState('')
  const [analyzingDots, setAnalyzingDots] = useState('')

  useEffect(() => {
    if (!isLoading) return
    const interval = setInterval(() => {
      setAnalyzingDots((prev) => (prev.length < 3 ? prev + '.' : ''))
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input.trim())
    setInput('')
  }

  const handleImageSelect = (file: File) => {
    if (isLoading) return
    sendImage(file)
  }

  return (
    <div className="flex h-[600px] flex-col rounded-lg border border-green-500/30 bg-black/50 p-4 backdrop-blur-sm">
      <div className="terminal-scroll mb-4 flex-1 overflow-y-auto font-mono text-sm">
        {messages.map((message, i) => (
          <ChatMessage key={`${message.timestamp}-${i}`} message={message} />
        ))}
        {isLoading && (
          <div className="animate-pulse font-mono text-green-500">
            Analyzing{analyzingDots}
          </div>
        )}
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onImageSelect={handleImageSelect}
        isLoading={isLoading}
      />
    </div>
  )
}
