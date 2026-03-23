'use client'

import { Settings as SettingsIcon } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Ajustes de administración de plataforma</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Próximamente</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Las opciones de configuración avanzada estarán disponibles en una próxima actualización. Actualmente puedes
          gestionar agentes y módulos desde los menús anteriores.
        </p>
      </div>

      {/* Available Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Configuración de planes</h3>
          <p className="text-sm text-gray-600">
            Ajusta precios, características y límites de cada plan de suscripción
          </p>
          <div className="mt-4 text-xs text-gray-500">Próximamente</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Variables de plataforma</h3>
          <p className="text-sm text-gray-600">Configura variables globales, límites de uso y políticas de la plataforma</p>
          <div className="mt-4 text-xs text-gray-500">Próximamente</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Auditoría</h3>
          <p className="text-sm text-gray-600">Revisa logs de cambios realizados en la plataforma</p>
          <div className="mt-4 text-xs text-gray-500">Próximamente</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Integraciones</h3>
          <p className="text-sm text-gray-600">Configura integraciones externas y webhooks</p>
          <div className="mt-4 text-xs text-gray-500">Próximamente</div>
        </div>
      </div>
    </div>
  )
}
