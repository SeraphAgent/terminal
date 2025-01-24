import { useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

export function UnstakeButton({
  stakingConfig,
  amount,
  timeLeft
}: {
  stakingConfig: any
  amount: number
  timeLeft: number
}) {
  const { data: hash, writeContract, isPending } = useWriteContract()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash
  })

  const [error, setError] = useState<string | null>(null)

  const handleUnstake = async () => {
    if (timeLeft > 0) {
      setError('Tokens are still locked.')
      return
    }

    setError(null)

    try {
      await writeContract({
        abi: stakingConfig.abi,
        address: stakingConfig.address,
        functionName: 'unstake',
        args: [BigInt(amount * 1e18)]
      })
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    }
  }

  const isLoading = isPending || isConfirming

  return (
    <div>
      <button
        onClick={handleUnstake}
        disabled={isLoading || amount === 0 || timeLeft > 0}
        className="w-full rounded-lg border border-green-500 bg-green-500/20 py-2 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300 disabled:opacity-50"
      >
        {isPending ? (
          <span className="animate-pulse">Unstaking...</span>
        ) : (
          'Unstake'
        )}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
