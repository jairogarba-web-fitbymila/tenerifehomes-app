import { createClient } from '@/lib/supabase-server'
import { PlatformModule, ModuleOverride, PlanType } from '@/lib/modules'

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get agent profile for this user
    const { data: agentData, error: agentError } = await supabase
      .from('agent_profiles')
      .select('id, plan')
      .eq('user_id', user.id)
      .single()

    if (agentError || !agentData) {
      return new Response(JSON.stringify({ error: 'Agent profile not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get all platform modules ordered by display_order
    const { data: modulesData, error: modulesError } = await supabase
      .from('platform_modules')
      .select('id, name, description, category, icon, min_plan, is_addon, addon_price, display_order')
      .order('display_order', { ascending: true })

    if (modulesError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch modules' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get agent module overrides
    const { data: overridesData, error: overridesError } = await supabase
      .from('agent_module_overrides')
      .select('module_id, is_enabled, reason, expires_at')
      .eq('agent_id', agentData.id)

    if (overridesError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch overrides' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const modules = (modulesData || []) as PlatformModule[]
    const overrides = (overridesData || []) as ModuleOverride[]
    const plan = agentData.plan as PlanType

    return new Response(
      JSON.stringify({
        modules,
        overrides,
        plan,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in GET /api/dashboard/modules:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
