import { subMonths, startOfWeek, startOfMonth, startOfYear, addMonths } from 'date-fns';
import { getBrowserClient } from '@/lib/supabase';
import type { PedidoEstado } from '@/features/pedidos/constants';

export type EstadisticasDashboard = {
  pedidosCompletados: {
    total: number;
    semana: number;
    mes: number;
    anio: number;
  };
  ingresosTotales: number;
  valorPromedio: number;
  clientesRecurrentes: number;
  pedidosPorSemana: {
    actual: number;
    variacion: number;
  };
  clientesNuevos: {
    actual: number;
    variacion: number;
  };
  estadoPedidos: Record<PedidoEstado, number>;
  ingresosMensuales: Array<{ month: string; value: number }>;
  serviciosFrecuentes: Array<{ nombre: string; cantidad: number; ingresos: number }>;
};

const ESTADOS: PedidoEstado[] = ['creado', 'en_proceso', 'listo', 'entregado', 'cancelado'];

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString('es-MX', { month: 'short' }).replace('.', '');

export const fetchEstadisticasDashboard = async (
  lavanderiaId: string
): Promise<EstadisticasDashboard> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getBrowserClient() as any;

  const now = new Date();
  const sinceYear = subMonths(now, 12).toISOString();
  const pedidosDesde = sinceYear;

  const { data: pedidosData, error: pedidosError } = await supabase
    .from('pedidos')
    .select('id, total, estado, cliente_usuario, created_at')
    .eq('lavanderia_id', lavanderiaId)
    .gte('created_at', pedidosDesde)
    .order('created_at', { ascending: false });

  if (pedidosError) {
    throw pedidosError;
  }

  const pedidos = (pedidosData ?? []) as Array<{
    id: string;
    total: number;
    estado: PedidoEstado;
    cliente_usuario: string | null;
    created_at: string;
  }>;

  const pedidoIds = pedidos.map((pedido) => pedido.id);
  let items:
    | Array<{
        servicio_id: string;
        cantidad: number;
        subtotal: number;
        servicios: { nombre: string } | null;
      }>
    | [] = [];

  if (pedidoIds.length > 0) {
    const { data: itemsData, error: itemsError } = await supabase
      .from('pedido_items')
      .select('servicio_id, cantidad, subtotal, servicios(nombre)')
      .in('pedido_id', pedidoIds);

    if (itemsError) {
      throw itemsError;
    }

    items = (itemsData ?? []) as Array<{
      servicio_id: string;
      cantidad: number;
      subtotal: number;
      servicios: { nombre: string } | null;
    }>;
  }

  const startWeek = startOfWeek(now, { weekStartsOn: 1 });
  const startPrevWeek = new Date(startWeek);
  startPrevWeek.setDate(startWeek.getDate() - 7);

  const startMonth = startOfMonth(now);
  const prevMonth = subMonths(startMonth, 1);

  const startYearDate = startOfYear(now);

  const completedPedidos = pedidos.filter((pedido) => pedido.estado === 'entregado');
  const ingresosTotales = completedPedidos.reduce((acc, pedido) => acc + (pedido.total ?? 0), 0);
  const valorPromedio = completedPedidos.length > 0 ? ingresosTotales / completedPedidos.length : 0;

  const pedidosSemanaActual = completedPedidos.filter(
    (pedido) => new Date(pedido.created_at) >= startWeek
  ).length;

  const pedidosSemanaAnterior = completedPedidos.filter((pedido) => {
    const created = new Date(pedido.created_at);
    return created >= startPrevWeek && created < startWeek;
  }).length;

  const variacionSemana = pedidosSemanaAnterior === 0
    ? pedidosSemanaActual > 0
      ? 100
      : 0
    : ((pedidosSemanaActual - pedidosSemanaAnterior) / pedidosSemanaAnterior) * 100;

  const clientesPorId = pedidos.reduce<Record<string, Array<Date>>>((acc, pedido) => {
    if (!pedido.cliente_usuario) return acc;
    const list = acc[pedido.cliente_usuario] ?? [];
    list.push(new Date(pedido.created_at));
    acc[pedido.cliente_usuario] = list;
    return acc;
  }, {});

  const clientesRecurrentes = Object.values(clientesPorId).filter((fechas) => fechas.length >= 2).length;

  const clientesPrimerPedido = Object.entries(clientesPorId).map(([clienteId, fechas]) => ({
    clienteId,
    firstOrder: fechas.sort((a, b) => a.getTime() - b.getTime())[0],
  }));

  const clientesMesActual = clientesPrimerPedido.filter(
    (item) => item.firstOrder >= startMonth
  ).length;

  const clientesMesAnterior = clientesPrimerPedido.filter((item) => {
    const fecha = item.firstOrder;
    return fecha >= prevMonth && fecha < startMonth;
  }).length;

  const variacionClientes = clientesMesAnterior === 0
    ? clientesMesActual > 0
      ? 100
      : 0
    : ((clientesMesActual - clientesMesAnterior) / clientesMesAnterior) * 100;

  const pedidosMesActual = completedPedidos.filter(
    (pedido) => new Date(pedido.created_at) >= startMonth
  ).length;

  const pedidosAnio = completedPedidos.filter(
    (pedido) => new Date(pedido.created_at) >= startYearDate
  ).length;

  const estadoPedidos = ESTADOS.reduce<Record<PedidoEstado, number>>((acc, estado) => {
    acc[estado] = pedidos.filter((pedido) => pedido.estado === estado).length;
    return acc;
  }, {
    creado: 0,
    en_proceso: 0,
    listo: 0,
    entregado: 0,
    cancelado: 0,
  });

  const meses: Array<{ month: string; value: number }> = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = subMonths(now, i);
    const monthStart = startOfMonth(date);
    const nextMonth = startOfMonth(addMonths(date, 1));
    const value = completedPedidos
      .filter((pedido) => {
        const created = new Date(pedido.created_at);
        return created >= monthStart && created < nextMonth;
      })
      .reduce((acc, pedido) => acc + (pedido.total ?? 0), 0);

    meses.push({ month: formatMonthLabel(date), value });
  }

  const serviciosMap = items.reduce<Record<string, { nombre: string; cantidad: number; ingresos: number }>>(
    (acc, item) => {
      const nombre = item.servicios?.nombre ?? 'Servicio';
      const current = acc[item.servicio_id] ?? { nombre, cantidad: 0, ingresos: 0 };
      current.cantidad += item.cantidad;
      current.ingresos += item.subtotal;
      acc[item.servicio_id] = current;
      return acc;
    },
    {}
  );

  const serviciosFrecuentes = Object.values(serviciosMap)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 5);

  return {
    pedidosCompletados: {
      total: completedPedidos.length,
      semana: pedidosSemanaActual,
      mes: pedidosMesActual,
      anio: pedidosAnio,
    },
    ingresosTotales,
    valorPromedio,
    clientesRecurrentes,
    pedidosPorSemana: {
      actual: pedidosSemanaActual,
      variacion: variacionSemana,
    },
    clientesNuevos: {
      actual: clientesMesActual,
      variacion: variacionClientes,
    },
    estadoPedidos,
    ingresosMensuales: meses,
    serviciosFrecuentes,
  };
};
