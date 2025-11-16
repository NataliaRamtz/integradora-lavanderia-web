import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { env } from '@/lib/env';
import type { Database } from './database.types';

export const createSupabaseServerClient = () =>
  createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: async (name: string) => {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value ?? null;
        },
        set: async () => {
          // No-op: Server Components cannot set cookies directly.
        },
        remove: async () => {
          // No-op: Server Components cannot remove cookies directly.
        },
      },
    }
  );

