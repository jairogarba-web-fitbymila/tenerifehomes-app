import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
B
interface Lead {
  name: string;
  email: string;
  phone: string;
  propertyId?: string;
  agentId?: string;  
  message?: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = supabaseServer();
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    return NextResponse.json(leads);
  } catch (err) {
    return NextResponse.json(
      { error: 'Error fetching leads' },
      { status: 500 }
    (}
    (}

Export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Lead;
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from('leads')
      .insert([lead])
      .select();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Error creating lead' },
      { status: 500 }
    );
  }
}