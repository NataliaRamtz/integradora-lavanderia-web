import { z } from 'zod';
import { Constants } from '@/lib/supabase/database.types';

const rolEnum = z.enum(Constants.public.Enums.app_rol);

export const perfilSchema = z.object({
  usuario_id: z.string(),
  perfil: z
    .record(z.any())
    .catch({})
    .transform((value) => value ?? {}),
  preferencias: z
    .record(z.any())
    .catch({})
    .transform((value) => value ?? {}),
  activo: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const rolSchema = z.object({
  id: z.string(),
  usuario_id: z.string(),
  lavanderia_id: z.string().nullable(),
  rol: rolEnum,
  activo: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const perfilListSchema = perfilSchema.nullable();
export const rolesListSchema = z.array(rolSchema);

export type PerfilApp = z.infer<typeof perfilSchema>;
export type RolApp = z.infer<typeof rolSchema>;

