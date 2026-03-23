import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { business_name, email, password, phone, business_type = 'individual', template = 'luxury', zone } = await request.json()

    if (!business_name || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son obligatorios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    // 1. Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { business_name, phone },
    })

    if (authError) {
      if (authError.message.includes('already been registered')) {
        return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 409 })
      }
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const userId = authData.user.id

    // 2. Create agent profile (triggers auto-create 27 sections + hero_config)
    const slug = business_name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const profileData: Record<string, any> = {
      id: userId,
      email,
      business_name,
      phone: phone || null,
      slug: `${slug}-${userId.slice(0, 6)}`,
      plan: 'starter',
      template,
      business_type,
    }

    // Add zone if provided
    if (zone) {
      profileData.primary_zone = zone
    }

    const { error: profileError } = await supabaseAdmin
      .from('agent_profiles')
      .insert(profileData)

    if (profileError) {
      // Rollback: delete the auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId)
      console.error('Profile creation error:', profileError)
      return NextResponse.json({ error: 'Error creando perfil de agente' }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId })
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
