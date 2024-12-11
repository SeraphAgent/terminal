'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider, SIWEConfig, SIWEProvider } from 'connectkit'
import { type ReactNode, useEffect, useState } from 'react'
import { SiweMessage } from 'siwe'
import { type State, WagmiProvider } from 'wagmi'
import { getConfig } from '../lib/wagmi'

const siwePath = '/api/auth/siwe'
const siweConfig = {
  getNonce: async () => {
    const res = await fetch(siwePath, { method: 'PUT' })
    if (!res.ok) throw new Error('Failed to fetch SIWE nonce')

    return res.text()
  },

  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: '1',
      uri: window.location.origin,
      domain: window.location.host,
      statement: 'Sign In With Ethereum to prove you control this wallet.',
    }).prepareMessage()
  },

  verifyMessage: ({ message, signature }) => {
    return fetch(siwePath, {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => res.ok)
  },

  getSession: async () => {
    const res = await fetch(siwePath)
    if (!res.ok) throw new Error('Failed to fetch SIWE session')

    const { address, chainId } = await res.json()
    return address && chainId ? { address, chainId } : null
  },

  signOut: () => fetch(siwePath, { method: 'DELETE' }).then((res) => res.ok),
} satisfies SIWEConfig

export function Providers(props: {
  children: ReactNode
  initialState?: State
}) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const [config] = useState(() => getConfig())
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <SIWEProvider {...siweConfig}>
          <ConnectKitProvider theme="midnight">
            {mounted && props.children}
          </ConnectKitProvider>
        </SIWEProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
