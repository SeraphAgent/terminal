import { seraphStakingConfig } from '@/constants/contract-config'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'

export function ClaimButton() {
  const { writeContract, isPending } = useWriteContract()

  const [error, setError] = useState<string | null>(null)

  const handleClaim = async () => {
    setError(null)

    try {
      await writeContract({
        abi: seraphStakingConfig.abi,
        address: seraphStakingConfig.address,
        functionName: 'claim',
        args: []
      })
    } catch (err: any) {
      setError(err.message || 'Transaction failed')
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleClaim}
        disabled={isPending}
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
