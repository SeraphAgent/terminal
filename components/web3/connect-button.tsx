"use client";

import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWalletConnection } from '@/lib/web3/hooks/use-wallet-connection';
import { WalletPopover } from './wallet-popover';

export function ConnectButton() {
  const { 
    isConnected, 
    isConnecting, 
    connect
  } = useWalletConnection();

  if (isConnected) {
    return <WalletPopover />;
  }

  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      className="font-mono bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}