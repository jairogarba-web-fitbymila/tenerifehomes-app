import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient()
    const slug = params.slug

    // Fetch agent profile
    const { data: agent, error: agentError } = await supabase
      .from('agent_profiles')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    // Fetch active sections
    const { data: sections } = await supabase
      .from('agent_sections')
      .select('*')
      .eq('agent_id', agent.id)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    // Fetch properties
    const { data: properties } = await supabase
      .from('properties')
      .select('*')
      .eq('agent_id', agent.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    // Fetch hero config
    const { data: heroConfigs } = await supabase
      .from('hero_config')
      .select('*')
      .eq('agent_id', agent.id)
      .single()

    // Fetch testimonials
    const { data: testimonials } = await supabase
      .from('testimonials')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false })

    // Fetch team members
    const { data: team } = await supabase
      .from('team_members')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false })

    // Fetch services
    const { data: services } = await supabase
      .from('services')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false })

    // Fetch zones
    const { data: zones } = await supabase
      .from('zones')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_at', { ascending: false })

    return NextResponse.json({
      agent,
      sections: sections || [],
      properties: properties || [],
      hero: heroConfigs || null,
      testimonials: testimonials || [],
      team: team || [],
      services: services || [],
      zones: zones || [],
    })
  } catch (error) {
    console.error('Error fetching agent data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
