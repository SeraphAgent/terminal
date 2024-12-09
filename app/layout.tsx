import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navigation } from '@/components/navigation';
import { DigitalRain } from '@/components/digital-rain';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Seraph Terminal',
  description: 'Neural Consensus Interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
  );
}