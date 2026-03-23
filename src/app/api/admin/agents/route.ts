import { createClient, createAdminClient } from '@/lib/supabase-server'
import { PlanType } from '@/lib/modules'

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

    // Get all agent profiles with stats
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
        created_at
      `
      )
      .order('created_at', { ascending: false })

    if (agentsError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch agents' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get stats for each agent (property count, lead count, section count)
    const agentsWithStats = await Promise.all(
      (agentsData || []).map(async (agent) => {
        const [propertiesRes, leadsRes, sectionsRes] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('agent_id', agent.id),
          supabase.from('leads').select('id', { count: 'exact', head: true }).eq('agent_id', agent.id),
          supabase.from('sections').select('id', { count: 'exact', head: true }).eq('agent_id', agent.id),
        ])

        return {
          ...agent,
          propertyCount: propertiesRes.count || 0,
          leadCount: leadsRes.count || 0,
          sectionCount: sectionsRes.count || 0,
        }
      })
    )

    return new Response(JSON.stringify({ agents: agentsWithStats }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in GET /api/admin/agents:', error)
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
    const { agent_id, plan, is_active } = body

    if (!agent_id) {
      return new Response(JSON.stringify({ error: 'Missing required field: agent_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Build update object with only provided fields
    const updateData: Record<string, any> = {}
    if (plan !== undefined) {
      if (!['starter', 'pro', 'premium', 'agency'].includes(plan)) {
        return new Response(JSON.stringify({ error: 'Invalid plan type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      updateData.plan = plan as PlanType
    }
    if (is_active !== undefined) {
      updateData.is_active = is_active
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Use admin client for update
    function getSupabaseAdmin() {
      return createAdminClient()
    }

    const adminClient = getSupabaseAdmin()
    const { data, error } = await adminClient
      .from('agent_profiles')
      .update(updateData)
      .eq('id', agent_id)
      .select()

    if (error) {
      console.error('Update error:', error)
      return new Response(JSON.stringify({ error: 'Failed to update agent' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ error: 'Agent not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ agent: data[0] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in PUT /api/admin/agents:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
