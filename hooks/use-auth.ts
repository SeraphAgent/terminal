'use client'

import {
  seraphContractConfig,
  seraphStakingV1Config,
  seraphStakingV2Config
} from '@/constants/contract-config'
import { useAccount, useReadContract } from 'wagmi'

export function useAuth() {
  const { isConnected, isConnecting, address } = useAccount()

  // Fetch SERAPH balance (optional, for display purposes)
  const { data: rawBalance } = useReadContract({
    ...seraphContractConfig,
    functionName: 'balanceOf',
    args: [address],
    query: {
      refetchInterval: 10000
    }
  })
  const balance = rawBalance ? BigInt(rawBalance.toString()) : BigInt(0)

  // Fetch staked SERAPH balance V1
  const { data: rawStakedV1Balance } = useReadContract({
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

  // Fetch staked SERAPH balance V2
  const { data: rawStakedV2Balance } = useReadContract({
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

  return { 
    isConnected, 
    isConnecting, 
    address, 
    balance, 
    stakedV1Balance, 
    stakedV2Balance 
  }
}
