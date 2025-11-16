import { z } from 'zod';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url({ message: 'NEXT_PUBLIC_SUPABASE_URL debe ser una URL válida' }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, { message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY es requerida' }),
  NEXT_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
});

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_DB_PASSWORD: z.string().optional(),
});

/*const readPublicEnv = () => ({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
});*/

const readPublicEnv = () => {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  const appEnv =
    process.env.NEXT_PUBLIC_APP_ENV ?? process.env.EXPO_PUBLIC_APP_ENV;

  return {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey,
    NEXT_PUBLIC_APP_ENV: appEnv,
  };
};

const readServerEnv = () => ({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_DB_PASSWORD: process.env.SUPABASE_DB_PASSWORD,
});

const publicParsed = publicEnvSchema.safeParse(readPublicEnv());

if (!publicParsed.success) {
  console.error('❌ Variables públicas inválidas:', publicParsed.error.flatten());
  throw new Error('Variables NEXT_PUBLIC_* inválidas. Revisa tu .env');
}

const serverParsed = serverEnvSchema.safeParse(readServerEnv());

if (!serverParsed.success) {
  console.warn('⚠️ Variables privadas opcionales inválidas:', serverParsed.error.flatten());
}

export const env = Object.freeze({
  ...publicParsed.data,
  ...serverParsed.data,
});

export const isDevelopment = env.NEXT_PUBLIC_APP_ENV === 'development';
export const isProduction = env.NEXT_PUBLIC_APP_ENV === 'production';

