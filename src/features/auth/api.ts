import { getBrowserClient } from '@/lib/supabase';
import { perfilListSchema, rolesListSchema, type PerfilApp, type RolApp } from './schemas';

export const fetchPerfil = async (authUserId: string): Promise<PerfilApp | null> => {
  const supabase = getBrowserClient();

  const { data, error } = await supabase
    .from('perfiles_app')
    .select('*')
    .eq('usuario_id', authUserId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return perfilListSchema.parse(data);
};

export const fetchRoles = async (authUserId: string): Promise<RolApp[]> => {
  const supabase = getBrowserClient();

  const { data, error } = await supabase
    .from('roles_app')
    .select('*')
    .eq('usuario_id', authUserId)
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return rolesListSchema.parse(data ?? []);
};

export const upsertPerfil = async ({
  authUserId,
  perfil,
  preferencias,
}: {
  authUserId: string;
  perfil: Record<string, unknown>;
  preferencias?: Record<string, unknown>;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const payload = {
    usuario_id: authUserId,
    perfil,
    preferencias: preferencias ?? {},
    activo: true,
  };

  const { error } = await supabase
    .from('perfiles_app')
    .upsert(payload, { onConflict: 'usuario_id' });

  if (error) {
    throw error;
  }
};

