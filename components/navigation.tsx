'use client'

import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import {
  BarChart2,
  ChevronDown,
  ExternalLink,
  FileText,
  Menu,
  Terminal
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { ConnectButton } from './web3/ConnectButton'

export function Navigation() {
  const pathname = usePathname()
  const { isAuth } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const links = !isAuth
    ? null
    : [
        { href: '/', label: 'Home', icon: Terminal },
        { href: '/analysis', label: 'Analysis', icon: BarChart2 },
        { href: '/docs', label: 'Docs', icon: FileText }
      ]

  return (
    <nav className="border-b border-green-500/30 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-green-500 hover:text-green-400 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:space-x-8">
            {links?.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-green-400',
                  pathname === href
                    ? 'border-b-2 border-green-500 text-green-500'
                    : 'text-green-500/70'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="border border-green-500/30 bg-green-500/10 font-mono text-green-500 hover:bg-green-500/20">
                  <span>Buy $SERAPH</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] border border-green-500/30 bg-black text-green-500"
              >
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-green-500/10 focus:text-green-400"
                >
                  <a
                    href="https://app.virtuals.io/virtuals/12398"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between"
                  >
                    <span>Virtuals</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-green-500/10 focus:text-green-400"
                >
                  <a
                    href="https://kyberswap.com/swap/base/eth-to-0x4f81837c2f4a189a0b69370027cc2627d93785b4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between"
                  >
                    <span>KyberSwap</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer focus:bg-green-500/10 focus:text-green-400"
                >
                  <a
                    href="https://www.okx.com/web3/dex-swap?inputChain=8453&inputCurrency=0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b&outputChain=8453&outputCurrency=0x4f81837c2f4a189a0b69370027cc2627d93785b4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between"
                  >
                    <span>OKX</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ConnectButton />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="pb-4 lg:hidden">
            {links?.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center space-x-2 py-3 text-sm font-medium transition-colors hover:text-green-400',
                  pathname === href ? 'text-green-500' : 'text-green-500/70'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
