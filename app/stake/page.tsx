'use client'

import StakingDashboard from '@/components/staking/StakingDashboard'
import { seraphStakingConfig } from '@/constants/contract-config'
import { useState } from 'react'

export default function Staking() {
  const [activeTab, setActiveTab] = useState<'v1' | 'v2'>('v1')

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center font-mono text-4xl font-bold text-green-500">
        Staking Dashboard
      </h1>

      <div className="mb-8 flex justify-center space-x-4">
        <button
          onClick={() => setActiveTab('v1')}
          className={`rounded-lg border px-6 py-2 font-mono transition ${
            activeTab === 'v1'
              ? 'border-green-500 bg-green-500/20 text-green-400'
              : 'border-green-500/30 text-green-400/50 hover:border-green-500/50 hover:text-green-400'
          }`}
        >
          V1
        </button>
        <button
          onClick={() => setActiveTab('v2')}
          className={`rounded-lg border px-6 py-2 font-mono transition ${
            activeTab === 'v2'
              ? 'border-green-500 bg-green-500/20 text-green-400'
              : 'border-green-500/30 text-green-400/50 hover:border-green-500/50 hover:text-green-400'
          }`}
        >
          V2
        </button>
      </div>

      {activeTab == 'v1' ? (
        <StakingDashboard stakingConfig={seraphStakingConfig} />
      ) : (
        <div className="mb-6 rounded-lg border border-green-500/30 bg-black/50 p-12 text-center font-mono text-green-400 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold text-green-300">
            🚀 Staking V2
          </h2>
          <p className="text-lg text-green-400/80">
            Next generation staking platform
          </p>
          <div className="mt-8 animate-pulse text-3xl">Coming Tomorrow...</div>
          <div className="mt-6 text-sm text-green-500/50">
            (See ya tomorrow!)
          </div>
        </div>
      )}
    </div>
  )
}
