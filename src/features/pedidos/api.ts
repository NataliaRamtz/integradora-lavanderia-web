import { getBrowserClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase/database.types';
import { STAFF_ESTADOS_PRIORIZADOS, type PedidoEstado } from './constants';
import {
  mapPedidoDetalleRow,
  mapPedidoListRow,
  type PedidoPerfilData,
  pedidoDetalleRowSchema,
  pedidoListCollectionSchema,
  type PedidoDetalle,
  type PedidoListItem,
} from './schemas';

export type PedidosDashboardResumen = {
  pendientes: number;
  enProceso: number;
  listos: number;
  completados: number;
  ingresosHoy: number;
  ingresosAyer: number;
  variacionIngresos: number;
};

export type WalkInPedidoItemInput = {
  servicioId: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
  notas?: string;
};

export type CreateWalkInPedidoInput = {
  lavanderiaId: string;
  createdBy?: string | null;
  createdByRoleId?: string | null;
  clienteNombre?: string;
  clienteTelefono?: string;
  notas?: string;
  items: WalkInPedidoItemInput[];
};

export const createWalkInPedido = async (input: CreateWalkInPedidoInput) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const total = input.items.reduce((acc, item) => acc + item.subtotal, 0);
  const notas = [
    input.clienteNombre ? `Cliente: ${input.clienteNombre}` : null,
    input.clienteTelefono ? `Tel: ${input.clienteTelefono}` : null,
    input.notas ? `Notas: ${input.notas}` : null,
  ]
    .filter(Boolean)
    .join(' | ') || null;

  const { data: pedidoData, error: pedidoError } = await supabase
    .from('pedidos')
    .insert({
      lavanderia_id: input.lavanderiaId,
      cliente_usuario: null,
      estado: 'creado',
      notas,
      total,
      created_by: input.createdBy ?? null,
      created_by_role_id: input.createdByRoleId ?? null,
    })
    .select('id')
    .single();

  if (pedidoError) {
    throw pedidoError;
  }

  const pedidoId = pedidoData.id as string;

  if (input.items.length > 0) {
    const { error: itemsError } = await supabase
      .from('pedido_items')
      .insert(
        input.items.map((item) => ({
          pedido_id: pedidoId,
          servicio_id: item.servicioId,
          cantidad: item.cantidad,
          precio_unit: item.precioUnit,
          subtotal: item.subtotal,
          notas: item.notas ?? null,
        }))
      );

    if (itemsError) {
      throw itemsError;
    }
  }

  return { id: pedidoId };
};

type FetchPedidosInput = {
  lavanderiaId: string;
  estados?: PedidoEstado[];
};

export const fetchPedidosPorEstado = async ({
  lavanderiaId,
  estados = STAFF_ESTADOS_PRIORIZADOS,
}: FetchPedidosInput): Promise<PedidoListItem[]> => {
  const supabase = getBrowserClient();

  const { data, error } = await supabase
    .from('pedidos')
    .select(
      `
        id,
        estado,
        total,
        notas,
        created_at,
        updated_at,
        ready_at,
        delivered_at,
        lavanderia_id,
        cliente_usuario
      `
    )
    .eq('lavanderia_id', lavanderiaId)
    .in('estado', estados)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const parsed = pedidoListCollectionSchema.parse(data ?? []);
  const perfilesMap = await loadPerfilesMap(parsed.map((row) => row.cliente_usuario));
  return parsed.map((row) =>
    mapPedidoListRow(row, row.cliente_usuario ? perfilesMap[row.cliente_usuario] : undefined)
  );
};

type FetchPedidosListInput = {
  lavanderiaId: string;
  estado?: PedidoEstado | 'todos';
  search?: string;
};

export const fetchPedidosList = async ({
  lavanderiaId,
  estado,
  search,
}: FetchPedidosListInput): Promise<PedidoListItem[]> => {
  const supabase = getBrowserClient();
  let query = supabase
    .from('pedidos')
    .select(
      `
        id,
        estado,
        total,
        notas,
        created_at,
        updated_at,
        ready_at,
        delivered_at,
        lavanderia_id,
        cliente_usuario
      `
    )
    .eq('lavanderia_id', lavanderiaId)
    .order('created_at', { ascending: false });

  if (estado && estado !== 'todos') {
    query = query.eq('estado', estado);
  }

  const trimmedSearch = search?.trim();
  const { data, error } = await query.limit(100);

  if (error) {
    throw error;
  }

  const parsed = pedidoListCollectionSchema.parse(data ?? []);
  const perfilesMap = await loadPerfilesMap(parsed.map((row) => row.cliente_usuario));
  const mapped = parsed.map((row) =>
    mapPedidoListRow(row, row.cliente_usuario ? perfilesMap[row.cliente_usuario] : undefined)
  );

  if (trimmedSearch) {
    const term = trimmedSearch.toLowerCase();
    return mapped.filter((pedido) => {
      const idMatch = pedido.id.toLowerCase().includes(term);
      const clienteIdMatch = pedido.clienteId?.toLowerCase().includes(term);
      const nombreMatch = pedido.clienteNombre?.toLowerCase().includes(term);
      return idMatch || clienteIdMatch || nombreMatch;
    });
  }

  return mapped;
};

export const fetchPedidoDetalle = async ({
  lavanderiaId,
  pedidoId,
}: {
  lavanderiaId: string;
  pedidoId: string;
}): Promise<PedidoDetalle | null> => {
  const supabase = getBrowserClient();

  const { data, error } = await supabase
    .from('pedidos')
    .select(
      `
        id,
        estado,
        total,
        notas,
        created_at,
        updated_at,
        ready_at,
        delivered_at,
        lavanderia_id,
        cliente_usuario,
        pedido_items(id, pedido_id, servicio_id, cantidad, precio_unit, subtotal, notas, servicios(nombre, unidad))
      `
    )
    .eq('lavanderia_id', lavanderiaId)
    .eq('id', pedidoId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const parsed = pedidoDetalleRowSchema.parse(data);
  const perfilesMap = await loadPerfilesMap([parsed.cliente_usuario]);
  return mapPedidoDetalleRow(
    parsed,
    parsed.cliente_usuario ? perfilesMap[parsed.cliente_usuario] : undefined
  );
};

export const fetchPedidosDashboardResumen = async ({
  lavanderiaId,
}: {
  lavanderiaId: string;
}): Promise<PedidosDashboardResumen> => {
  const supabase = getBrowserClient();

  const { data, error } = await supabase
    .from('pedidos')
    .select('estado,total,created_at')
    .eq('lavanderia_id', lavanderiaId)
    .in('estado', ['creado', 'en_proceso', 'listo', 'entregado']);

  if (error) {
    throw error;
  }

  const rows =
    (data as { estado: PedidoEstado; total: number | null; created_at: string }[] | null) ?? [];

  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterdayISO = yesterdayDate.toISOString().slice(0, 10);

  let pendientes = 0;
  let enProceso = 0;
  let listos = 0;
  let completados = 0;
  let ingresosHoy = 0;
  let ingresosAyer = 0;

  rows.forEach((row) => {
    const total = typeof row.total === 'number' ? row.total : Number(row.total ?? 0);
    const createdDate = row.created_at.slice(0, 10);

    if (createdDate === todayISO) {
      ingresosHoy += total;
    } else if (createdDate === yesterdayISO) {
      ingresosAyer += total;
    }

    switch (row.estado) {
      case 'creado':
        pendientes += 1;
        break;
      case 'en_proceso':
        enProceso += 1;
        break;
      case 'listo':
        listos += 1;
        break;
      case 'entregado':
        completados += 1;
        break;
      default:
        break;
    }
  });

  const variacionIngresos = ingresosAyer > 0 ? ((ingresosHoy - ingresosAyer) / ingresosAyer) * 100 : 100;

  return {
    pendientes,
    enProceso,
    listos,
    completados,
    ingresosHoy,
    ingresosAyer,
    variacionIngresos,
  };
};

export const updatePedidoEstado = async ({
  lavanderiaId,
  pedidoId,
  estado,
}: {
  lavanderiaId: string;
  pedidoId: string;
  estado: PedidoEstado;
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const payload: Database['public']['Tables']['pedidos']['Update'] = {
    estado: estado as Database['public']['Enums']['pedido_estado'],
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('pedidos')
    .update(payload)
    .eq('lavanderia_id', lavanderiaId)
    .eq('id', pedidoId)
    .select('id, estado')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
};

const loadPerfilesMap = async (clienteUsuarios: Array<string | null>) => {
  const supabase = getBrowserClient();
  const ids = Array.from(
    new Set(clienteUsuarios.filter((id): id is string => Boolean(id)))
  );

  if (ids.length === 0) {
    return {} as Record<string, PedidoPerfilData>;
  }

  const { data, error } = await supabase
    .from('perfiles_app')
    .select('usuario_id, perfil')
    .in('usuario_id', ids);

  if (error) {
    throw error;
  }

  const map: Record<string, PedidoPerfilData> = {};
  for (const row of (data ?? []) as Array<{
    usuario_id: string;
    perfil: Record<string, unknown> | null;
  }>) {
    const perfilRecord = row.perfil ?? {};
    map[row.usuario_id] = {
      nombre: typeof perfilRecord.nombre === 'string' ? perfilRecord.nombre : undefined,
      apellido: typeof perfilRecord.apellido === 'string' ? perfilRecord.apellido : undefined,
      telefono: typeof perfilRecord.telefono === 'string' ? perfilRecord.telefono : undefined,
      email: typeof perfilRecord.email === 'string' ? perfilRecord.email : undefined,
      direccion: typeof perfilRecord.direccion === 'string' ? perfilRecord.direccion : undefined,
    };
  }

  return map;
};

