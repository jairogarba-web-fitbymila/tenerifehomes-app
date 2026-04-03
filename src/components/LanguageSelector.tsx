'use client'

import { useState, useRef, useEffect } from 'react'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n'

interface LanguageSelectorProps {
  currentLang: string
  availableLanguages: string[]
  onLanguageChange: (lang: string) => void
}

export default function LanguageSelector({
  currentLang,
  availableLanguages,
  onLanguageChange,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const languages = SUPPORTED_LANGUAGES.filter(l => availableLanguages.includes(l.code))
  const current = SUPPORTED_LANGUAGES.find(l => l.code === currentLang)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (languages.length <= 1) return null

  function handleSelect(code: string) {
    setOpen(false)
    localStorage.setItem('habibook_lang', code)
    // Update URL with lang param
    const url = new URL(window.location.href)
    url.searchParams.set('lang', code)
    window.history.replaceState({}, '', url.toString())
    onLanguageChange(code)
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 8px',
          borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          fontSize: 13,
          fontFamily: 'inherit',
        }}
      >
        <span>{current?.flag}</span>
        <span>{current?.code.toUpperCase()}</span>
        <span style={{ fontSize: 10, opacity: 0.6 }}>&#9662;</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            minWidth: 160,
            zIndex: 9999,
            overflow: 'hidden',
          }}
        >
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                background: lang.code === currentLang ? '#f1f5f9' : 'transparent',
                cursor: 'pointer',
                fontSize: 13,
                color: '#334155',
                textAlign: 'left',
                fontFamily: 'inherit',
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === currentLang && (
                <span style={{ marginLeft: 'auto', color: '#3b82f6', fontSize: 12 }}>&#10003;</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
