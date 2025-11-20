import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-client';
import { fetchLavanderias } from './api';

export type LavanderiaSummary = {
  id: string;
  nombre: string;
  slug: string | null;
  descripcion: string | null;
  config: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

const fetchLavanderiaById = async (id: string): Promise<LavanderiaSummary | null> => {
  const supabase = getBrowserClient();

  const { data, error } = await supabase
    .from('lavanderias')
    .select('id, nombre, slug, descripcion, config, created_at, updated_at')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const row = data as {
    id: string;
    nombre: string;
    slug: string | null;
    descripcion: string | null;
    config: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
  };

  return {
    id: row.id,
    nombre: row.nombre,
    slug: row.slug ?? null,
    descripcion: row.descripcion ?? null,
    config: row.config ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

export const useLavanderia = (id: string) =>
  useQuery({
    queryKey: queryKeys.lavanderias.detail(id),
    queryFn: () => fetchLavanderiaById(id),
    enabled: Boolean(id),
    staleTime: 30 * 60 * 1000,
  });

export const useLavanderiasList = () =>
  useQuery({
    queryKey: queryKeys.lavanderias.lists(),
    queryFn: fetchLavanderias,
    staleTime: 60 * 1000,
  });
