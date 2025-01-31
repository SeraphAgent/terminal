import { seraphContractConfig } from '@/constants/contract-config'
import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

export function StakeButton({
  stakingConfig,
  amount,
  isDisabled
}: {
  amount: number
  isDisabled: boolean
  stakingConfig: any
}) {
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash
    })

  const { address } = useAccount()

  const [error, setError] = useState<string | null>(null)
  const [requiresApproval, setRequiresApproval] = useState(false)

  const { data: rawAllowance, refetch: refetchAllowance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'allowance',
    args: [address, stakingConfig.address]
  })
  const allowance = rawAllowance ? Number(rawAllowance) / 1e18 : 0

  useEffect(() => {
    refetchAllowance()
  }, [isConfirmed])

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
        args: [stakingConfig.address, BigInt(amount * 1e18)]
      })
    } catch (err: any) {
      setError(err.message || 'Approval failed')
    }
  }

  const handleStake = async () => {
    setError(null)

    try {
      await writeContract({
        abi: stakingConfig.abi,
        address: stakingConfig.address,
        functionName: 'stake',
        args: [BigInt(new BigNumber(amount).multipliedBy(1e18).toFixed())]
      })
    } catch (err: any) {
      setError(err.message || 'Staking failed')
    }
  }

  const isLoading = isPending || isConfirming

  const buttonText = isLoading ? (
    <span className="animate-pulse">Processing...</span>
  ) : requiresApproval ? (
    'Approve'
  ) : (
    'Stake'
  )

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
        disabled={isLoading || amount <= 0 || isDisabled}
        className="w-full rounded-lg border border-green-500 bg-green-500/20 py-2 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300 disabled:opacity-50"
      >
        {buttonText}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
