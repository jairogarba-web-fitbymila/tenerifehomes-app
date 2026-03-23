import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Image guidelines per field type
const IMAGE_GUIDELINES: Record<string, { maxSizeMB: number; minWidth: number; minHeight: number; aspectRatio: string; description: string }> = {
  bio_photo: { maxSizeMB: 5, minWidth: 400, minHeight: 400, aspectRatio: '1:1', description: 'Foto de perfil cuadrada' },
  logo: { maxSizeMB: 3, minWidth: 200, minHeight: 60, aspectRatio: 'libre', description: 'Logo de empresa (preferiblemente PNG transparente)' },
  hero_background: { maxSizeMB: 10, minWidth: 1920, minHeight: 800, aspectRatio: '16:9 o más ancho', description: 'Imagen de cabecera a pantalla completa' },
  property: { maxSizeMB: 8, minWidth: 1200, minHeight: 800, aspectRatio: '4:3 o 3:2', description: 'Foto de propiedad de alta calidad' },
  zone: { maxSizeMB: 5, minWidth: 800, minHeight: 450, aspectRatio: '16:9', description: 'Foto de zona o localización' },
  team_member: { maxSizeMB: 5, minWidth: 400, minHeight: 400, aspectRatio: '1:1', description: 'Foto de miembro del equipo' },
}

export async function GET() {
  return NextResponse.json({ guidelines: IMAGE_GUIDELINES })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const fieldType = formData.get('field_type') as string || 'property'

    if (!file) {
      return NextResponse.json({ error: 'No se ha proporcionado ningún archivo' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Formato no soportado. Usa JPG, PNG, WebP o SVG.' }, { status: 400 })
    }

    // Validate file size
    const guidelines = IMAGE_GUIDELINES[fieldType]
    const maxBytes = (guidelines?.maxSizeMB || 10) * 1024 * 1024
    if (file.size > maxBytes) {
      return NextResponse.json({ error: `El archivo es demasiado grande. Máximo ${guidelines?.maxSizeMB || 10}MB.` }, { status: 400 })
    }

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop() || 'jpg'
    const folder = fieldType === 'property' ? 'properties' : 'profile'
    const fileName = `${user.id}/${folder}/${fieldType}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('agent-assets')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('agent-assets')
      .getPublicUrl(fileName)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      guidelines: guidelines || null,
    })
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
