import { seraphStakingConfig } from '@/constants/contract-config'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'

export function UnstakeButton({
  amount,
  timeLeft
}: {
  amount: number
  timeLeft: number
}) {
  const { writeContract, isPending } = useWriteContract()

  const [error, setError] = useState<string | null>(null)

  const handleUnstake = async () => {
    if (timeLeft > 0) {
      setError('Tokens are still locked.')
      return
    }

    setError(null)

    try {
      await writeContract({
        abi: seraphStakingConfig.abi,
        address: seraphStakingConfig.address,
        functionName: 'unstake',
        args: [BigInt(amount * 1e18)]
      })
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    }
  }

  return (
    <div>
      <button
        onClick={handleUnstake}
        disabled={isPending || amount === 0 || timeLeft > 0}
        className="w-full rounded-lg border border-green-500 bg-green-500/20 py-2 font-mono text-green-400 transition hover:bg-green-400/20 hover:text-green-300 disabled:opacity-50"
      >
        {isPending ? 'Unstaking...' : 'Unstake'}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}
