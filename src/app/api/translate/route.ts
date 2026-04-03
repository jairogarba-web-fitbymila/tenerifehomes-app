import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish', en: 'English', de: 'German', fr: 'French',
  it: 'Italian', pt: 'Portuguese', nl: 'Dutch', ru: 'Russian',
  sv: 'Swedish', no: 'Norwegian',
}

interface TranslateField {
  field: string
  text: string
}

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OPENAI_API_KEY not configured. Translation service unavailable.' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const {
      agent_id,
      source_table,
      source_id,
      fields,
      source_language = 'es',
      target_languages,
    } = body as {
      agent_id: string
      source_table: string
      source_id: string
      fields: TranslateField[]
      source_language: string
      target_languages: string[]
    }

    if (!agent_id || !source_table || !source_id || !fields?.length || !target_languages?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = getSupabase()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const results: Array<{ field: string; language: string; status: string }> = []

    for (const targetLang of target_languages) {
      if (targetLang === source_language) continue

      for (const { field, text } of fields) {
        if (!text?.trim()) continue

        // Upsert pending record
        await supabase.from('content_translations').upsert({
          agent_id,
          source_table,
          source_id,
          source_field: field,
          source_language,
          target_language: targetLang,
          translated_text: '',
          status: 'processing',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'source_table,source_id,source_field,target_language' })

        try {
          const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.3,
            max_tokens: 1000,
            messages: [
              {
                role: 'system',
                content: `You are a professional real estate translator. Translate the following text from ${LANGUAGE_NAMES[source_language] || source_language} to ${LANGUAGE_NAMES[targetLang] || targetLang}. The text is from a real estate agent's website in Tenerife, Spain. Keep the tone professional and maintain any proper nouns, addresses, and technical real estate terms. Only return the translated text, nothing else.`,
              },
              { role: 'user', content: text },
            ],
          })

          const translated = completion.choices[0]?.message?.content?.trim() || ''

          await supabase.from('content_translations').upsert({
            agent_id,
            source_table,
            source_id,
            source_field: field,
            source_language,
            target_language: targetLang,
            translated_text: translated,
            status: 'completed',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'source_table,source_id,source_field,target_language' })

          results.push({ field, language: targetLang, status: 'completed' })
        } catch (err) {
          await supabase.from('content_translations').upsert({
            agent_id,
            source_table,
            source_id,
            source_field: field,
            source_language,
            target_language: targetLang,
            translated_text: '',
            status: 'error',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'source_table,source_id,source_field,target_language' })

          results.push({ field, language: targetLang, status: 'error' })
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (err) {
    console.error('Translate error:', err)
    return NextResponse.json(
      { error: 'Translation failed', details: String(err) },
      { status: 500 }
    )
  }
}
