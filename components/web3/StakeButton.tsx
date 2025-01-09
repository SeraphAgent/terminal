import {
  seraphContractConfig,
  seraphStakingConfig
} from '@/constants/contract-config'
import { useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'

export function StakeButton({ amount }: { amount: number }) {
  const { writeContract, isPending } = useWriteContract()

  const { address } = useAccount()

  const [error, setError] = useState<string | null>(null)
  const [requiresApproval, setRequiresApproval] = useState(false)

  const { data: rawAllowance, refetch: refetchAllowance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'allowance',
    args: [address, seraphStakingConfig.address]
  })
  const allowance = rawAllowance ? Number(rawAllowance) / 1e18 : 0

  useEffect(() => {
    setRequiresApproval(allowance < amount)
  }, [allowance, amount])

  const handleApprove = async () => {
    setError(null)

    try {
      await writeContract({
        abi: seraphContractConfig.abi,
        address: seraphContractConfig.address,
        functionName: 'approve',
        args: [seraphStakingConfig.address, BigInt(amount * 1e18)]
      })
      await refetchAllowance()
    } catch (err: any) {
      setError(err.message || 'Approval failed')
    }
  }

  const handleStake = async () => {
    setError(null)

    try {
      await writeContract({
        abi: seraphStakingConfig.abi,
        address: seraphStakingConfig.address,
        functionName: 'stake',
        args: [BigInt(amount * 1e18)]
      })
    } catch (err: any) {
      setError(err.message || 'Staking failed')
    }
  }

  const buttonText = isPending
    ? 'Processing...'
    : requiresApproval
      ? 'Approve'
      : 'Stake'

  const handleClick = async () => {
    if (requiresApproval) {
      await handleApprove()
    } else {
      await handleStake()
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isPending || amount <= 0}
        className="w-full rounded-lg border border-green-500 bg-green-500/20 py-2 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300 disabled:opacity-50"
      >
        {buttonText}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
