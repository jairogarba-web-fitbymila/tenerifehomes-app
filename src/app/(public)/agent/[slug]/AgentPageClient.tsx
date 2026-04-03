'use client'

import { useState, useEffect } from 'react'
import { TemplateRenderer } from '@/components/templates/TemplateRenderer'
import { TemplateData } from '@/components/templates/types'
import LanguageSelector from '@/components/LanguageSelector'
import { TranslationsMap } from '@/lib/i18n/content'

interface AgentPageClientProps {
  data: TemplateData
  templateId: string
  agentId: string
  lang: string
  translations: TranslationsMap | null
  availableLanguages: string[]
}

export default function AgentPageClient({
  data,
  templateId,
  agentId,
  lang: initialLang,
  translations: initialTranslations,
  availableLanguages,
}: AgentPageClientProps) {
  const [lang, setLang] = useState(initialLang)
  const [translations, setTranslations] = useState(initialTranslations)

  // Check localStorage for saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('habibook_lang')
    if (saved && availableLanguages.includes(saved) && saved !== lang) {
      setLang(saved)
      // Fetch translations for the saved language
      if (saved !== 'es') {
        fetch(`/api/translations/${agentId}?lang=${saved}`)
          .then(r => r.json())
          .then(setTranslations)
          .catch(() => {})
      }
    }
  }, [])

  function handleLanguageChange(newLang: string) {
    setLang(newLang)
    if (newLang === 'es') {
      setTranslations(null)
      return
    }
    // Fetch translations for new language
    fetch(`/api/translations/${agentId}?lang=${newLang}`)
      .then(r => r.json())
      .then(setTranslations)
      .catch(() => {})
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Language selector floating in top-right */}
      {availableLanguages.length > 1 && (
        <div style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9990,
        }}>
          <LanguageSelector
            currentLang={lang}
            availableLanguages={availableLanguages}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      )}
      <TemplateRenderer
        templateId={templateId}
        data={data}
        lang={lang}
        translations={translations}
      />
    </div>
  )
}
