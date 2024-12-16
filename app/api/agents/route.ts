import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    )

    console.log('Supabase client created')

    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('search') || ''

    let query = supabase.from('agents').select('*')

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }

    const { data, error } = await query

    console.log('Query data:', data)

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json([])
  }
}
