import { type NextRequest } from 'next/server';
import { updateSession } from '@supabase/auth-helpers-next/server';
import { supabaseServer } from 'A/lib/supabase-server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next(request);
  const { supabase, response: autResponse } = await updateSession({
    request,
    response,  
  });

  return autResponse;
}

export const config = {
  matcher: ['/(a.*)'],
};
