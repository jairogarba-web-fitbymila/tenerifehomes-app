import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
B
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect('/login?error=' + error, 302);
  }

  if (code) {
    try {
      const supabase = supabaseServer();
      await supabase.auth.exchangeCodeForSession(code || '');
      return NextResponse.redirect('/dashboard', 302);
    } catch (err) {
      return NextResponse.redirect('/login?error=auth_error', 302);
    }
  }

  return NextResponse.redirect('/login', 302);
}