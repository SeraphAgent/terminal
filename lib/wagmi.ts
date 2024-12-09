import { createConfig, createStorage, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
      }),
    ],
    ssr: true,
    transports: {
      [base.id]: http(),
    },
    storage: createStorage({
      storage: localStorage,
    }),
  })
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getConfig>
  }
}
