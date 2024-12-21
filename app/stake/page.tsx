'use client'

export default function Staking() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-4 font-mono text-3xl font-bold text-green-500">
        Staking
      </h1>

      <div className="space-y-8">
        {/* Coming Soon Section */}
        <div className="rounded-lg border border-green-500/30 bg-black/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-center font-mono text-5xl font-bold text-green-400">
            Coming Soon
          </h2>
          <p className="text-center font-mono leading-relaxed text-green-400">
            Something amazing is cooking. Stay tuned for more updates!
          </p>
        </div>

        {/* Placeholder Resources Section */}
        <div className="rounded-lg border border-green-500/30 bg-black/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 font-mono text-2xl font-bold text-green-400">
            Learn More
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-mono leading-relaxed text-green-400">
                Learn more about staking mechanisms and Seraph&apos;s future
                ecosystem:
              </p>
              <a
                href="https://github.com/SeraphAgent/seraph-staking-contracts"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block font-mono text-green-400 transition-colors hover:text-green-300"
              >
                → Seraph Staking
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
