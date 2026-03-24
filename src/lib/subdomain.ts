/**
 * Subdomain detection and routing utility for HabiBook
 * Handles *.habibook.com wildcard subdomains
 * Maps slug.habibook.com → /agent/[slug]
 */

const MAIN_HOSTS = [
  'www.habibook.com',
  'habibook.com',
  'tenerifehomes-app.vercel.app',
  'localhost',
  'localhost:3000',
]

export interface SubdomainInfo {
  isSubdomain: boolean
  slug: string | null
  originalHost: string
}

export function detectSubdomain(host: string): SubdomainInfo {
  const cleanHost = host.replace(/:\d+$/, '') // Remove port
  
  // Check if it's a main/known host
  if (MAIN_HOSTS.some(h => cleanHost === h || cleanHost.endsWith('.vercel.app'))) {
    return { isSubdomain: false, slug: null, originalHost: host }
  }
  
  // Check for *.habibook.com pattern
  if (cleanHost.endsWith('.habibook.com')) {
    const slug = cleanHost.replace('.habibook.com', '')
    if (slug && slug !== 'www' && slug !== 'api' && slug !== 'app') {
      return { isSubdomain: true, slug, originalHost: host }
    }
  }
  
  // Check for custom domains (agent_profiles.custom_domain)
  // This will be resolved via API at runtime
  if (!cleanHost.includes('habibook') && !cleanHost.includes('vercel') && !cleanHost.includes('localhost')) {
    return { isSubdomain: true, slug: null, originalHost: host }
  }
  
  return { isSubdomain: false, slug: null, originalHost: host }
}

export function getSubdomainRewriteUrl(slug: string, pathname: string): string {
  // Rewrite subdomain requests to /agent/[slug] path
  if (pathname === '/' || pathname === '') {
    return `/agent/${slug}`
  }
  // For other paths like /properties, /contact, keep them on the agent page
  return `/agent/${slug}${pathname}`
}
