import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const MOCK_AGENTS = [
  {
    id: '1',
    name: 'Test Agent 1',
    status: 'active',
    trust_score: 95,
    ai_score: 88,
    type: 'validator',
    last_update: new Date().toISOString(),
    x_handle: 'testagent1'
  },
  {
    id: '2',
    name: 'Test Agent 2',
    status: 'training',
    trust_score: 85,
    ai_score: 92,
    type: 'miner',
    last_update: new Date().toISOString(),
    x_handle: 'testagent2'
  }
]

export async function GET(request: Request) {
  try {
    if (process.env.NODE_ENV === 'development') {
      const { searchParams } = new URL(request.url)
      const searchTerm = searchParams.get('search') || ''

      const filteredAgents = MOCK_AGENTS.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      return NextResponse.json(filteredAgents)
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false
        }
      }
    )

    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('search') || ''

    let query = supabase.from('agents').select('*')

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json([])
  }
}
