'use client'

import { seraphContractConfig } from '@/constants/contract-config'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export function useAuth() {
  const router = useRouter()
  const pathname = usePathname()

  const { isConnected, address } = useAccount()

  const { data: rawBalance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address],
  })
  const balance = rawBalance ? BigInt(rawBalance.toString()) : BigInt(0)

  const isAuth = isConnected && balance > BigInt(0)

  useEffect(() => {
    // Only redirect if not on home page and not connected
    if (!isAuth && pathname !== '/') {
      router.push('/')
    }
  }, [isConnected, pathname, router])

  return { isConnected, isAuth, address, balance }
}
