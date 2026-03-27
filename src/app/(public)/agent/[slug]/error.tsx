'use client'

export default function AgentError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F172A' }}>
      <div className="text-center max-w-md px-4">
        <h1 className="text-5xl font-bold text-white mb-3">Error</h1>
        <p className="text-gray-400 mb-6">{error.message || 'No se pudo cargar la web del agente.'}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 font-medium transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
