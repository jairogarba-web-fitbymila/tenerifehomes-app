import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SITE_PASSWORD = process.env.SITE_PASSWORD || 'Jairo300585'

export async function middleware(request: NextRequest) {
  // --- SITE-WIDE PASSWORD PROTECTION ---
  // Allow the password page and its API to load without check
  if (
    request.nextUrl.pathname === '/password' ||
    request.nextUrl.pathname === '/api/password' ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Check for site access cookie
  const siteAccess = request.cookies.get('site-access')?.value
  if (siteAccess !== 'granted') {
    const url = request.nextUrl.clone()
    url.pathname = '/password'
    return NextResponse.redirect(url)
  }

  // --- EXISTING SUPABASE AUTH LOGIC ---
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Allow root path for all users (cinematic landing page, no auth required)
  if (request.nextUrl.pathname === '/') {
    return supabaseResponse
  }

  // Protected routes — redirect to login if not authenticated
  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Already logged in — redirect away from auth pages
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
