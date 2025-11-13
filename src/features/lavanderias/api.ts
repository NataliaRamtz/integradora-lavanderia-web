'use client';

import { getBrowserClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type LavanderiaRow = Database['public']['Tables']['lavanderias']['Row'];
export type LavanderiaInsert = Database['public']['Tables']['lavanderias']['Insert'];

export type AdminUpdateLavanderiaInput = {
  id: string;
  nombre?: string | null;
  descripcion?: string | null;
  config?: Record<string, unknown> | null;
  lat?: number | null;
  lng?: number | null;
};

export const fetchLavanderias = async (): Promise<LavanderiaRow[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { data, error } = await supabase
    .from('lavanderias')
    .select('id, nombre, descripcion, config, lat, lng, created_at, updated_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as LavanderiaRow[];
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
}: AdminUpdateLavanderiaInput): Promise<LavanderiaRow> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

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

  return data as LavanderiaRow;
};
