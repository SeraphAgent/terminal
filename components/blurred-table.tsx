import React from "react"

export function BlurredTable() {
  return (
    <div className="relative">
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-md z-10 flex items-center justify-center bg-black/20">
        <div className="text-4xl font-mono font-bold text-green-500">
          Coming Soon
        </div>
      </div>
      
      {/* Placeholder table structure matching the original style */}
      <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden opacity-50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-green-500/30">
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="px-6 py-4 text-left text-sm font-mono text-green-500">
                    <div className="h-4 w-24 bg-green-500/20 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-green-500/10">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-6 py-4 font-mono text-green-400">
                      <div className="h-4 w-20 bg-green-500/10 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}