import { createSupabaseServerClient } from "@/src/auth/supabase-server"

export const authServerService = {
  async getSession() {
    const supabase = createSupabaseServerClient()
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  async getUserWithRole() {
    const supabase = createSupabaseServerClient()
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
    return { user, role: data }
  },
}
