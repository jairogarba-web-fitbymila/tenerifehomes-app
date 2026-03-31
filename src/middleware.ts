import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { detectSubdomain, getSubdomainRewriteUrl } from '@/lib/subdomain'

const SITE_PASSWORD = process.env.SITE_PASSWORD

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // === SUBDOMAIN DETECTION ===
  const host = request.headers.get('host') || ''
  const subdomain = detectSubdomain(host)
  
  if (subdomain.isSubdomain && subdomain.slug) {
    // Rewrite subdomain requests to agent page
    // Skip rewrite for API routes and static assets
    if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
      const rewriteUrl = getSubdomainRewriteUrl(subdomain.slug, pathname)
      const url = request.nextUrl.clone()
      url.pathname = rewriteUrl
      const response = NextResponse.rewrite(url)
      response.headers.set('x-subdomain-slug', subdomain.slug)
      return response
    }
  }
  
  // === SITE-WIDE PASSWORD PROTECTION ===
  // Skip password check for certain paths
  const isPublicPath = pathname.startsWith('/api/') || 
    pathname.startsWith('/_next/') || 
    pathname === '/favicon.ico' ||
    pathname.startsWith('/auth/')
  
  if (!isPublicPath && SITE_PASSWORD) {
    const siteAuthCookie = request.cookies.get('site_auth')
    if (!siteAuthCookie || siteAuthCookie.value !== 'authenticated') {
      // Check if this is a password submission
      if (request.method === 'POST' && pathname === '/verify-password') {
        try {
          const formData = await request.formData()
          const password = formData.get('password')
          if (password === SITE_PASSWORD) {
            const response = NextResponse.redirect(new URL('/', request.url))
            response.cookies.set('site_auth', 'authenticated', {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 30, // 30 days
            })
            return response
          }
        } catch (e) {
          // Fall through to password page
        }
      }
      
      // Show password page if not authenticated
      if (pathname !== '/password' && !pathname.startsWith('/agent/')) {
        return NextResponse.redirect(new URL('/password', request.url))
      }
    }
  }
  
  // === SUPABASE AUTH ===
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
