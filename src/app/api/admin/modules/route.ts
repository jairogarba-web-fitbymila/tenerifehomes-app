import { createClient, createAdminClient } from '@/lib/supabase-server'
import { ModuleOverride } from '@/lib/modules'

async function isUserAdmin(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('platform_admins')
    .select('id')
    .eq('user_id', userId)
    .single()

  return !error && !!data
}

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

    // Verify user is admin
    const isAdmin = await isUserAdmin(user.id)
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get all agents with their overrides
    const { data: agentsData, error: agentsError } = await supabase
      .from('agent_profiles')
      .select(
        `
        id,
        user_id,
        business_name,
        email,
        plan,
        template,
        slug,
        business_type,
        is_active,
        created_at,
        agent_module_overrides (
          module_id,
          is_enabled,
          reason,
          expires_at
        )
      `
      )
      .order('created_at', { ascending: false })

    if (agentsError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch agents' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ agents: agentsData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in GET /api/admin/modules:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function PUT(request: Request) {
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

    // Verify user is admin
    const isAdmin = await isUserAdmin(user.id)
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await request.json()
    const { agent_id, module_id, is_enabled, reason, expires_at } = body

    if (!agent_id || !module_id || typeof is_enabled !== 'boolean') {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: agent_id, module_id, is_enabled' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Use admin client for upsert
    function getSupabaseAdmin() {
      return createAdminClient()
    }

    const adminClient = getSupabaseAdmin()
    const { data, error } = await adminClient
      .from('agent_module_overrides')
      .upsert(
        {
          agent_id,
          module_id,
          is_enabled,
          reason: reason || null,
          expires_at: expires_at || null,
        },
        {
          onConflict: 'agent_id,module_id',
        }
      )
      .select()

    if (error) {
      console.error('Upsert error:', error)
      return new Response(JSON.stringify({ error: 'Failed to update override' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ override: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/modules:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
