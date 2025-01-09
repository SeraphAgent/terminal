'use client'

import { ClaimButton } from '@/components/web3/ClaimButton'
import { StakeButton } from '@/components/web3/StakeButton'
import { UnstakeButton } from '@/components/web3/UnstakeButton'
import {
  seraphContractConfig,
  seraphStakingConfig
} from '@/constants/contract-config'
import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export default function Staking() {
  const { address } = useAccount()

  // Fetch the token balance
  const { data: rawBalance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address]
  })
  const balance = rawBalance ? Math.floor(Number(rawBalance) / 1e18) : 0

  // Fetch the staked tokens
  const { data: rawStaked } = useReadContract({
    ...seraphStakingConfig,
    functionName: 'balanceOf',
    args: [address]
  })
  const stakedTokens = rawStaked ? Math.floor(Number(rawStaked) / 1e18) : 0

  // Fetch the rewards
  const { data: rawRewards } = useReadContract({
    ...seraphStakingConfig,
    functionName: 'rewards',
    args: [address]
  })
  const rewards = rawRewards ? Math.floor(Number(rawRewards) / 1e18) : 0

  // Fetch lock end time
  const { data: rawLockEndTime } = useReadContract({
    ...seraphStakingConfig,
    functionName: 'lockEndTime',
    args: [address]
  })
  const lockEndTime = rawLockEndTime ? Number(rawLockEndTime) : 0

  const [stakeAmount, setStakeAmount] = useState<number>(0)

  const handleSliderChange = (percentage: number) => {
    setStakeAmount(Math.floor((balance * percentage) / 100)) // Floor the calculated amount
  }

  const handleInputChange = (value: string) => {
    const parsedValue = Math.floor(Number(value)) // Ensure only integers
    setStakeAmount(parsedValue >= 0 ? parsedValue : 0)
  }

  // Calculate time left for unlock
  const currentTime = Math.floor(Date.now() / 1000)
  const timeLeft = lockEndTime > currentTime ? lockEndTime - currentTime : 0

  // Format the time left into a human-readable format
  const formatTimeLeft = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-center font-mono text-4xl font-bold text-green-500">
        Staking Dashboard
      </h1>

      {/* Balance and Rewards Section (Horizontal Stack) */}
      <div className="mb-6 flex space-x-4">
        {/* Balance Section */}
        <div className="flex-1 rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-bold text-green-400">Balance</h2>
          <p className="text-2xl font-bold text-green-300">{balance} SERAPH</p>
        </div>

        {/* Rewards Section */}
        <div className="flex-1 rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-bold text-green-400">Rewards</h2>
          <p className="mb-4 text-2xl font-bold text-green-300">
            {rewards} stTAO
          </p>
          <ClaimButton />
        </div>
      </div>

      {/* Stake Section */}
      <div className="mb-6 rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold text-green-400">Stake</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="stakeAmount"
              className="mb-2 block font-mono text-green-400"
            >
              Enter Amount:
            </label>
            <div className="flex items-center space-x-4">
              <input
                id="stakeAmount"
                type="number"
                min="0"
                max={balance.toString()} // Use floored balance
                value={stakeAmount || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                className="flex-1 rounded-lg border border-green-500 bg-black/70 px-4 py-2 font-mono text-green-400 outline-none focus:border-green-300"
              />
              <div className="flex space-x-2">
                {[25, 50, 75, 100].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handleSliderChange(percentage)}
                    className="rounded-lg border border-green-500 bg-green-500/20 px-3 py-1 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>
          </div>
          <StakeButton amount={stakeAmount} />
        </div>
      </div>

      {/* Unstake Section */}
      <div className="mb-6 rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
        <h2 className="mb-4 text-xl font-bold text-green-400">Unstake</h2>
        <p className="mb-4 text-green-300">
          Currently Staked:{' '}
          <span className="font-bold">{stakedTokens} SERAPH</span>
        </p>
        {timeLeft > 0 ? (
          <p className="mb-4 text-green-300">
            Unlocks in:{' '}
            <span className="font-bold">{formatTimeLeft(timeLeft)}</span>
          </p>
        ) : null}
        <UnstakeButton amount={stakedTokens} timeLeft={timeLeft} />
      </div>
    </div>
  )
}
