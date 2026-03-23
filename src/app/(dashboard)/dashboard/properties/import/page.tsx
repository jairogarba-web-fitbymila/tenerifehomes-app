'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  FileText,
  Loader2,
  X,
  Link2,
  Globe,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react'

interface ImportResult {
  total: number
  success: number
  errors: Array<{ row: number; error: string }>
  message: string
}

interface ScrapedProperty {
  title: string
  price: number
  type: string
  operation: string
  bedrooms: number
  bathrooms: number
  size_m2: number
  location: string
  description: string
  images: string[]
  url: string
  selected: boolean
}

type Tab = 'url' | 'csv'

export default function PropertyImportPage() {
  const [activeTab, setActiveTab] = useState<Tab>('url')

  // CSV state
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

  // URL state
  const [url, setUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scrapedProperties, setScrapedProperties] = useState<ScrapedProperty[]>([])
  const [urlError, setUrlError] = useState('')
  const [urlResult, setUrlResult] = useState<ImportResult | null>(null)
  const [importingUrl, setImportingUrl] = useState(false)

  // CSV handlers
  function handleDrag(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    else if (e.type === 'dragleave') setDragActive(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
      setFile(droppedFile)
      setError('')
      setResult(null)
    } else {
      setError('Solo se aceptan archivos CSV o Excel (.csv, .xlsx)')
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setError('')
      setResult(null)
    }
  }

  async function handleCsvImport() {
    if (!file) return
    setImporting(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/dashboard/properties/import', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Error al importar')
        return
      }
      setResult(data)
    } catch {
      setError('Error de conexión al importar')
    } finally {
      setImporting(false)
    }
  }

  // URL handlers
  async function handleScrape() {
    if (!url.trim()) return
    setScraping(true)
    setUrlError('')
    setScrapedProperties([])
    setUrlResult(null)

    try {
      const response = await fetch('/api/dashboard/properties/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()
      if (!response.ok) {
        setUrlError(data.error || 'Error al extraer propiedades')
        return
      }

      setScrapedProperties(data.properties.map((p: ScrapedProperty) => ({ ...p, selected: true })))
    } catch {
      setUrlError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setScraping(false)
    }
  }

  function toggleProperty(index: number) {
    setScrapedProperties(prev =>
      prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p)
    )
  }

  function toggleAll() {
    const allSelected = scrapedProperties.every(p => p.selected)
    setScrapedProperties(prev => prev.map(p => ({ ...p, selected: !allSelected })))
  }

  async function handleUrlImport() {
    const selected = scrapedProperties.filter(p => p.selected)
    if (selected.length === 0) return
    setImportingUrl(true)
    setUrlError('')

    try {
      const response = await fetch('/api/dashboard/properties/scrape', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ properties: selected }),
      })

      const data = await response.json()
      if (!response.ok) {
        setUrlError(data.error || 'Error al importar')
        return
      }
      setUrlResult(data)
      setScrapedProperties([])
    } catch {
      setUrlError('Error de conexión al importar')
    } finally {
      setImportingUrl(false)
    }
  }

  const selectedCount = scrapedProperties.filter(p => p.selected).length

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importar Propiedades</h1>
          <p className="text-sm text-gray-500 mt-1">Sube tus propiedades de forma rápida y masiva</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'url'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Globe className="w-4 h-4" />
          Desde enlace web
        </button>
        <button
          onClick={() => setActiveTab('csv')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'csv'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          CSV / Excel
        </button>
      </div>

      {/* URL Import Tab */}
      {activeTab === 'url' && (
        <div className="space-y-6">
          {/* URL Input */}
          <div className="card p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Pega el enlace de tu perfil</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Copia la URL de tu perfil de Idealista, Fotocasa u otro portal y nosotros extraemos todas tus propiedades automáticamente.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.idealista.com/pro/mi-agencia..."
                  className="input pl-10 w-full"
                  onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                />
              </div>
              <button
                onClick={handleScrape}
                disabled={scraping || !url.trim()}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                {scraping ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Extrayendo...</>
                ) : (
                  <><ArrowRight className="w-4 h-4" /> Extraer</>
                )}
              </button>
            </div>

            {/* Supported portals */}
            <div className="flex flex-wrap gap-2">
              {['idealista.com', 'fotocasa.es', 'pisos.com', 'habitaclia.com', 'yaencontre.com'].map((portal) => (
                <span key={portal} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full">
                  {portal}
                </span>
              ))}
            </div>
          </div>

          {/* URL Error */}
          {urlError && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p>{urlError}</p>
                <p className="text-xs text-red-500 mt-1">
                  Si el portal bloquea la extracción, puedes exportar tus propiedades a CSV e importarlas desde la pestaña CSV/Excel.
                </p>
              </div>
            </div>
          )}

          {/* Scraped Properties Preview */}
          {scrapedProperties.length > 0 && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {scrapedProperties.length} propiedades encontradas
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedCount} seleccionadas para importar
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={toggleAll} className="text-sm text-brand-600 hover:underline">
                    {scrapedProperties.every(p => p.selected) ? 'Deseleccionar todas' : 'Seleccionar todas'}
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {scrapedProperties.map((prop, i) => (
                  <div
                    key={i}
                    onClick={() => toggleProperty(i)}
                    className={`flex items-center gap-4 px-5 py-3 cursor-pointer transition-colors ${
                      prop.selected ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      prop.selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-300'
                    }`}>
                      {prop.selected && <Check className="w-3 h-3" />}
                    </div>
                    {prop.images[0] && (
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-16 h-12 rounded object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{prop.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {prop.location} · {prop.bedrooms} hab · {prop.size_m2} m²
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prop.price)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-600">
                  {selectedCount} de {scrapedProperties.length} seleccionadas
                </p>
                <button
                  onClick={handleUrlImport}
                  disabled={importingUrl || selectedCount === 0}
                  className="btn-primary flex items-center gap-2"
                >
                  {importingUrl ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Importar {selectedCount} propiedades</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* URL Import Result */}
          {urlResult && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">Importación completada</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{urlResult.success}</p>
                  <p className="text-xs text-green-600 mt-1">Importadas</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">{urlResult.errors.length}</p>
                  <p className="text-xs text-red-600 mt-1">Errores</p>
                </div>
              </div>
              <Link href="/dashboard/properties" className="btn-primary inline-flex items-center gap-2 text-sm">
                Ver mis propiedades <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Tip */}
          {scrapedProperties.length === 0 && !urlResult && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
              <p className="font-medium">Consejo</p>
              <p className="mt-1 text-amber-700">
                Entra en tu perfil de Idealista o Fotocasa, copia la URL de la barra de direcciones y pégala arriba. Nosotros hacemos el resto.
              </p>
            </div>
          )}
        </div>
      )}

      {/* CSV Import Tab */}
      {activeTab === 'csv' && (
        <div className="space-y-6">
          {/* Instructions */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              Instrucciones
            </h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Descarga nuestra plantilla CSV con las columnas correctas y rellénala con tus propiedades.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-500 bg-gray-50 rounded-lg p-4">
                <span><strong>titulo</strong> (obligatorio)</span>
                <span><strong>tipo_propiedad</strong></span>
                <span><strong>tipo_operacion</strong></span>
                <span><strong>precio</strong></span>
                <span><strong>habitaciones</strong></span>
                <span><strong>banos</strong></span>
                <span><strong>tamano_m2</strong></span>
                <span><strong>ubicacion</strong></span>
                <span><strong>descripcion</strong></span>
                <span><strong>caracteristicas</strong></span>
                <span><strong>referencia</strong></span>
                <span><strong>ano_construccion</strong></span>
              </div>
            </div>
            <a
              href="/api/dashboard/properties/import"
              download
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Descargar plantilla CSV
            </a>
          </div>

          {/* Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`card border-2 border-dashed p-10 text-center transition-colors ${
              dragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-200'
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <FileSpreadsheet className="w-10 h-10 text-brand-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button onClick={() => { setFile(null); setResult(null) }} className="ml-4 text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <button
                  onClick={handleCsvImport}
                  disabled={importing}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {importing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Importar Propiedades</>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-300 mx-auto" />
                <div>
                  <p className="text-gray-700 font-medium">Arrastra tu archivo aquí</p>
                  <p className="text-sm text-gray-500 mt-1">o haz clic para seleccionarlo</p>
                </div>
                <label className="btn-primary inline-flex items-center gap-2 cursor-pointer text-sm">
                  <FileSpreadsheet className="w-4 h-4" />
                  Seleccionar archivo
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="text-xs text-gray-400">CSV, Excel (.xlsx, .xls). Máximo 500 propiedades.</p>
              </div>
            )}
          </div>

          {/* CSV Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* CSV Results */}
          {result && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">Resultado de la importación</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{result.total}</p>
                  <p className="text-xs text-gray-500 mt-1">Total</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{result.success}</p>
                  <p className="text-xs text-green-600 mt-1">Importadas</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">{result.errors.length}</p>
                  <p className="text-xs text-red-600 mt-1">Errores</p>
                </div>
              </div>
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">Detalle de errores:</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.errors.map((err, i) => (
                      <p key={i} className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded">
                        Fila {err.row}: {err.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Link href="/dashboard/properties" className="btn-primary text-sm">Ver mis propiedades</Link>
                <button onClick={() => { setFile(null); setResult(null) }} className="btn-secondary text-sm">Importar más</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual creation link */}
      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          ¿Prefieres crear propiedades una a una?{' '}
          <Link href="/dashboard/properties/new" className="text-brand-600 hover:text-brand-700 font-medium">
            Crear propiedad manualmente
          </Link>
        </p>
      </div>
    </div>
  )
}
