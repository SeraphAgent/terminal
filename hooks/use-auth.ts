'use client'

import { seraphContractConfig } from '@/constants/contract-config'
import { useSIWE } from 'connectkit'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()

  const { isConnected, isConnecting, address } = useAccount()
  const { isSignedIn } = useSIWE()

  const { data: rawBalance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address]
  })
  const balance = rawBalance ? BigInt(rawBalance.toString()) : BigInt(0)

  const isAuth = isConnected && isSignedIn && balance > BigInt(100 * 1e18)

  useEffect(() => {
    // Only redirect if not on home page and not connected
    if (!isConnecting && !isAuth && pathname !== '/') {
      router.push('/')
    }
  }, [isConnected, pathname, router])

  return { isConnected, isSignedIn, isAuth, address, balance }
}
