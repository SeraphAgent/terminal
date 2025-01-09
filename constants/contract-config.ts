import seraphAbi from './abis/seraph-abi.json'
import seraphStakingAbi from './abis/seraph-staking-abi.json'

export const seraphContractConfig = {
  address: '0x4f81837C2f4A189A0B69370027cc2627d93785B4',
  abi: seraphAbi
} as const

export const seraphStakingConfig = {
  address: '0xC4C1877971eAf71fac5A5826B0d103656109d67D',
  abi: seraphStakingAbi
} as const

export const tensorPlexStakedTaoConfig = {
  address: '0x806041b6473da60abbe1b256d9a2749a151be6c6',
  abi: seraphStakingAbi
} as const
