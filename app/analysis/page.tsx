import { createClient } from '@supabase/supabase-js'
import { AnalysisClient } from './client'

export const dynamic = 'force-dynamic'

async function getAgents() {
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
