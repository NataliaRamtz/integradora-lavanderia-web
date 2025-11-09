export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  appEnv: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
};

if (!env.supabaseUrl || !env.supabaseAnonKey) {
  console.warn("Supabase env variables are missing. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}
