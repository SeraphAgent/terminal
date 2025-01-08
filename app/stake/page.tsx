'use client'

import {
  seraphContractConfig,
  seraphStakingConfig
} from '@/constants/contract-config'
import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'

export default function Staking() {
  const { address } = useAccount()

  // Fetch the token balance
  const { data: rawBalance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address]
  })
  const balance = rawBalance ? Number(rawBalance) / 1e18 : 0

  // Fetch the staked tokens
  const { data: rawStaked } = useReadContract({
    ...seraphStakingConfig,
    functionName: 'balanceOf',
    args: [address]
  })
  const stakedTokens = rawStaked ? Number(rawStaked) / 1e18 : 0

  // Fetch the rewards
  const { data: rawRewards } = useReadContract({
    ...seraphStakingConfig,
    functionName: 'rewards',
    args: [address]
  })
  const rewards = rawRewards ? Number(rawRewards) / 1e18 : 0

  // Fetch lock end time
  const { data: rawLockEndTime } = useReadContract({
    ...seraphStakingConfig,
    functionName: 'lockEndTime',
    args: [address]
  })
  const lockEndTime = rawLockEndTime ? Number(rawLockEndTime) : 0

  const [stakeAmount, setStakeAmount] = useState<number>(0)

  // Write contract for staking
  const { writeContract: stakeTokens, isPending: isStaking } =
    useWriteContract()

  // Write contract for unstaking
  const { writeContract: unstakeTokens, isPending: isUnstaking } =
    useWriteContract()

  // Write contract for claiming rewards
  const { writeContract: claimRewards, isPending: isClaiming } =
    useWriteContract()

  const handleSliderChange = (percentage: number) => {
    setStakeAmount((balance * percentage) / 100)
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

      {/* Balance Section */}
      <div className="mb-6 rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
        <h2 className="mb-2 text-xl font-bold text-green-400">Balance</h2>
        <p className="text-2xl font-bold text-green-300">
          {balance.toFixed(2)} SERAPH
        </p>
      </div>

      {/* Stake Section */}
      <div className="mb-6 rounded-lg border border-green-500/30 bg-black/50 p-6 backdrop-blur-sm">
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
                max={balance.toString()}
                value={stakeAmount || ''}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
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
          <button
            onClick={() => {}}
            disabled={!stakeTokens || isStaking}
            className="w-full rounded-lg border border-green-500 bg-green-500/20 py-2 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300 disabled:opacity-50"
          >
            {isStaking ? 'Staking...' : 'Stake'}
          </button>
        </div>
      </div>

      {/* Unstake Section */}
      <div className="mb-6 rounded-lg border border-green-500/30 bg-black/50 p-6 backdrop-blur-sm">
        <p className="mb-4 text-center font-mono text-green-300">
          Currently Staked:{' '}
          <span className="font-bold">{stakedTokens.toFixed(2)} SERAPH</span>
        </p>
        {timeLeft > 0 ? (
          <p className="mb-4 text-center font-mono text-green-300">
            Unlocks in:{' '}
            <span className="font-bold">{formatTimeLeft(timeLeft)}</span>
          </p>
        ) : null}
        <button
          onClick={() => {}}
          disabled={stakedTokens === 0 || timeLeft > 0 || isUnstaking}
          className="w-full rounded-lg border border-green-500 bg-green-500/20 py-2 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300 disabled:opacity-50"
        >
          {isUnstaking ? 'Unstaking...' : 'Unstake'}
        </button>
      </div>

      {/* Rewards Section */}
      <div className="rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
        <h2 className="mb-4 text-center text-xl font-bold text-green-400">
          Rewards
        </h2>
        <p className="text-2xl font-bold text-green-300">
          {rewards.toFixed(2)} stTAO
        </p>
        <button
          onClick={() => {}}
          disabled={!claimRewards || isClaiming}
          className="mt-4 w-full rounded-lg border border-green-500 bg-green-500/20 py-2 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300 disabled:opacity-50"
        >
          {isClaiming ? 'Claiming...' : 'Claim Rewards'}
        </button>
      </div>
    </div>
  )
}
