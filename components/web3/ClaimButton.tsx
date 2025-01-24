import {
  seraphContractConfig,
  seraphStakingV1Config,
  tensorPlexStakedTaoConfig
} from '@/constants/contract-config'
import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

export function ClaimButton({
  stakingConfig,
  taoRewards,
  seraphRewards
}: {
  stakingConfig: any
  taoRewards: number
  seraphRewards: number
}) {
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash
  })

  const [error, setError] = useState<string | null>(null)

  const rewardAddresses = [
    tensorPlexStakedTaoConfig.address,
    seraphContractConfig.address
  ]
  const isV1 = stakingConfig.address === seraphStakingV1Config.address

  const handleClaim = async () => {
    setError(null)

    try {
      await writeContract({
        abi: stakingConfig.abi,
        address: stakingConfig.address,
        functionName: 'claim',
        args: isV1 ? [] : [tensorPlexStakedTaoConfig.address, rewardAddresses]
      })
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    }
  }

  const isLoading = isPending || isConfirming

  return (
    <div className="mt-4">
      <button
        onClick={handleClaim}
        disabled={isLoading || (taoRewards === 0 && seraphRewards === 0)}
        className="w-full rounded-lg border border-green-500 bg-green-700/30 px-4 py-2 font-mono text-lg font-bold text-green-400 shadow-lg transition duration-300 hover:bg-green-500 hover:text-green-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <span className="animate-pulse">Claiming...</span>
        ) : (
          'Claim'
        )}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
