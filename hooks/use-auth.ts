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
  const { isSignedIn, isLoading: isSigningIn } = useSIWE()

  const { data: rawBalance, isLoading: isBalanceLoading } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 10000
    }
  })
  const balance = rawBalance ? BigInt(rawBalance.toString()) : BigInt(0)

  const isAuth = isConnected && isSignedIn && balance > BigInt(100 * 1e18)

  console.log(isConnecting, isSigningIn, isBalanceLoading)
  useEffect(() => {
    if (!isConnecting && !isSigningIn && !isBalanceLoading) {
      // Check only after all loading states are resolved
      if (!isConnected || !isSignedIn || !isAuth) {
        if (pathname !== '/') {
          router.push('/')
        }
      }
    }
  }, [
    isConnecting,
    isSigningIn,
    isBalanceLoading,
    isConnected,
    isSignedIn,
    isAuth,
    pathname,
    router
  ])

  return { isConnected, isSignedIn, isAuth, address, balance }
}
