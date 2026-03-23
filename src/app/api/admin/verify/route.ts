import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ isAdmin: false, role: null }, { status: 401 })
    }

    // Check if user is in platform_admins table
    const { data: adminData, error: adminError } = await supabase
      .from('platform_admins')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (adminError || !adminData) {
      return NextResponse.json({ isAdmin: false, role: null })
    }

    return NextResponse.json({
      isAdmin: true,
      role: adminData.role || 'super_admin',
      userId: user.id,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/verify:', error)
    return NextResponse.json({ isAdmin: false, role: null }, { status: 500 })
  }
}
