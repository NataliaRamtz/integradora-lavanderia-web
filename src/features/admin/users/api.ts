import { getBrowserClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type AdminUser = {
  id: string;
  usuario_id: string;
  rol: Database['public']['Enums']['app_rol'];
  activo: boolean;
  perfil: Record<string, unknown>;
  lavanderia_id: string | null;
  lavanderia_nombre: string | null;
  created_at: string;
  updated_at: string;
};

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { data, error } = await supabase.rpc('admin_list_usuarios', {});

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return (data as Array<Record<string, unknown>>).map((row) => {
    return {
      id: row.id as string,
      usuario_id: row.usuario_id as string,
      rol: row.rol as AdminUser['rol'],
      activo: Boolean(row.activo),
      perfil: ((row.perfil as Record<string, unknown> | null) ?? {}) as Record<string, unknown>,
      lavanderia_id: (row.lavanderia_id as string | null) ?? null,
      lavanderia_nombre: (row.lavanderia_nombre as string | null) ?? null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    } satisfies AdminUser;
  });
};

export type UpdateAdminUserInput = {
  usuarioAppId: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: Database['public']['Enums']['app_rol'];
  activo: boolean;
};

export const updateAdminUser = async ({
  usuarioAppId,
  nombre,
  apellido,
  email,
  telefono,
  rol,
  activo,
}: UpdateAdminUserInput): Promise<AdminUser> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { data, error } = await supabase.rpc('admin_update_usuario', {
    p_usuario_app_id: usuarioAppId,
    p_nombre: nombre,
    p_apellido: apellido,
    p_email: email,
    p_telefono: telefono,
    p_rol: rol,
    p_activo: activo,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No pudimos actualizar al usuario.');
  }

  const row = data as Record<string, unknown>;
  return {
    id: row.id as string,
    usuario_id: row.usuario_id as string,
    rol: row.rol as AdminUser['rol'],
    activo: Boolean(row.activo),
    perfil: ((row.perfil as Record<string, unknown> | null) ?? {}) as Record<string, unknown>,
    lavanderia_id: (row.lavanderia_id as string | null) ?? null,
    lavanderia_nombre: null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  } satisfies AdminUser;
};
