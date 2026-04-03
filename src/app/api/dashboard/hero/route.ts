import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('hero_config')
    .select('*')
    .eq('agent_id', user.id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const allowed = ['headline', 'subtitle', 'cta_text', 'cta_link', 'background_image_url', 'overlay_opacity']
  const updates: Record<string, any> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  const { data, error } = await supabase
    .from('hero_config')
    .update(updates)
    .eq('agent_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Fire-and-forget: trigger translation for text fields that changed
  const textFields = ['headline', 'subtitle', 'cta_text']
  const fieldsToTranslate = textFields
    .filter(f => f in updates && updates[f]?.trim())
    .map(f => ({ field: f, text: updates[f] }))

  if (fieldsToTranslate.length > 0 && data?.id) {
    // Get agent's enabled languages
    const { data: moduleData } = await supabase
      .from('agent_modules')
      .select('module_slug')
      .eq('agent_id', user.id)
      .eq('is_active', true)

    const hasMultiidioma = (moduleData || []).some(
      (m: { module_slug: string }) => m.module_slug === 'multiidioma'
    )
    const targetLanguages = hasMultiidioma
      ? ['en', 'de', 'fr', 'it', 'pt', 'nl', 'ru', 'sv', 'no']
      : ['en']

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
    void fetch(`${baseUrl}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: user.id,
        source_table: 'hero_config',
        source_id: data.id,
        fields: fieldsToTranslate,
        source_language: 'es',
        target_languages: targetLanguages,
      }),
    }).catch(() => {})
  }

  return NextResponse.json(data)
}
