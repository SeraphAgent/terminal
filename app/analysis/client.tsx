'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/status-badge'
import { TrustScore } from '@/components/trust-score'
import { Search, SortAsc, SortDesc } from 'lucide-react'
import { isValidStatus } from '@/lib/types'

interface Agent {
  id: string
  name: string
  status: string
  trust_score: number
  ai_score: number
  type: string
  last_update: string
  x_handle: string
}

interface AnalysisClientProps {
  initialAgents: Agent[]
}

export function AnalysisClient({ initialAgents }: AnalysisClientProps) {
  const [agents] = useState<Agent[]>(initialAgents)
  const [searchTerm, setSearchTerm] = useState('')
  const [pageSize, setPageSize] = useState<number>(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Agent
    direction: 'asc' | 'desc'
  }>({ key: 'trust_score', direction: 'desc' })

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  const totalPages = Math.ceil(sortedAgents.length / pageSize)
  const paginatedAgents =
    pageSize === -1
      ? sortedAgents
      : sortedAgents.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleSort = (key: keyof Agent) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  function getPageNumbers(currentPage: number, totalPages: number) {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-mono text-3xl font-bold text-green-500">
          Neural Analysis
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="w-full rounded border border-green-500/30 bg-black/30 px-3 py-2 font-mono text-green-500 focus:border-green-500 focus:outline-none sm:w-auto"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={100}>100 per page</option>
            <option value={-1}>All</option>
          </select>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-green-500/50" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full rounded border border-green-500/30 bg-black/30 py-2 pl-10 pr-4 font-mono text-green-500 placeholder-green-500/50 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-green-500/30 bg-black/50 backdrop-blur-sm">
        <div className="max-h-[70vh] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-black/90">
              <tr className="border-b border-green-500/30">
                <th className="px-6 py-4 text-left font-mono text-sm text-green-500">
                  Agent
                </th>
                <th className="px-6 py-4 text-left font-mono text-sm text-green-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left font-mono text-sm text-green-500">
                  X Account
                </th>
                <th
                  className="cursor-pointer px-6 py-4 text-left font-mono text-sm text-green-500"
                  onClick={() => handleSort('trust_score')}
                >
                  <div className="flex items-center gap-2">
                    Trust Score
                    {sortConfig.key === 'trust_score' &&
                      (sortConfig.direction === 'asc' ? (
                        <SortAsc className="h-4 w-4" />
                      ) : (
                        <SortDesc className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-mono text-sm text-green-500">
                  AI Score
                </th>
                <th className="px-6 py-4 text-left font-mono text-sm text-green-500">
                  Type
                </th>
                <th className="px-6 py-4 text-left font-mono text-sm text-green-500">
                  Last Update
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAgents.map((agent) => (
                <tr
                  key={agent.id}
                  className="border-b border-green-500/10 transition-colors hover:bg-green-500/5"
                >
                  <td className="px-6 py-4 font-mono text-green-400">
                    {agent.name}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={
                        isValidStatus(agent.status) ? agent.status : 'inactive'
                      }
                    />
                  </td>
                  <td className="px-6 py-4 font-mono text-green-400">
                    {agent.x_handle && (
                      <a
                        href={`https://x.com/${agent.x_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-300 hover:underline"
                      >
                        {agent.x_handle}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <TrustScore score={agent.trust_score} />
                  </td>
                  <td className="px-6 py-4 font-mono text-green-400">
                    {agent.ai_score}%
                  </td>
                  <td className="px-6 py-4 font-mono capitalize text-green-400">
                    {agent.type}
                  </td>
                  <td className="px-6 py-4 font-mono text-green-400">
                    {new Date(agent.last_update).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pageSize !== -1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-green-500/30 px-4 py-4 sm:flex-row sm:gap-0 sm:px-6">
            <div className="text-center font-mono text-sm text-green-500 sm:text-left">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedAgents.length)} of{' '}
              {sortedAgents.length}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="min-w-[80px] rounded border border-green-500/30 bg-green-500/10 px-3 py-1 font-mono text-green-500 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex flex-wrap justify-center gap-2">
                {getPageNumbers(currentPage, totalPages).map((pageNum, idx) =>
                  pageNum === '...' ? (
                    <span
                      key={`dots-${idx}`}
                      className="px-3 py-1 font-mono text-green-500"
                    >
                      {pageNum}
                    </span>
                  ) : (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => setCurrentPage(Number(pageNum))}
                      disabled={currentPage === pageNum}
                      className={`min-w-[40px] rounded border px-3 py-1 font-mono ${
                        currentPage === pageNum
                          ? 'border-green-500 bg-green-500 text-black'
                          : 'border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="min-w-[80px] rounded border border-green-500/30 bg-green-500/10 px-3 py-1 font-mono text-green-500 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
