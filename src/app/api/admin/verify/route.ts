import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// Admin user IDs — add authorized admins here
const ADMIN_IDS = [
  '8e740f7f-5369-4910-af70-c0cb791d7272', // jairogarba@gmail.com
]

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 })
    }

    const isAdmin = ADMIN_IDS.includes(user.id)

    return NextResponse.json({ isAdmin, role: isAdmin ? 'super_admin' : 'agent' })
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
