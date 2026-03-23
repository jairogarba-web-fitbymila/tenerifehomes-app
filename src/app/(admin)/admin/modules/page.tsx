'use client'

import { useState, useEffect } from 'react'
import { PlatformModule } from '@/lib/modules'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface GroupedModules {
  [category: string]: PlatformModule[]
}

export default function AdminModulesPage() {
  const [modules, setModules] = useState<PlatformModule[]>([])
  const [groupedModules, setGroupedModules] = useState<GroupedModules>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadModules() {
      try {
        // This endpoint needs to be created to get all platform modules
        // For now, we'll use the dashboard modules endpoint as a fallback
        const response = await fetch('/api/dashboard/modules')
        if (!response.ok) throw new Error('Failed to fetch modules')

        const data = await response.json()
        const modulesList = data.modules || []

        setModules(modulesList)

        // Group by category
        const grouped: GroupedModules = {}
        modulesList.forEach((module: PlatformModule) => {
          if (!grouped[module.category]) {
            grouped[module.category] = []
          }
          grouped[module.category].push(module)
        })

        setGroupedModules(grouped)
      } catch (error) {
        console.error('Error loading modules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Módulos de plataforma</h1>
        <p className="text-gray-600 mt-1">Visualiza todos los módulos disponibles en la plataforma</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando módulos...</p>
          </div>
        </div>
      ) : Object.keys(groupedModules).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedModules).map(([category, categoryModules]) => (
            <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {categoryModules.map((module) => (
                  <div key={module.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{module.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-700">
                            Plan mínimo: {module.min_plan}
                          </span>
                          {module.is_addon && (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-100 text-purple-700">
                              Add-on: €{module.addon_price}/mes
                            </span>
                          )}
                          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-100 text-blue-700">
                            Orden: {module.display_order}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No hay módulos disponibles</p>
        </div>
      )}
    </div>
  )
}
