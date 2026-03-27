export default function AgentLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F172A' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-gray-700 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Cargando...</p>
      </div>
    </div>
  )
}
