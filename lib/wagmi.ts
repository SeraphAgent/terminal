import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { metaMask, walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      metaMask(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
      }),
    ],
    ssr: true,
    transports: {
      [base.id]: http(),
    },
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
