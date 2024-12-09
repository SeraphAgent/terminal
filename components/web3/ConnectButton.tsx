'use client'
import { Button } from '@/components/ui/button'
import { ConnectKitButton } from 'connectkit'
import { Wallet } from 'lucide-react'
import { useAccount } from 'wagmi'

export function ConnectButton() {
  const { address, isConnected } = useAccount()

  return (
    <ConnectKitButton.Custom>
      {({ isConnecting, show }) => (
        <Button
          disabled={isConnecting}
          onClick={show}
          className="font-mono bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected && address
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : isConnecting
            ? 'Connecting...'
            : 'Connect Wallet'}
        </Button>
      )}
    </ConnectKitButton.Custom>
  )
}
