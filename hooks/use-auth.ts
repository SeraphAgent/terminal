"use client";

import { useAccount } from 'wagmi';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if not on home page and not connected
    if (!isConnected && pathname !== '/') {
      router.push('/');
    }
  }, [isConnected, pathname, router]);

  return { isConnected };
}