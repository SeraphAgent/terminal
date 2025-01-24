'use client'

import {
  seraphContractConfig,
  seraphStakingV1Config
} from '@/constants/contract-config'
import { useSIWE } from 'connectkit'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()

  const { isConnected, isConnecting, address } = useAccount()
  const { isSignedIn, isLoading: isSigningIn } = useSIWE()

  // Fetch SERAPH balance
  const { data: rawBalance, isLoading: isBalanceLoading } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 10000
    }
  })
  const balance = rawBalance ? BigInt(rawBalance.toString()) : BigInt(0)

  // Fetch staked SERAPH balance
  const { data: rawStakedBalance, isLoading: isStakedBalanceLoading } =
    useReadContract({
      ...seraphStakingV1Config,
      functionName: 'balanceOf',
      args: [address],
      query: {
        refetchInterval: 10000
      }
    })
  const stakedBalance = rawStakedBalance
    ? BigInt(rawStakedBalance.toString())
    : BigInt(0)

  const isAuth =
    isConnected &&
    isSignedIn &&
    (balance > BigInt(100 * 1e18) || stakedBalance > BigInt(100 * 1e18))

  useEffect(() => {
    // Immediate redirect if not connected
    if (!isConnecting && !isConnected) {
      if (pathname !== '/') {
        router.push('/')
      }
      return
    }

    // Redirect if all other conditions fail
    if (
      !isConnecting &&
      isConnected &&
      !isSignedIn &&
      !isBalanceLoading &&
      !isStakedBalanceLoading &&
      (!isSignedIn || !isAuth)
    ) {
      if (pathname !== '/') {
        router.push('/')
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
