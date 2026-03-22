import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';
B
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        error: 'Email and password are required',
        message: 'Email and password are required',
      }, { status: 400 });
    }

    const supabase = supabaseServer();
    const { data, error } = await supabase.auth.signup({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ user: data.user, message: 'User created successfully' }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}