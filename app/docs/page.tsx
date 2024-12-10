"use client";

import { useAuth } from "@/hooks/use-auth";

export default function Docs() {
  useAuth(); // Protected route

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-mono font-bold mb-4 text-green-500">
        Documentation
      </h1>

      <div className="space-y-8">
        {/* Overview Section */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">
            Overview
          </h2>
          <p className="text-green-400 font-mono leading-relaxed mb-4">
            Seraph is an autonomous agent powered by decentralized intelligence
            network that leverages advanced AI models to provide truthful and
            verifiable analysis. Powered by Bittensor, Seraph acts as a bridge
            between autonomous agents and distributed AI intelligence.
          </p>
          <p className="text-green-400 font-mono leading-relaxed">
            The system employs multiple inference and validation layers,
            cross-referencing data across a network of specialized AI agents to
            ensure high accuracy and reliability in its analysis.
          </p>
        </div>

        {/* Architecture Section */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">
            Architecture
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-400">
                Virtuals Framework
              </h3>
              <p className="text-green-400 font-mono leading-relaxed">
                Seraph utilizes the Virtuals agent framework to create and
                manage multiple AI personas, each specialized in different
                aspects of analysis. These agents work in concert to provide
                comprehensive insights and verify information across multiple
                dimensions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-400">
                Bittensor Integration
              </h3>
              <p className="text-green-400 font-mono leading-relaxed">
                Through Bittensor&apos;s decentralized network, Seraph accesses
                a distributed computing infrastructure that enables:
              </p>
              <ul className="list-disc list-inside text-green-400 font-mono mt-2 space-y-2">
                <li>Decentralized inference and validation</li>
                <li>Token-incentivized truth consensus</li>
                <li>Cross-network verification protocols</li>
                <li>Scalable computational resources</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">
            Technical Details
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-400">
                Consensus Mechanism
              </h3>
              <p className="text-green-400 font-mono leading-relaxed">
                Seraph employs a multi-layer consensus mechanism that combines:
              </p>
              <ul className="list-disc list-inside text-green-400 font-mono mt-2 space-y-2">
                <li>Neural voting protocols</li>
                <li>Trust score validation</li>
                <li>Cross-reference verification</li>
                <li>Historical performance metrics</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">
            Resources
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-400">
                Documentation & Code
              </h3>
              <div className="space-y-2">
                <a
                  href="https://github.com/SeraphAgent/litepaper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-400 font-mono hover:text-green-300 transition-colors"
                >
                  → Seraph Litepaper
                </a>
                <p className="text-green-400/70 font-mono text-sm">
                  Comprehensive documentation about Seraph&apos;s architecture,
                  consensus mechanisms, and technical specifications.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center text-green-400/50 font-mono text-sm">
          Current Version: 0.0.7
        </div>
      </div>
    </div>
  );
}
