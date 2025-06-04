'use client'

import { ClaimButton } from '@/components/web3/ClaimButton'
import { UnstakeButton } from '@/components/web3/UnstakeButton'
import {
  seraphContractConfig,
  tensorPlexStakedTaoConfig
} from '@/constants/contract-config'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export default function StakingDashboard({
  stakingConfig
}: {
  stakingConfig: any
}) {
  const { address } = useAccount()

  // Fetch the token balance
  const { data: rawBalance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 3000
    }
  })
  const balance = rawBalance ? Math.floor(Number(rawBalance) / 1e18) : 0

  // Fetch the staked tokens
  const { data: rawStakedTokens } = useReadContract({
    ...stakingConfig,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 3000
    }
  })
  const stakedTokens = rawStakedTokens
    ? Math.floor(Number(rawStakedTokens) / 1e18)
    : 0

  // Fetch rewards in SERAPH
  const { data: rawSeraphRewards } = useReadContract({
    ...stakingConfig,
    functionName: 'calculateRewardsEarned',
    args: [address, seraphContractConfig.address],
    query: {
      refetchInterval: 3000
    }
  })
  const seraphRewards = rawSeraphRewards
    ? Math.floor(Number(rawSeraphRewards) / 1e18)
    : 0

  // Fetch rewards in stTAO
  const { data: rawTaoRewards } = useReadContract({
    ...stakingConfig,
    functionName: 'calculateRewardsEarned',
    args: [address, tensorPlexStakedTaoConfig.address],
    query: {
      refetchInterval: 3000
    }
  })
  const taoRewards = rawTaoRewards ? Number(rawTaoRewards) / 1e9 : 0

  // Fetch lock end time
  const { data: rawLockEndTime } = useReadContract({
    ...stakingConfig,
    functionName: 'lockEndTime',
    args: [address],
    query: {
      refetchInterval: 3000
    }
  })
  const lockEndTime = rawLockEndTime ? Number(rawLockEndTime) : 0

  // Fetch totalSupply
  const { data: rawTotalSupply } = useReadContract({
    ...stakingConfig,
    functionName: 'totalSupply',
    query: {
      refetchInterval: 3000
    }
  })
  const totalSupply = rawTotalSupply
    ? Math.floor(Number(rawTotalSupply) / 1e18)
    : 0

  // State to track time left
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Calculate the time left
  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentTime = Math.floor(Date.now() / 1000)
      setTimeLeft(lockEndTime > currentTime ? lockEndTime - currentTime : 0)
    }

    // Initial calculation
    calculateTimeLeft()

    // Update every minute
    const interval = setInterval(calculateTimeLeft, 30000)

    // Cleanup on unmount
    return () => clearInterval(interval)
  }, [lockEndTime])

  // Format the time left into a human-readable format
  const formatTimeLeft = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${days}d ${hours}h ${minutes}m`
  }

  return (
    <div>
      {/* Balance and Rewards Section (Horizontal Stack) */}
      <div className="mb-6 flex space-x-4">
        {/* Balance Section */}
        <div className="flex-1 rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-bold text-green-400">Balance</h2>
          <p className="mb-6 text-2xl font-bold text-green-300">
            {balance} SERAPH
          </p>
          <div className="mt-8">
            <h2 className="mb-6 text-xl font-bold text-green-400">
              Total Staked
            </h2>
            <p className="mb-6 text-2xl font-bold text-green-300">
              {totalSupply} SERAPH
            </p>
          </div>
        </div>

        {/* Rewards Section */}
        <div className="flex-1 rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-bold text-green-400">Rewards</h2>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-green-300">
                {seraphRewards}
              </p>
              <p className="text-sm font-bold text-green-400">SERAPH</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-300">{taoRewards}</p>
              <p className="text-sm font-bold text-green-400">stTAO</p>
            </div>
          </div>
          <div className="mt-6">
            <ClaimButton
              stakingConfig={stakingConfig}
              taoRewards={taoRewards}
              seraphRewards={seraphRewards}
            />
          </div>
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
        <UnstakeButton
          stakingConfig={stakingConfig}
          amount={rawStakedTokens as bigint}
          timeLeft={timeLeft}
        />
        
        {/* Migration Message */}
        <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 backdrop-blur-sm">
          <p className="font-mono text-sm text-yellow-400">
            ⚠️ Seraph Staking is migrating to Virtuals
          </p>
        </div>
      </div>
    </div>
  )
}
