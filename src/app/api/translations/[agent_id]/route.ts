import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agent_id: string } }
) {
  const lang = request.nextUrl.searchParams.get('lang')
  if (!lang || lang === 'es') {
    return NextResponse.json({})
  }

  const supabase = getSupabase()

  const { data: translations, error } = await supabase
    .from('content_translations')
    .select('source_table, source_id, source_field, translated_text')
    .eq('agent_id', params.agent_id)
    .eq('target_language', lang)
    .eq('status', 'completed')

  if (error) {
    console.error('Translations fetch error:', error)
    return NextResponse.json({})
  }

  // Organize by table > id > field
  const organized: Record<string, Record<string, Record<string, string>>> = {}

  for (const row of translations || []) {
    if (!organized[row.source_table]) organized[row.source_table] = {}
    if (!organized[row.source_table][row.source_id]) organized[row.source_table][row.source_id] = {}
    organized[row.source_table][row.source_id][row.source_field] = row.translated_text
  }

  return NextResponse.json(organized)
}
