export const PEDIDO_ESTADOS = ['creado', 'en_proceso', 'listo', 'entregado', 'cancelado'] as const;

export type PedidoEstado = (typeof PEDIDO_ESTADOS)[number];

export const STAFF_ESTADOS_PRIORIZADOS: PedidoEstado[] = ['creado', 'en_proceso', 'listo'];

