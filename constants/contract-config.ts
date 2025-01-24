import seraphAbi from './abis/seraph-abi.json'
import seraphStakingV1Abi from './abis/seraph-staking-v1-abi.json'
import seraphStakingV2Abi from './abis/seraph-staking-v2-abi.json'
import stakedTaoAbi from './abis/staked-tao-abi.json'

export const seraphContractConfig = {
  address: '0x4f81837C2f4A189A0B69370027cc2627d93785B4',
  abi: seraphAbi
} as const

export const seraphStakingV1Config = {
  address: '0xd4F3aa15cFC819846Fc7a001c240eb9ea00f0108',
  abi: seraphStakingV1Abi
} as const

export const seraphStakingV2Config = {
  address: '0xD4b47EE9879470179bAC7BECf49d2755ce5a8ea0',
  abi: seraphStakingV2Abi
} as const

export const tensorPlexStakedTaoConfig = {
  address: '0x806041b6473da60abbe1b256d9a2749a151be6c6',
  abi: stakedTaoAbi
} as const
