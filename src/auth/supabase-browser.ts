import { createBrowserClient } from "@supabase/ssr"
import { env } from "@/src/config/env"

export const createSupabaseBrowserClient = () =>
  createBrowserClient(env.supabaseUrl, env.supabaseAnonKey)
