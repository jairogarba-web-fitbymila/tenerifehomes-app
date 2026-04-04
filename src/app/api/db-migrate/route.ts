import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getSupabaseAdmin()
  const results: any[] = []

  // Step 1: Add is_published column to agent_profiles
  const { error: alterError } = await supabase.rpc('exec_sql', {
    query: `ALTER TABLE agent_profiles ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;`
  }).single()

  if (alterError) {
    // If exec_sql doesn't exist, try a direct approach: check if column exists first
    const { data: colCheck } = await supabase
      .from('agent_profiles')
      .select('is_published')
      .limit(1)

    if (colCheck !== null) {
      results.push({ step: '1. is_published column', status: 'already exists' })
    } else {
      // Column doesn't exist — we need to create it via a different method
      // Try using the Supabase Management API or a raw SQL approach
      results.push({
        step: '1. is_published column',
        status: 'FAILED - exec_sql not available',
        error: alterError.message,
        workaround: 'Need to add column manually in Supabase dashboard or via Management API'
      })
    }
  } else {
    results.push({ step: '1. is_published column', status: 'created successfully' })
  }

  // Step 2: Check current state of stripe_customers table
  const { data: stripeCustomers, error: scError } = await supabase
    .from('stripe_customers')
    .select('*')
    .limit(5)

  results.push({
    step: '2. stripe_customers table check',
    count: stripeCustomers?.length ?? 0,
    sample: stripeCustomers?.[0] ?? null,
    error: scError?.message ?? null
  })

  // Step 3: Check agent_profiles plan field
  const { data: agents, error: agError } = await supabase
    .from('agent_profiles')
    .select('id, email, plan')
    .limit(3)

  results.push({
    step: '3. agent_profiles check',
    agents: agents ?? [],
    error: agError?.message ?? null
  })

  return NextResponse.json({ migration: 'is_published + diagnostics', results })
}
