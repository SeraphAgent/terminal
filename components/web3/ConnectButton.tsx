'use client'
import { Button } from '@/components/ui/button'
import { ConnectKitButton } from 'connectkit'
import { Wallet } from 'lucide-react'
import { useAccount } from 'wagmi'

export function ConnectButton() {
  const {
    address,
    isConnected,
    isConnecting: isAccountConnecting,
  } = useAccount()

  return (
    <ConnectKitButton.Custom>
      {({ isConnecting, show }) => (
        <Button
          disabled={isConnecting || isAccountConnecting}
          onClick={show}
          className="font-mono bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20"
        >
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected && address
            ? `${address.slice(0, 4)}...${address.slice(-4)}`
            : isConnecting || isAccountConnecting
            ? 'Connecting...'
            : 'Connect Wallet'}
        </Button>
      )}
    </ConnectKitButton.Custom>
  )
}
