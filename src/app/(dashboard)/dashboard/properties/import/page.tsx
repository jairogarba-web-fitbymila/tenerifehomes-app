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
} from 'lucide-react'

interface ImportResult {
  total: number
  success: number
  errors: Array<{ row: number; error: string }>
  message: string
}

export default function PropertyImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)

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

  async function handleImport() {
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

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/properties" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importar Propiedades</h1>
          <p className="text-sm text-gray-500 mt-1">Sube un archivo CSV o Excel con tus propiedades</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-600" />
          Instrucciones
        </h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p>Descarga nuestra plantilla CSV con las columnas correctas y rellénala con tus propiedades. Las columnas admitidas son:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-gray-500 bg-gray-50 rounded-lg p-4">
            <span><strong>titulo</strong> (obligatorio)</span>
            <span><strong>tipo_propiedad</strong> (villa, apartment...)</span>
            <span><strong>tipo_operacion</strong> (venta, alquiler...)</span>
            <span><strong>precio</strong></span>
            <span><strong>precio_por_noche</strong></span>
            <span><strong>habitaciones</strong></span>
            <span><strong>banos</strong></span>
            <span><strong>tamano_m2</strong></span>
            <span><strong>ubicacion</strong></span>
            <span><strong>zona</strong></span>
            <span><strong>direccion</strong></span>
            <span><strong>caracteristicas</strong> (separadas por coma)</span>
            <span><strong>referencia</strong></span>
            <span><strong>ano_construccion</strong></span>
            <span><strong>descripcion</strong></span>
          </div>
          <p className="text-xs text-gray-400">Las columnas se pueden nombrar en español o inglés. Las propiedades se crean como borrador.</p>
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
              onClick={handleImport}
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
            <p className="text-xs text-gray-400">CSV, Excel (.xlsx, .xls). Máximo 500 propiedades por importación.</p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
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
            <Link href="/dashboard/properties" className="btn-primary text-sm">
              Ver mis propiedades
            </Link>
            <button onClick={() => { setFile(null); setResult(null) }} className="btn-secondary text-sm">
              Importar más
            </button>
          </div>
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
