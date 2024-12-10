import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'

export function getConfig() {
  return createConfig({
    chains: [base],
    connectors: [
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
        showQrModal: false,
      }),
    ],
    ssr: false,
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
