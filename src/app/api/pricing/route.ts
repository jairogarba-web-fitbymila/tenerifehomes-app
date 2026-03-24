import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: modules } = await supabase
      .from('module_definitions')
      .select('slug, name, description, price_monthly, features, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    return NextResponse.json({ modules: modules || [] })
  } catch (error) {
    console.error('Error fetching pricing:', error)
    return NextResponse.json({ modules: [] })
  }
}
