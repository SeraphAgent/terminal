"use client";

import { Terminal } from "@/components/terminal";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  return (
    <main className="relative">
      <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-mono font-bold mb-2 glitch-text">SERAPH TERMINAL</h1>
            <p className="text-green-400 font-mono">Neural Consensus Interface v1.0</p>
          </header>
          <Terminal />
        </div>
      </div>
    </main>
  );
}