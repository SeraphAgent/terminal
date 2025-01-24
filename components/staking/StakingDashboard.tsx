'use client'

import { ClaimButton } from '@/components/web3/ClaimButton'
import { StakeButton } from '@/components/web3/StakeButton'
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
  const { data: rawStaked } = useReadContract({
    ...stakingConfig,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 3000
    }
  })
  const stakedTokens = rawStaked ? Math.floor(Number(rawStaked) / 1e18) : 0

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

  // Fetch stakingCap
  const { data: rawStakingCap } = useReadContract({
    ...stakingConfig,
    functionName: 'stakingCap',
    query: {
      refetchInterval: 3000
    }
  })
  const stakingCap = rawStakingCap
    ? Math.floor(Number(rawStakingCap) / 1e18)
    : 0

  const [stakeAmount, setStakeAmount] = useState<number>(0)

  const handleSliderChange = (percentage: number) => {
    setStakeAmount(Math.floor((balance * percentage) / 100)) // Floor the calculated amount
  }

  const handleInputChange = (value: string) => {
    const parsedValue = Math.floor(Number(value)) // Ensure only integers
    setStakeAmount(parsedValue >= 0 ? parsedValue : 0)
  }

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

  const isExceedsStakingCap = totalSupply + stakeAmount > stakingCap
  const isExceedsBalance = stakeAmount > balance

  return (
    <div>
      {/* Balance and Rewards Section (Horizontal Stack) */}
      <div className="mb-6 flex space-x-4">
        {/* Balance Section */}
        <div className="flex-1 rounded-lg border border-green-500/30 bg-black/50 p-6 text-center font-mono text-green-400 backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-bold text-green-400">Balance</h2>
          {/* Increased bottom margin */}
          <p className="mb-6 text-2xl font-bold text-green-300">
            {balance} SERAPH
          </p>
          {/* Added bottom margin */}
          <div className="mt-8">
            {/* Increased top margin */}
            <h2 className="mb-4 text-xl font-bold text-green-400">Pool</h2>
            <p className="mb-6 text-lg font-bold text-green-300">
              {totalSupply} / {stakingCap} SERAPH
            </p>
            {/* Added bottom margin */}
            <div className="relative mt-4 h-4 w-full rounded-full bg-green-500/20">
              <div
                className="absolute left-0 top-0 h-4 rounded-full bg-green-400"
                style={{ width: `${(totalSupply / stakingCap) * 100}%` }}
              ></div>
            </div>
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
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              {/* Input Field */}
              <input
                id="stakeAmount"
                type="number"
                min="0"
                max={balance.toString()} // Use floored balance
                value={stakeAmount || ''}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-full rounded-lg border border-green-500 bg-black/70 px-4 py-2 font-mono text-green-400 outline-none focus:border-green-300 sm:flex-1"
              />
              {/* Buttons - Grid on Mobile */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2 sm:space-y-0">
                {[25, 50, 75, 100].map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handleSliderChange(percentage)}
                    className="rounded-lg border border-green-500 bg-green-500/20 px-3 py-2 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>
          </div>
          <StakeButton
            stakingConfig={stakingConfig}
            amount={stakeAmount}
            isDisabled={isExceedsStakingCap || isExceedsBalance}
          />
          {isExceedsStakingCap ? (
            <p className="mt-2 text-sm text-red-500">Exceeds staking cap</p>
          ) : isExceedsBalance ? (
            <p className="mt-2 text-sm text-red-500">Exceeds your balance</p>
          ) : null}
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
          amount={stakedTokens}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  )
}
