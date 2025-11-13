'use client';

import Link from 'next/link';
import {
  Loader2,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  Plus,
  Package2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-context';
import { useLavanderia } from '@/features/lavanderias/queries';
import {
  usePedidosDashboardResumen,
  usePedidosPorEstado,
} from '@/features/pedidos/queries';
import type { PedidoListItem } from '@/features/pedidos/schemas';
import { useServiciosResumen } from '@/features/servicios/queries';
import type { PedidoEstado } from '@/features/pedidos/constants';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});
const currencyFormatterPrecise = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
});

const estadoConfig: Record<PedidoEstado, { label: string; className: string }> = {
  creado: { label: 'En espera', className: 'bg-sky-100 text-sky-700' },
  en_proceso: { label: 'En proceso', className: 'bg-amber-100 text-amber-700' },
  listo: { label: 'Listo', className: 'bg-emerald-100 text-emerald-700' },
  entregado: { label: 'Entregado', className: 'bg-slate-200 text-slate-700' },
  cancelado: { label: 'Cancelado', className: 'bg-rose-100 text-rose-700' },
};

export default function StaffHomePage() {
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';
  const { data: lavanderia } = useLavanderia(lavanderiaId);

  const {
    data: resumen,
    isLoading: resumenLoading,
    isError: resumenError,
  } = usePedidosDashboardResumen(lavanderiaId);

  const serviciosQuery = useServiciosResumen(lavanderiaId);

  const pendientesQuery = usePedidosPorEstado(lavanderiaId, ['creado']);
  const enProcesoQuery = usePedidosPorEstado(lavanderiaId, ['en_proceso']);

  const resumenData = resumen ?? {
    pendientes: 0,
    enProceso: 0,
    listos: 0,
    completados: 0,
    ingresosHoy: 0,
    ingresosAyer: 0,
    variacionIngresos: 0,
  };

  const metricCards = [
    {
      label: 'Pedidos Pendientes',
      value: resumenData.pendientes,
      description: 'Esperando procesamiento',
      icon: ClipboardList,
    },
    {
      label: 'En Proceso',
      value: resumenData.enProceso,
      description: 'Siendo procesados',
      icon: Clock,
    },
    {
      label: 'Completados Hoy',
      value: resumenData.completados,
      description: 'Listos para entrega',
      icon: CheckCircle2,
    },
    {
      label: 'Ingresos Hoy',
      value: currencyFormatter.format(resumenData.ingresosHoy),
      description:
        resumenData.variacionIngresos >= 0
          ? `+${resumenData.variacionIngresos.toFixed(1)}% vs ayer`
          : `${resumenData.variacionIngresos.toFixed(1)}% vs ayer`,
      highlight: resumenData.variacionIngresos,
      icon: DollarSign,
    },
  ];

  if (!lavanderiaId) {
    return (
      <section className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 bg-slate-900/70 p-12 text-center">
        <ClipboardList className="h-10 w-10 text-slate-500" />
        <h2 className="text-xl font-semibold text-slate-100">Selecciona una lavandería</h2>
        <p className="max-w-md text-sm text-slate-400">
          Vincula tu rol de encargado a una lavandería para visualizar los indicadores operativos.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-slate-50">{lavanderia?.nombre ?? 'Tu lavandería'}</h1>
        <p className="text-sm text-slate-400">Panel de control de tu lavandería</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <article
            key={card.label}
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-sm shadow-slate-950/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-50">
                  {resumenLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : card.value}
                </p>
              </div>
              <card.icon className="h-10 w-10 text-slate-400" />
            </div>
            <p
              className={`mt-3 text-xs ${
                card.highlight !== undefined
                  ? card.highlight >= 0
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                  : 'text-slate-500'
              }`}
            >
              {card.description}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Acción rápida</p>
              <h2 className="text-xl font-semibold text-slate-50">Crear pedido rápido</h2>
              <p className="mt-1 text-sm text-slate-400">
                Inicia un pedido tipo walk-in con pocos clics.
              </p>
            </div>
            <Plus className="h-10 w-10 text-sky-400" />
          </div>
          <div className="mt-4 flex gap-3">
            <Button asChild className="bg-sky-500 text-white hover:bg-sky-600">
              <Link href="/staff/walk-in">Crear pedido</Link>
            </Button>
            <Button asChild variant="outline" className="border-slate-700 bg-transparent text-slate-300">
              <Link href="/staff/pedidos">Ver pedidos</Link>
            </Button>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Servicios</p>
              <h2 className="text-xl font-semibold text-slate-50">Catálogo activo</h2>
            </div>
            <Package2 className="h-8 w-8 text-slate-400" />
          </div>
          <div className="mt-4 space-y-3">
            {serviciosQuery.isLoading ? (
              <p className="text-sm text-slate-400">Cargando servicios…</p>
            ) : serviciosQuery.data && serviciosQuery.data.length > 0 ? (
              serviciosQuery.data.map((servicio) => (
                <div
                  key={servicio.id}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{servicio.nombre}</p>
                    {servicio.descripcion ? (
                      <p className="text-xs text-slate-500">{servicio.descripcion}</p>
                    ) : null}
                  </div>
                  <p className="text-sm font-semibold text-slate-100">
                    {currencyFormatterPrecise.format(servicio.precio)}
                    {servicio.unidad ? <span className="text-xs text-slate-500"> / {servicio.unidad}</span> : null}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No hay servicios activos aún.</p>
            )}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" className="border-slate-700 bg-transparent text-slate-300">
              <Link href="/staff/catalogo">Gestionar servicios</Link>
            </Button>
          </div>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PedidoListCard
          title="Pedidos Pendientes"
          description="Pedidos que requieren tu atención"
          query={pendientesQuery}
          emptyMessage="No hay pedidos esperando procesamiento."
        />
        <PedidoListCard
          title="Pedidos en Proceso"
          description="Órdenes actualmente en producción"
          query={enProcesoQuery}
          emptyMessage="No hay pedidos en proceso por el momento."
        />
      </div>

      {resumenError ? (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          No pudimos cargar el resumen de pedidos. Intenta recargar la página.
        </div>
      ) : null}
    </section>
  );
}

type PedidoListCardProps = {
  title: string;
  description: string;
  query: ReturnType<typeof usePedidosPorEstado>;
  emptyMessage: string;
};

function PedidoListCard({ title, description, query, emptyMessage }: PedidoListCardProps) {
  const items = (query.data ?? []).slice(0, 4);

  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
          <h2 className="text-lg font-semibold text-slate-100">{description}</h2>
        </div>
        <Button variant="outline" asChild className="border-slate-800 bg-transparent text-xs text-slate-300">
          <Link href="/staff/pedidos">Ver todos</Link>
        </Button>
      </header>

      <div className="flex-1 space-y-3">
        {query.isLoading ? (
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Cargando pedidos…
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        ) : (
          <ul className="space-y-3">
            {items.map((pedido) => (
              <PedidoRow key={pedido.id} pedido={pedido} />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

type PedidoRowProps = {
  pedido: PedidoListItem;
};

function PedidoRow({ pedido }: PedidoRowProps) {
  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const config = estadoConfig[pedido.estado];

  return (
    <li className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/70 px-6 py-5 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-100">Pedido #{pedido.id.slice(0, 6)}</h2>
        <p className="text-xs text-slate-500">Recepción: {fecha}</p>
        {pedido.notas ? (
          <p className="text-xs text-slate-400">Notas: {pedido.notas}</p>
        ) : null}
        {pedido.readyAt ? (
          <p className="text-xs text-slate-500">Listo desde: {new Date(pedido.readyAt).toLocaleDateString('es-MX')}</p>
        ) : null}
        {pedido.deliveredAt ? (
          <p className="text-xs text-slate-500">Entregado: {new Date(pedido.deliveredAt).toLocaleDateString('es-MX')}</p>
        ) : null}
      </div>
      <Badge className={`${config.className} text-xs font-semibold capitalize`}>{config.label}</Badge>
    </li>
  );
}

