import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Template CSV/Excel for download
export async function GET() {
  const headers = [
    'titulo', 'descripcion', 'tipo_propiedad', 'tipo_operacion', 'precio',
    'precio_por_noche', 'habitaciones', 'banos', 'tamano_m2', 'ubicacion',
    'zona', 'direccion', 'latitud', 'longitud', 'caracteristicas',
    'planta', 'ano_construccion', 'referencia',
  ]

  const exampleRow = [
    'Villa moderna en Costa Adeje', 'Espectacular villa con vistas al mar y piscina privada',
    'villa', 'sale', '850000', '', '4', '3', '280', 'Costa Adeje',
    'Sur de Tenerife', 'Av. de los Oceanos 15', '28.0789', '-16.7267',
    'piscina,garaje,terraza,vistas al mar', '0', '2020', 'REF-001',
  ]

  const csv = [headers.join(','), exampleRow.join(',')].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=plantilla-propiedades-habibook.csv',
    },
  })
}

// Column mapping for Spanish CSV headers
const COLUMN_MAP: Record<string, string> = {
  titulo: 'title',
  title: 'title',
  nombre: 'title',
  descripcion: 'description',
  description: 'description',
  tipo_propiedad: 'property_type',
  property_type: 'property_type',
  tipo: 'property_type',
  type: 'property_type',
  tipo_operacion: 'operation_type',
  operation_type: 'operation_type',
  operacion: 'operation_type',
  precio: 'price',
  price: 'price',
  precio_por_noche: 'price_per_night',
  price_per_night: 'price_per_night',
  habitaciones: 'bedrooms',
  bedrooms: 'bedrooms',
  dormitorios: 'bedrooms',
  banos: 'bathrooms',
  bathrooms: 'bathrooms',
  tamano_m2: 'size_m2',
  size_m2: 'size_m2',
  metros: 'size_m2',
  superficie: 'size_m2',
  ubicacion: 'location',
  location: 'location',
  zona: 'zone',
  zone: 'zone',
  direccion: 'address',
  address: 'address',
  latitud: 'latitude',
  latitude: 'latitude',
  longitud: 'longitude',
  longitude: 'longitude',
  caracteristicas: 'features',
  features: 'features',
  planta: 'floor',
  floor: 'floor',
  ano_construccion: 'year_built',
  year_built: 'year_built',
  referencia: 'reference_code',
  reference: 'reference_code',
  ref: 'reference_code',
}

// Valid enum values
const VALID_PROPERTY_TYPES = ['villa', 'apartment', 'penthouse', 'townhouse', 'commercial', 'land', 'finca']
const VALID_OPERATION_TYPES = ['sale', 'rent_long', 'rent_vacation']

// Map common Spanish terms to valid enum values
const PROPERTY_TYPE_MAP: Record<string, string> = {
  villa: 'villa', chalet: 'villa', casa: 'villa',
  apartamento: 'apartment', apartment: 'apartment', piso: 'apartment', flat: 'apartment',
  atico: 'penthouse', penthouse: 'penthouse',
  adosado: 'townhouse', townhouse: 'townhouse', pareado: 'townhouse',
  comercial: 'commercial', commercial: 'commercial', local: 'commercial', oficina: 'commercial',
  terreno: 'land', land: 'land', parcela: 'land', solar: 'land',
  finca: 'finca', rustica: 'finca',
}

const OPERATION_TYPE_MAP: Record<string, string> = {
  venta: 'sale', sale: 'sale', compra: 'sale', sell: 'sale',
  alquiler: 'rent_long', rent: 'rent_long', rent_long: 'rent_long', alquiler_largo: 'rent_long',
  vacacional: 'rent_vacation', vacation: 'rent_vacation', rent_vacation: 'rent_vacation', alquiler_vacacional: 'rent_vacation',
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    // Simple CSV parsing (handles basic cases)
    const values = lines[i].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''))
    const row: Record<string, string> = {}
    headers.forEach((header, idx) => {
      const mappedKey = COLUMN_MAP[header] || header
      row[mappedKey] = values[idx] || ''
    })
    rows.push(row)
  }

  return rows
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const contentType = request.headers.get('content-type') || ''
    let rows: Record<string, string>[] = []

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File
      if (!file) {
        return NextResponse.json({ error: 'No se ha proporcionado ningún archivo' }, { status: 400 })
      }
      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'Archivo demasiado grande (máximo 10MB)' }, { status: 400 })
      }
      const text = await file.text()
      rows = parseCSV(text)
    } else {
      const body = await request.json()
      if (body.csv) {
        rows = parseCSV(body.csv)
      } else if (Array.isArray(body.properties)) {
        rows = body.properties
      }
    }

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No se encontraron propiedades en el archivo' }, { status: 400 })
    }

    const results: { success: number; errors: Array<{ row: number; error: string }> } = {
      success: 0,
      errors: [],
    }

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]

      // Validate required fields
      if (!row.title) {
        results.errors.push({ row: i + 1, error: 'Falta el título' })
        continue
      }

      // Map property type
      const rawType = (row.property_type || 'apartment').toLowerCase()
      const propertyType = PROPERTY_TYPE_MAP[rawType] || rawType
      if (!VALID_PROPERTY_TYPES.includes(propertyType)) {
        results.errors.push({ row: i + 1, error: `Tipo de propiedad no válido: ${rawType}. Usa: ${VALID_PROPERTY_TYPES.join(', ')}` })
        continue
      }

      // Map operation type
      const rawOp = (row.operation_type || 'sale').toLowerCase()
      const operationType = OPERATION_TYPE_MAP[rawOp] || rawOp
      if (!VALID_OPERATION_TYPES.includes(operationType)) {
        results.errors.push({ row: i + 1, error: `Tipo de operación no válido: ${rawOp}. Usa: venta, alquiler, vacacional` })
        continue
      }

      // Generate slug
      const slug = row.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36)

      // Parse features
      const features = row.features
        ? row.features.split(/[,;|]/).map(f => f.trim()).filter(Boolean)
        : []

      const propertyData: Record<string, any> = {
        agent_id: user.id,
        title: row.title,
        slug,
        description: row.description || null,
        property_type: propertyType,
        operation_type: operationType,
        price: row.price ? parseFloat(row.price) : null,
        price_per_night: row.price_per_night ? parseFloat(row.price_per_night) : null,
        bedrooms: row.bedrooms ? parseInt(row.bedrooms) : null,
        bathrooms: row.bathrooms ? parseInt(row.bathrooms) : null,
        size_m2: row.size_m2 ? parseFloat(row.size_m2) : null,
        location: row.location || null,
        zone: row.zone || null,
        address: row.address || null,
        latitude: row.latitude ? parseFloat(row.latitude) : null,
        longitude: row.longitude ? parseFloat(row.longitude) : null,
        features: features.length > 0 ? features : null,
        floor: row.floor ? parseInt(row.floor) : null,
        year_built: row.year_built ? parseInt(row.year_built) : null,
        reference_code: row.reference_code || null,
        status: 'draft',
        is_active: true,
      }

      const { error: insertError } = await supabase
        .from('properties')
        .insert(propertyData)

      if (insertError) {
        results.errors.push({ row: i + 1, error: insertError.message })
      } else {
        results.success++
      }
    }

    return NextResponse.json({
      total: rows.length,
      success: results.success,
      errors: results.errors,
      message: `${results.success} propiedades importadas correctamente${results.errors.length > 0 ? `, ${results.errors.length} con errores` : ''}`,
    })
  } catch (err) {
    console.error('Import error:', err)
    return NextResponse.json({ error: 'Error interno al importar' }, { status: 500 })
  }
}
