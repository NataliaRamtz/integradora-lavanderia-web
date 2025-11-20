'use client';

import { getBrowserClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type LavanderiaRow = Database['public']['Tables']['lavanderias']['Row'];
export type LavanderiaInsert = Database['public']['Tables']['lavanderias']['Insert'];

export type LavanderiaWithEncargado = LavanderiaRow & {
  encargado_email: string | null;
  encargado_usuario_id: string | null;
};

export type AdminUpdateLavanderiaInput = {
  id: string;
  nombre?: string | null;
  descripcion?: string | null;
  config?: Record<string, unknown> | null;
  lat?: number | null;
  lng?: number | null;
  encargado_email?: string | null;
};

export const fetchLavanderias = async (): Promise<LavanderiaWithEncargado[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { data: lavanderiasData, error: lavanderiasError } = await supabase
    .from('lavanderias')
    .select('id, nombre, descripcion, config, lat, lng, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (lavanderiasError) {
    throw lavanderiasError;
  }

  if (!lavanderiasData || lavanderiasData.length === 0) {
    return [];
  }

  // Obtener encargados para cada lavandería usando RPC
  const lavanderiasWithEncargado = await Promise.all(
    lavanderiasData.map(async (lavanderia) => {
      try {
        const { data: encargadoData, error: encargadoError } = await supabase.rpc(
          'admin_get_encargado_email',
          { p_lavanderia_id: lavanderia.id }
        );

        if (encargadoError) {
          console.error('[Lavanderias] Error al obtener encargado', encargadoError);
          return {
            ...lavanderia,
            encargado_email: null,
            encargado_usuario_id: null,
          } as LavanderiaWithEncargado;
        }

        // La función RPC devuelve una tabla, puede ser un array o un objeto único
        const encargado = Array.isArray(encargadoData) 
          ? encargadoData[0] 
          : encargadoData;

        return {
          ...lavanderia,
          encargado_email: (encargado as { email: string | null; usuario_id: string | null } | null)?.email ?? null,
          encargado_usuario_id: (encargado as { email: string | null; usuario_id: string | null } | null)?.usuario_id ?? null,
        } as LavanderiaWithEncargado;
      } catch (error) {
        console.error('[Lavanderias] Error al obtener encargado', error);
        return {
          ...lavanderia,
          encargado_email: null,
          encargado_usuario_id: null,
        } as LavanderiaWithEncargado;
      }
    })
  );

  return lavanderiasWithEncargado;
};

export const createLavanderia = async (payload: LavanderiaInsert): Promise<LavanderiaRow> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;
  const insertPayload: LavanderiaInsert[] = [payload];

  const { data, error } = await supabase
    .from('lavanderias')
    .insert(insertPayload)
    .select('id, nombre, descripcion, config, lat, lng, created_at, updated_at')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No pudimos crear la lavandería. Intenta nuevamente.');
  }

  return data as LavanderiaRow;
};

export const updateLavanderia = async ({
  id,
  nombre,
  descripcion,
  config,
  lat,
  lng,
  encargado_email,
}: AdminUpdateLavanderiaInput): Promise<LavanderiaRow> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  // Actualizar la lavandería
  const { data, error } = await supabase.rpc('admin_update_lavanderia', {
    p_id: id,
    p_nombre: nombre ?? null,
    p_descripcion: descripcion ?? null,
    p_config: config ?? null,
    p_lat: typeof lat === 'number' ? lat : null,
    p_lng: typeof lng === 'number' ? lng : null,
  });

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No pudimos actualizar la lavandería.');
  }

  // Si se proporcionó un nuevo email, actualizar el email del encargado
  if (encargado_email !== undefined) {
    try {
      // Obtener el usuario_id del encargado
      const { data: encargadoData } = await supabase
        .from('roles_app')
        .select('usuario_id')
        .eq('lavanderia_id', id)
        .eq('rol', 'encargado')
        .eq('activo', true)
        .limit(1)
        .maybeSingle();

      if (encargadoData?.usuario_id && encargado_email) {
        // Actualizar el email usando la función admin_update_usuario
        // Primero necesitamos obtener el usuario_app_id
        const { data: usuarioAppData } = await supabase
          .from('usuarios_app')
          .select('id')
          .eq('usuario_id', encargadoData.usuario_id)
          .limit(1)
          .maybeSingle();

        if (usuarioAppData?.id) {
          // Obtener el perfil actual para mantener los datos
          const { data: perfilData } = await supabase
            .from('perfiles_app')
            .select('perfil')
            .eq('usuario_id', encargadoData.usuario_id)
            .maybeSingle();

          const perfil = (perfilData?.perfil as Record<string, unknown>) || {};
          const nombre = (perfil.firstName as string) || '';
          const apellido = (perfil.lastName as string) || '';
          const telefono = (perfil.phone as string) || '';

          // Actualizar el usuario
          await supabase.rpc('admin_update_usuario', {
            p_usuario_app_id: usuarioAppData.id,
            p_nombre: nombre,
            p_apellido: apellido,
            p_email: encargado_email,
            p_telefono: telefono,
            p_rol: 'encargado',
            p_activo: true,
          });
        }
      }
    } catch (emailError) {
      console.error('[Lavanderias] Error al actualizar email del encargado', emailError);
      // No lanzamos el error para que la actualización de la lavandería no falle
    }
  }

  return data as LavanderiaRow;
};

export const deleteLavanderia = async (id: string): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { error } = await supabase.from('lavanderias').delete().eq('id', id);

  if (error) {
    throw error;
  }
};