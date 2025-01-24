'use client'

import {
  seraphContractConfig,
  seraphStakingV1Config,
  seraphStakingV2Config
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
  const { data: rawStakedV1Balance, isLoading: isStakedV1BalanceLoading } =
    useReadContract({
      ...seraphStakingV1Config,
      functionName: 'balanceOf',
      args: [address],
      query: {
        refetchInterval: 10000
      }
    })
  const stakedV1Balance = rawStakedV1Balance
    ? BigInt(rawStakedV1Balance.toString())
    : BigInt(0)

  // Fetch staked SERAPH balance
  const { data: rawStakedV2Balance, isLoading: isStakedV2BalanceLoading } =
    useReadContract({
      ...seraphStakingV2Config,
      functionName: 'balanceOf',
      args: [address],
      query: {
        refetchInterval: 10000
      }
    })
  const stakedV2Balance = rawStakedV2Balance
    ? BigInt(rawStakedV2Balance.toString())
    : BigInt(0)

  const isAuth =
    isConnected &&
    isSignedIn &&
    (balance > BigInt(100 * 1e18) ||
      stakedV1Balance + stakedV2Balance > BigInt(100 * 1e18))

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
      !isStakedV1BalanceLoading &&
      !isStakedV2BalanceLoading &&
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
