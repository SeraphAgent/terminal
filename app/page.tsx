'use client'

import { Terminal } from '@/components/terminal'
import { seraphContractConfig } from '@/constants/contract-config'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  const { address, isConnected } = useAccount()

  const { data: rawBalance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address],
  })
  const balance = rawBalance ? BigInt(rawBalance.toString()) : BigInt(0)

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1000)
  }, [])

  return (
    <main className="relative">
      <div
        className={`transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-mono font-bold mb-2 glitch-text">
              SERAPH TERMINAL
            </h1>
            <p className="text-green-400 font-mono">
              Neural Consensus Interface v1.0
            </p>
          </header>
          {isConnected && balance > BigInt(0) && <Terminal />}
          {isConnected && balance <= BigInt(0) && (
            <div className="text-center text-green-500 font-mono mt-8">
              You need to be a $SERAPH holder to access the terminal.
            </div>
          )}
          {!isConnected && (
            <div className="text-center text-green-500 font-mono mt-8">
              Please connect your wallet to access the terminal.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
