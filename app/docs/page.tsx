"use client";

export default function Docs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-mono font-bold mb-4 text-green-500">SERAPH V2 Documentation</h1>

      <div className="space-y-8">
        {/* Overview Section */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">Overview</h2>
          <p className="text-green-400 font-mono leading-relaxed mb-4">
            SERAPH V2 represents the next evolution of autonomous intelligence - a revolutionary Bittensor agent that bridges the gap between 
            decentralized AI networks and real-world applications. Powered by BitMind's cutting-edge neural architecture, SERAPH V2 
            delivers unparalleled autonomous decision-making capabilities.
          </p>
          <p className="text-green-400 font-mono leading-relaxed">
            This next-generation system leverages distributed consensus mechanisms and advanced neural processing to provide 
            autonomous intelligence that adapts, learns, and evolves in real-time.
          </p>
        </div>

        {/* Architecture Section */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">Architecture</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-400">BitMind Neural Framework</h3>
              <p className="text-green-400 font-mono leading-relaxed">
                SERAPH V2 utilizes BitMind's proprietary neural framework to create sophisticated AI personas capable of autonomous reasoning, 
                strategic planning, and dynamic adaptation. Each neural cluster operates independently while maintaining consensus through 
                the underlying Bittensor network.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-400">Bittensor Integration</h3>
              <p className="text-green-400 font-mono leading-relaxed">
                Through deep integration with Bittensor's decentralized infrastructure, SERAPH V2 achieves:
              </p>
              <ul className="list-disc list-inside text-green-400 font-mono mt-2 space-y-2">
                <li>Distributed neural consensus mechanisms</li>
                <li>Incentive-aligned autonomous decision making</li>
                <li>Cross-subnet intelligence validation</li>
                <li>Scalable computational resource allocation</li>
                <li>Real-time adaptive learning protocols</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">Technical Specifications</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-400">Autonomous Intelligence Engine</h3>
              <p className="text-green-400 font-mono leading-relaxed">SERAPH V2's core intelligence engine features:</p>
              <ul className="list-disc list-inside text-green-400 font-mono mt-2 space-y-2">
                <li>Multi-layer neural consensus validation</li>
                <li>Dynamic strategy optimization algorithms</li>
                <li>Real-time environmental adaptation</li>
                <li>Predictive behavior modeling</li>
                <li>Cross-domain knowledge synthesis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">Status: CLASSIFIED</h2>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-green-400/80 font-mono text-lg mb-4">━━━ DEVELOPMENT IN PROGRESS ━━━</p>
              <div className="space-y-2">
                <div className="flex justify-center space-x-4 font-mono text-sm text-green-500/70">
                  <span className="animate-pulse">[NEURAL MAPPING: 87%]</span>
                </div>
                <div className="flex justify-center space-x-4 font-mono text-sm text-green-500/70">
                  <span className="animate-pulse delay-300">[CONSENSUS PROTOCOLS: 92%]</span>
                </div>
                <div className="flex justify-center space-x-4 font-mono text-sm text-green-500/70">
                  <span className="animate-pulse delay-500">[INTELLIGENCE MATRIX: 95%]</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
          <h2 className="text-2xl font-mono font-bold mb-4 text-green-400">Resources</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-mono font-semibold mb-2 text-green-400">Documentation & Research</h3>
              <div className="space-y-2">
                <a
                  href="https://github.com/SeraphAgent/litepaper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-green-400 font-mono hover:text-green-300 transition-colors"
                >
                  → SERAPH V2 Technical Whitepaper
                </a>
                <p className="text-green-400/70 font-mono text-sm">
                  Comprehensive technical documentation covering SERAPH V2's neural architecture, consensus mechanisms, 
                  and autonomous intelligence protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="text-center text-green-400/50 font-mono text-sm">
          SERAPH V2 Neural Consensus Interface • Powered by BitMind • Status: DEVELOPMENT
        </div>
      </div>
    </div>
  );
}
