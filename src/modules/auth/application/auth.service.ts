import { createSupabaseBrowserClient } from "@/src/auth/supabase-browser"
import { loginSchema, signUpSchema } from "@/src/validation/auth"

export const authService = {
  async signInWithPassword(input: unknown) {
    const raw =
      typeof input === "object" && input !== null
        ? (input as { email?: unknown; password?: unknown })
        : { email: undefined, password: undefined }

    const result = loginSchema.safeParse({
      email: typeof raw.email === "string" ? raw.email : raw.email ?? "",
      password: typeof raw.password === "string" ? raw.password : raw.password ?? "",
    })

    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? "Ingresa credenciales válidas.")
    }

    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signInWithPassword(result.data)
    if (error) throw error
  },

  async signUpWithPassword(input: unknown) {
    const raw =
      typeof input === "object" && input !== null
        ? (input as { email?: unknown; password?: unknown; laundryName?: unknown })
        : {}

    const result = signUpSchema.safeParse({
      email: typeof raw.email === "string" ? raw.email : raw.email ?? "",
      password: typeof raw.password === "string" ? raw.password : raw.password ?? "",
      laundryName: typeof raw.laundryName === "string" ? raw.laundryName : raw.laundryName ?? "",
    })

    if (!result.success) {
      throw new Error(result.error.issues[0]?.message ?? "Revisa la información ingresada.")
    }

    const supabase = createSupabaseBrowserClient()
    const { error, data } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
    })
    if (error) throw error

    return { ...data, role: "encargado" as const, laundryName: result.data.laundryName }
  },

  async signOut() {
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentRole() {
    const supabase = createSupabaseBrowserClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) return null

    const { data, error } = await supabase
      .from("roles_app")
      .select("rol, lavanderia_id")
      .eq("usuario_id", user.id)
      .eq("activo", true)
      .maybeSingle()

    if (error) throw error
    return data
  },
}
