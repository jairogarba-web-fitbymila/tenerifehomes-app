import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// GET: Fetch all available modules + agent's active modules
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all module definitions
    const { data: modules } = await supabase
      .from('module_definitions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    // Fetch agent's active modules
    const { data: agentModules } = await supabase
      .from('agent_modules')
      .select('*')
      .eq('agent_id', user.id)

    // Fetch stripe customer info
    const { data: stripeCustomer } = await supabase
      .from('stripe_customers')
      .select('*')
      .eq('agent_id', user.id)
      .single()

    return NextResponse.json({
      modules: modules || [],
      agentModules: agentModules || [],
      stripeCustomer: stripeCustomer || null,
    })
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Toggle a module on/off for the agent
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { module_slug, action } = await request.json()

    if (action === 'activate') {
      const { data, error } = await supabase
        .from('agent_modules')
        .upsert({
          agent_id: user.id,
          module_slug,
          is_active: true,
          activated_at: new Date().toISOString(),
        }, { onConflict: 'agent_id,module_slug' })
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, module: data })
    }

    if (action === 'deactivate') {
      const { error } = await supabase
        .from('agent_modules')
        .update({ is_active: false })
        .eq('agent_id', user.id)
        .eq('module_slug', module_slug)

      if (error) throw error
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
