import { z } from 'zod';
import { PEDIDO_ESTADOS } from './constants';

const pedidoBaseSchema = z.object({
  id: z.string(),
  lavanderia_id: z.string(),
  cliente_usuario: z.string().nullable(),
  estado: z.enum(PEDIDO_ESTADOS),
  total: z.number(),
  notas: z.string().nullable().default(null),
  ready_at: z.string().nullable(),
  delivered_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string().nullable(),
});

export const pedidoListSchema = pedidoBaseSchema;

export const pedidoListCollectionSchema = z.array(pedidoListSchema);

export type PedidoListRow = z.infer<typeof pedidoListSchema>;

export type PedidoListItem = {
  id: string;
  lavanderiaId: string;
  estado: z.infer<typeof pedidoBaseSchema>['estado'];
  total: number;
  createdAt: string;
  updatedAt?: string;
  notas?: string | null;
  clienteId?: string;
  clienteNombre?: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  clienteDireccion?: string;
  readyAt?: string | null;
  deliveredAt?: string | null;
};

export type PedidoPerfilData = {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
};

export const mapPedidoListRow = (
  row: PedidoListRow,
  perfil?: PedidoPerfilData
): PedidoListItem => {
  const nombre = perfil
    ? [perfil.nombre, perfil.apellido].filter(Boolean).join(' ').trim()
    : undefined;

  return {
    id: row.id,
    lavanderiaId: row.lavanderia_id,
    estado: row.estado,
    total: row.total,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
    notas: row.notas ?? undefined,
    clienteId: row.cliente_usuario ?? undefined,
    clienteNombre: nombre && nombre.length > 0 ? nombre : undefined,
    clienteTelefono: perfil?.telefono,
    clienteEmail: perfil?.email,
    clienteDireccion: perfil?.direccion,
    readyAt: row.ready_at ?? undefined,
    deliveredAt: row.delivered_at ?? undefined,
  };
};

const pedidoItemRowSchema = z.object({
  id: z.string(),
  pedido_id: z.string(),
  servicio_id: z.string().nullable(),
  cantidad: z.number(),
  precio_unit: z.number(),
  subtotal: z.number(),
  notas: z.string().nullable(),
  servicios: z
    .object({
      nombre: z.string().nullable().optional(),
      unidad: z.string().nullable().optional(),
    })
    .optional(),
});

export type PedidoItemRow = z.infer<typeof pedidoItemRowSchema>;

export type PedidoItem = {
  id: string;
  servicioId?: string;
  nombre?: string;
  unidad?: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
  notas?: string | null;
};

export const mapPedidoItemRow = (row: PedidoItemRow): PedidoItem => ({
  id: row.id,
  servicioId: row.servicio_id ?? undefined,
  nombre: row.servicios?.nombre ?? undefined,
  unidad: row.servicios?.unidad ?? undefined,
  cantidad: row.cantidad,
  precioUnit: row.precio_unit,
  subtotal: row.subtotal,
  notas: row.notas ?? undefined,
});

export const pedidoDetalleRowSchema = pedidoBaseSchema.extend({
  pedido_items: z.array(pedidoItemRowSchema).optional(),
});

export type PedidoDetalleRow = z.infer<typeof pedidoDetalleRowSchema>;

export type PedidoDetalle = {
  id: string;
  estado: z.infer<typeof pedidoBaseSchema>['estado'];
  notas?: string | null;
  total: number;
  createdAt: string;
  readyAt?: string | null;
  deliveredAt?: string | null;
  clienteNombre?: string;
  clienteTelefono?: string;
  clienteEmail?: string;
  clienteDireccion?: string;
  items: PedidoItem[];
};

export const mapPedidoDetalleRow = (
  row: PedidoDetalleRow,
  perfil?: PedidoPerfilData
): PedidoDetalle => {
  const nombre = perfil
    ? [perfil?.nombre, perfil?.apellido].filter(Boolean).join(' ').trim()
    : undefined;

  return {
    id: row.id,
    estado: row.estado,
    notas: row.notas ?? undefined,
    total: row.total,
    createdAt: row.created_at,
    readyAt: row.ready_at ?? undefined,
    deliveredAt: row.delivered_at ?? undefined,
    clienteNombre: nombre && nombre.length > 0 ? nombre : undefined,
    clienteTelefono: perfil?.telefono,
    clienteEmail: perfil?.email,
    clienteDireccion: perfil?.direccion,
    items: (row.pedido_items ?? []).map(mapPedidoItemRow),
  };
};

