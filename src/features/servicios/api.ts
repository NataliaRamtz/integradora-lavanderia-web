import { getBrowserClient } from '@/lib/supabase';

export type ServicioResumen = {
  id: string;
  nombre: string;
  precio: number;
  unidad?: string;
  descripcion?: string | null;
};

export type Servicio = {
  id: string;
  lavanderiaId: string;
  nombre: string;
  descripcion?: string | null;
  unidad?: 'pieza' | 'kg' | 'servicio' | null;
  precio: number;
  categoria?: string | null;
  imagenUrl?: string | null;
  orden?: number | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ServicioInput = {
  nombre: string;
  descripcion?: string | null;
  unidad?: string | null;
  precio: number;
  categoria?: string | null;
  imagenUrl?: string | null;
  orden?: number | null;
  activo?: boolean;
};

export const fetchServiciosResumen = async ({
  lavanderiaId,
  limit = 6,
}: {
  lavanderiaId: string;
  limit?: number;
}): Promise<ServicioResumen[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { data, error } = await supabase
    .from('servicios')
    .select('id, nombre, precio, unidad, descripcion')
    .eq('lavanderia_id', lavanderiaId)
    .eq('activo', true)
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return ((data ?? []) as Array<{
    id: string;
    nombre: string;
    precio: number;
    unidad: string | null;
    descripcion: string | null;
  }>).map((servicio) => ({
    id: servicio.id,
    nombre: servicio.nombre,
    precio: servicio.precio,
    unidad: servicio.unidad ?? undefined,
    descripcion: servicio.descripcion ?? undefined,
  }));
};

export const fetchServicios = async ({
  lavanderiaId,
}: {
  lavanderiaId: string;
}): Promise<Servicio[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { data, error } = await supabase
    .from('servicios')
    .select(
      `id, lavanderia_id, nombre, descripcion, unidad, precio, categoria, imagen_url, orden, activo, created_at, updated_at`
    )
    .eq('lavanderia_id', lavanderiaId)
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as Array<{
    id: string;
    lavanderia_id: string;
    nombre: string;
    descripcion: string | null;
    unidad: string | null;
    precio: number;
    categoria: string | null;
    imagen_url: string | null;
    orden: number | null;
    activo: boolean;
    created_at: string;
    updated_at: string;
  }>).map((row) => ({
    id: row.id,
    lavanderiaId: row.lavanderia_id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    unidad: (row.unidad as 'pieza' | 'kg' | 'servicio' | null) ?? null,
    precio: row.precio,
    categoria: row.categoria,
    imagenUrl: row.imagen_url,
    orden: row.orden,
    activo: row.activo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const createServicio = async ({
  lavanderiaId,
  data,
}: {
  lavanderiaId: string;
  data: ServicioInput;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { error } = await supabase.from('servicios').insert({
    lavanderia_id: lavanderiaId,
    nombre: data.nombre,
    descripcion: data.descripcion ?? null,
    unidad: data.unidad ?? null,
    precio: data.precio,
    categoria: data.categoria ?? null,
    imagen_url: data.imagenUrl ?? null,
    orden: data.orden ?? null,
    activo: data.activo ?? true,
  });

  if (error) {
    throw error;
  }
};

export const updateServicio = async ({
  servicioId,
  data,
}: {
  servicioId: string;
  data: ServicioInput;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { error } = await supabase
    .from('servicios')
    .update({
      nombre: data.nombre,
      descripcion: data.descripcion ?? null,
      unidad: data.unidad ?? null,
      precio: data.precio,
      categoria: data.categoria ?? null,
      imagen_url: data.imagenUrl ?? null,
      orden: data.orden ?? null,
      activo: data.activo ?? true,
    })
    .eq('id', servicioId);

  if (error) {
    throw error;
  }
};

export const toggleServicioActivo = async ({
  servicioId,
  activo,
}: {
  servicioId: string;
  activo: boolean;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const { error } = await supabase
    .from('servicios')
    .update({ activo })
    .eq('id', servicioId);

  if (error) {
    throw error;
  }
};
