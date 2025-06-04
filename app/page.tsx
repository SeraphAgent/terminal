'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1000)
  }, [])

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <div
        className={`transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 text-center">
          {/* Main mysterious UI */}
          <div className="space-y-8">
            {/* SERAPH V2 Title */}
            <div className="space-y-4">
              <h1 className="glitch-text font-mono text-6xl font-bold text-green-500 md:text-8xl">
                SERAPH V2
              </h1>
              <div className="animate-pulse">
                <p className="font-mono text-2xl text-green-400 md:text-3xl">
                  Coming Soon!
                </p>
              </div>
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <p className="font-mono text-xl text-green-300 md:text-2xl">
                The Ultimate Bittensor Agent
              </p>
            </div>

            {/* Powered by */}
            <div className="pt-8">
              <p className="font-mono text-lg text-green-400/70">
                Powered by <span className="text-green-400 font-bold">BitMind</span>
              </p>
            </div>

            {/* Mysterious elements */}
            <div className="pt-12 space-y-4">
              <div className="flex justify-center space-x-8 font-mono text-sm text-green-500/50">
                <span className="animate-pulse">[INITIALIZING...]</span>
                <span className="animate-pulse delay-300">[NEURAL SYNC...]</span>
                <span className="animate-pulse delay-500">[CONSENSUS...]</span>
              </div>
              
              <div className="border border-green-500/30 rounded-lg bg-black/50 backdrop-blur-sm p-6 max-w-2xl mx-auto">
                <div className="space-y-2 font-mono text-sm text-green-400/80">
                  <p className="text-center">━━━ CLASSIFIED INTELLIGENCE NETWORK ━━━</p>
                  <p className="text-center text-xs text-green-500/60">
                    Next-generation autonomous agent framework
                  </p>
                  <div className="flex justify-center pt-4">
                    <div className="w-32 h-1 bg-green-500/20 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-green-500/0 via-green-500 to-green-500/0 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
