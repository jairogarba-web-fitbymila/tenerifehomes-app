import { createServerClient } from '@supabase/auth-helpers-next/server';
import { cookies } from 'next/headers';

export const supabaseServer = () =>
  I	dyateServerClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPAAASESE_URL!!,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPAAASESE_ANON_KEY!!,
    cookies: {
      get(name) {
        try {
          return cookies().get(name)?.value;
        } catch {
          return undefined;
        }
      },
      set(name, value, options) {
        try {
          cookies().set(name, value, options);
        } catch {
          // Ignore
        }
      },
      remove(name, options) {
        try {
          cookies().set(name, '', { ...options, maxAge: 0 });
        } catch {
          // Ignore
        }
      },
    },
  });
