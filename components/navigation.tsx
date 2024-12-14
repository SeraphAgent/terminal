"use client";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { BarChart2, FileText, Terminal, ExternalLink } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./web3/ConnectButton";
import { Button } from "./ui/button";

export function Navigation() {
  const pathname = usePathname();

  const { isAuth } = useAuth();

  const links = !isAuth
    ? null
    : [
        { href: "/", label: "Home", icon: Terminal },
        { href: "/analysis", label: "Analysis", icon: BarChart2 },
        { href: "/docs", label: "Docs", icon: FileText },
      ];

  return (
    <nav className="border-b border-green-500/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex space-x-8">
            {links?.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-green-400",
                  pathname === href ? "text-green-500 border-b-2 border-green-500" : "text-green-500/70"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <Button asChild className="font-mono bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500/20">
              <a href="https://app.virtuals.io/virtuals/12398" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <span>Buy $SERAPH</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
