import { NextResponse } from 'next/server'

const SITE_PASSWORD = process.env.SITE_PASSWORD
if (!SITE_PASSWORD) {
  console.warn('SITE_PASSWORD env var not set — password protection disabled')
}

export async function POST(request: Request) {
  if (!SITE_PASSWORD) {
    return NextResponse.json({ error: 'Password protection not configured' }, { status: 500 })
  }

  const { password } = await request.json()

  if (password === SITE_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set('site_auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return response
  }

  return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
}
