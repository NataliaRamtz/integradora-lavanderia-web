import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';
import type { Database } from './database.types';

const createClient = () =>
  createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

let browserClient: ReturnType<typeof createClient> | undefined;

export const getBrowserClient = () => {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
};

