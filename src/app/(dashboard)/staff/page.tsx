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
  ArrowRight,
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
      <section className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80 p-12 text-center">
        <ClipboardList className="h-10 w-10 dark:text-slate-500 text-slate-600" />
        <h2 className="text-xl font-semibold dark:text-slate-100 text-slate-900">Selecciona una lavandería</h2>
        <p className="max-w-md text-sm dark:text-slate-400 text-slate-600">
          Vincula tu rol de encargado a una lavandería para visualizar los indicadores operativos.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold dark:text-slate-50 text-slate-900">{lavanderia?.nombre ?? 'Tu lavandería'}</h1>
        <p className="text-sm dark:text-slate-400 text-slate-600">Panel de control de tu lavandería</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const isClickable = true;
          const href = card.label === 'Pedidos Pendientes' 
            ? '/staff/pedidos?estado=creado'
            : card.label === 'En Proceso'
            ? '/staff/pedidos?estado=en_proceso'
            : card.label === 'Completados Hoy'
            ? '/staff/pedidos?estado=entregado'
            : card.label === 'Ingresos Hoy'
            ? '/staff/estadisticas'
            : null;

          const content = (
            <article
              className={`rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80 p-5 shadow-sm dark:shadow-slate-950/30 shadow-slate-200/50 ${
                isClickable 
                  ? 'cursor-pointer transition-all duration-300 hover:scale-105 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/20 active:scale-95' 
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide dark:text-slate-500 text-slate-600">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold dark:text-slate-50 text-slate-900">
                    {resumenLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : card.value}
                  </p>
                </div>
                <card.icon className={`h-10 w-10 dark:text-slate-400 text-slate-500 ${isClickable ? 'transition-transform duration-300 group-hover:scale-110' : ''}`} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p
                  className={`text-xs ${
                    card.highlight !== undefined
                      ? card.highlight >= 0
                        ? 'text-emerald-400 dark:text-emerald-400'
                        : 'text-rose-400 dark:text-rose-400'
                      : 'dark:text-slate-500 text-slate-600'
                  }`}
                >
                  {card.description}
                </p>
                {isClickable && (
                  <ArrowRight className="h-4 w-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </div>
            </article>
          );

          if (isClickable && href) {
            return (
              <Link key={card.label} href={href} className="group block">
                {content}
              </Link>
            );
          }

          return <div key={card.label}>{content}</div>;
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        <article className="rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide dark:text-slate-500 text-slate-600">Acción rápida</p>
              <h2 className="text-xl font-semibold dark:text-slate-50 text-slate-900">Crear pedido rápido</h2>
              <p className="mt-1 text-sm dark:text-slate-400 text-slate-600">
                Inicia un pedido tipo walk-in con pocos clics.
              </p>
            </div>
            <Plus className="h-10 w-10 text-sky-400 dark:text-sky-400 text-sky-600" />
          </div>
          <div className="mt-4 flex gap-3">
            <Button asChild className="bg-sky-500 text-white hover:bg-sky-600">
              <Link href="/staff/walk-in">Crear pedido</Link>
            </Button>
            <Button asChild variant="outline" className="dark:border-slate-700 border-slate-300 dark:bg-transparent bg-white dark:text-slate-300 text-slate-700">
              <Link href="/staff/pedidos">Ver pedidos</Link>
            </Button>
          </div>
        </article>

        <article className="rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide dark:text-slate-500 text-slate-600">Servicios</p>
              <h2 className="text-xl font-semibold dark:text-slate-50 text-slate-900">Catálogo activo</h2>
            </div>
            <Package2 className="h-8 w-8 dark:text-slate-400 text-slate-600" />
          </div>
          <div className="mt-4 space-y-3">
            {serviciosQuery.isLoading ? (
              <p className="text-sm dark:text-slate-400 text-slate-600">Cargando servicios…</p>
            ) : serviciosQuery.data && serviciosQuery.data.length > 0 ? (
              serviciosQuery.data.map((servicio) => (
                <div
                  key={servicio.id}
                  className="flex items-center justify-between rounded-2xl border dark:border-white/5 border-slate-200 dark:bg-slate-950/60 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold dark:text-slate-100 text-slate-900">{servicio.nombre}</p>
                    {servicio.descripcion ? (
                      <p className="text-xs dark:text-slate-500 text-slate-600">{servicio.descripcion}</p>
                    ) : null}
                  </div>
                  <p className="text-sm font-semibold dark:text-slate-100 text-slate-900">
                    {currencyFormatterPrecise.format(servicio.precio)}
                    {servicio.unidad ? <span className="text-xs dark:text-slate-500 text-slate-600"> / {servicio.unidad}</span> : null}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm dark:text-slate-400 text-slate-600">No hay servicios activos aún.</p>
            )}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" className="dark:border-slate-700 border-slate-300 dark:bg-transparent bg-white dark:text-slate-300 text-slate-700">
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
          estado="creado"
        />
        <PedidoListCard
          title="Pedidos en Proceso"
          description="Órdenes actualmente en producción"
          query={enProcesoQuery}
          emptyMessage="No hay pedidos en proceso por el momento."
          estado="en_proceso"
        />
      </div>

      {resumenError ? (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm dark:text-rose-200 text-rose-700">
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
  estado: 'creado' | 'en_proceso' | 'entregado';
};

function PedidoListCard({ title, description, query, emptyMessage, estado }: PedidoListCardProps) {
  const items = (query.data ?? []).slice(0, 4);

  return (
    <Link 
      href={`/staff/pedidos?estado=${estado}`}
      className="group block h-full"
    >
      <article className="flex h-full flex-col gap-4 rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80 p-5 transition-all duration-300 hover:border-sky-500/50 hover:shadow-lg hover:shadow-sky-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide dark:text-slate-500 text-slate-600">{title}</p>
            <h2 className="text-lg font-semibold dark:text-slate-100 text-slate-900">{description}</h2>
          </div>
          <div className="flex items-center gap-2 text-xs dark:text-slate-300 text-slate-700 transition-all duration-300 group-hover:text-sky-300">
            <span>Ver todos</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </header>

        <div className="flex-1 space-y-3">
          {query.isLoading ? (
            <div className="flex items-center gap-3 text-sm dark:text-slate-400 text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando pedidos…
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-sm dark:text-slate-500 text-slate-600 mb-4">{emptyMessage}</p>
              <div className="flex items-center gap-2 text-sm bg-sky-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-sky-500/30">
                <span>Ver pedidos {title.toLowerCase()}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((pedido) => (
                <PedidoRow key={pedido.id} pedido={pedido} />
              ))}
              <li>
                <div className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white px-4 py-3 rounded-lg transition-all duration-300 hover:bg-sky-600 shadow-lg shadow-sky-500/30">
                  <span>Ver todos los {title.toLowerCase()}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </li>
            </ul>
          )}
        </div>
      </article>
    </Link>
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
    <li className="flex items-start justify-between gap-4 rounded-2xl border dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80 px-6 py-5 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold dark:text-slate-100 text-slate-900">Pedido #{pedido.id.slice(0, 6)}</h2>
        <p className="text-xs dark:text-slate-500 text-slate-600">Recepción: {fecha}</p>
        {pedido.notas ? (
          <p className="text-xs dark:text-slate-400 text-slate-600">Notas: {pedido.notas}</p>
        ) : null}
        {pedido.readyAt ? (
          <p className="text-xs dark:text-slate-500 text-slate-600">Listo desde: {new Date(pedido.readyAt).toLocaleDateString('es-MX')}</p>
        ) : null}
        {pedido.deliveredAt ? (
          <p className="text-xs dark:text-slate-500 text-slate-600">Entregado: {new Date(pedido.deliveredAt).toLocaleDateString('es-MX')}</p>
        ) : null}
      </div>
      <Badge className={`${config.className} text-xs font-semibold capitalize`}>{config.label}</Badge>
    </li>
  );
}

