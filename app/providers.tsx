'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConnectKitProvider } from 'connectkit'
import { type ReactNode, useEffect, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'

import { getConfig } from '../lib/wagmi'

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
        <ConnectKitProvider theme="midnight">
          {mounted && props.children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
