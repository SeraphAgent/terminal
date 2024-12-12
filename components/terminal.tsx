'use client'

import { useChat } from '@/lib/chat/hooks/use-chat'
import { useEffect, useRef, useState } from 'react'
import { ChatInput } from './chat/input'
import { ChatMessage } from './chat/message'

export function Terminal() {
  const { messages, isLoading, sendMessage, sendImage } = useChat()
  const [input, setInput] = useState('')
  const terminalEndRef = useRef<HTMLDivElement>(null)
  const [analyzingDots, setAnalyzingDots] = useState('')

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
    <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto font-mono text-sm mb-4 terminal-scroll">
        {messages.map((message, i) => (
          <ChatMessage key={`${message.timestamp}-${i}`} message={message} />
        ))}
        {isLoading && (
          <div className="text-green-500 font-mono animate-pulse">
            Analyzing{analyzingDots}
          </div>
        )}
        <div ref={terminalEndRef} />
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
