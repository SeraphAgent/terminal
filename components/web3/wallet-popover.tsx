"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut, Copy, ExternalLink } from "lucide-react";
import { useWalletConnection } from "@/lib/web3/hooks/use-wallet-connection";
import { useState } from "react";

export function WalletPopover() {
  const { address, disconnect, formatAddress } = useWalletConnection();
  const [open, setOpen] = useState(false);

  if (!address) return null;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
  };

  const openBasescan = () => {
    window.open(`https://basescan.org/address/${address}`, "_blank");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="font-mono border-green-500/30 text-green-500 hover:bg-green-500/10"
        >
          {formatAddress(address)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 bg-black/90 border border-green-500/30">
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-green-400 hover:text-green-500 hover:bg-green-500/10"
            onClick={copyAddress}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Address
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-green-400 hover:text-green-500 hover:bg-green-500/10"
            onClick={openBasescan}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Basescan
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-green-400 hover:text-green-500 hover:bg-green-500/10"
            onClick={() => {
              disconnect();
              setOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}