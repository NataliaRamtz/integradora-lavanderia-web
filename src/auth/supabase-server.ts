import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { env } from "@/src/config/env"

export const createSupabaseServerClient = () =>
  createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookies().get(name)?.value
      },
      set(name, value, options) {
        cookies().set({ name, value, ...options })
      },
      remove(name, options) {
        cookies().set({ name, value: "", ...options, maxAge: 0 })
      },
    },
  })
