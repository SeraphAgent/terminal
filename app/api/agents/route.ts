import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    
    let query = supabase
      .from('agents')
      .select('*');
    
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 