'use client'

import { Terminal } from '@/components/terminal'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1000)
  }, [])

  const { isConnected, isSignedIn, balance } = useAuth()

  return (
    <main className="relative">
      <div
        className={`transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="glitch-text mb-2 font-mono text-4xl font-bold">
              SERAPH TERMINAL
            </h1>
            <p className="font-mono text-green-400">
              Neural Consensus Interface v0.0.7
            </p>
          </header>
          {isConnected && isSignedIn && balance > BigInt(0) && <Terminal />}
          {isConnected && isSignedIn && balance <= BigInt(0) && (
            <div className="mt-8 text-center font-mono text-green-500">
              You need to have at least 100 $SERAPH tokens in your wallet to
              access the terminal.
            </div>
          )}
          {isConnected && !isSignedIn && (
            <div className="mt-8 text-center font-mono text-green-500">
              Please sign in with your wallet to access the terminal.
            </div>
          )}
          {!isConnected && (
            <div className="mt-8 text-center font-mono text-green-500">
              Please connect your wallet to access the terminal.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
