import { createClient } from '@supabase/supabase-js'
import { AnalysisClient } from './client'

export const revalidate = 120

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

async function getAgents() {
  if (process.env.NODE_ENV === 'development') {
    return MOCK_AGENTS
  }
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false
        }
      }
    )

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Unexpected error in getAgents:', error)
    return []
  }
}

export default async function Analysis() {
  const initialAgents = await getAgents()

  return <AnalysisClient initialAgents={initialAgents} />
}
