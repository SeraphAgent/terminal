import { DigitalRain } from '@/components/digital-rain'
import { Navigation } from '@/components/navigation'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Seraph Terminal',
  description: 'Neural Consensus Interface',
  icons: {
    icon: [
      {
        rel: 'icon',
        type: 'image/png',
        url: '/favicon-96x96.png',
        sizes: '96x96',
      },
      { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <Providers>
          <DigitalRain />
          <div className="relative z-10">
            <Navigation />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
