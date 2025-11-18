'use client';

import { useState } from 'react';
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
  Search,
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
  creado: { label: 'En espera', className: 'bg-[#4C89D9]/20 text-[#4C89D9] border border-[#4C89D9]/30' },
  en_proceso: { label: 'En proceso', className: 'bg-[#FFD97B]/20 text-[#FFD97B] border border-[#FFD97B]/30' },
  listo: { label: 'Listo', className: 'bg-[#6DF2A4]/20 text-[#6DF2A4] border border-[#6DF2A4]/30' },
  entregado: { label: 'Entregado', className: 'bg-[#8FA1B7]/20 text-[#8FA1B7] border border-[#8FA1B7]/30' },
  cancelado: { label: 'Cancelado', className: 'bg-[#FF8B6B]/20 text-[#FF8B6B] border border-[#FF8B6B]/30' },
};

export default function StaffHomePage() {
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';
  const { data: lavanderia } = useLavanderia(lavanderiaId);

  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: resumen,
    isLoading: resumenLoading,
    isError: resumenError,
  } = usePedidosDashboardResumen(lavanderiaId);

  const serviciosQuery = useServiciosResumen(lavanderiaId);
  const catalogoVacio = !serviciosQuery.isLoading && (serviciosQuery.data?.length ?? 0) === 0;

  const pendientesQuery = usePedidosPorEstado(lavanderiaId, ['creado']);
  const enProcesoQuery = usePedidosPorEstado(lavanderiaId, ['en_proceso']);

  const normalizedSearch = searchTerm.trim().toLowerCase();

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
      <section className="flex flex-1 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#25354B]/50 bg-[#1B2A40]/60 p-12 text-center">
        <ClipboardList className="h-10 w-10 text-[#8FA1B7]" />
        <h2 className="text-xl font-semibold text-[#F2F5FA]">Selecciona una lavandería</h2>
        <p className="max-w-md text-sm text-[#BFC7D3]">
          Vincula tu rol de encargado a una lavandería para visualizar los indicadores operativos.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-2 mb-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#F2F5FA] via-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">{lavanderia?.nombre ?? 'Tu lavandería'}</h1>
        <p className="text-sm text-[#BFC7D3] font-medium">Panel de control de tu lavandería</p>
      </header>

      {catalogoVacio ? (
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFD97B]/40 bg-gradient-to-br from-[#FFD97B]/10 via-[#FFD97B]/5 to-[#FFD97B]/10 p-6 text-sm text-[#FFD97B] backdrop-blur-sm transition-all duration-300 hover:border-[#FFD97B]/60 hover:shadow-xl hover:shadow-[#FFD97B]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD97B]/5 via-transparent to-[#FFD97B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <p className="font-bold text-base mb-2">Activa tu catálogo para comenzar</p>
            <p className="leading-relaxed">
              Aún no tienes servicios en el catálogo. Crea al menos uno para poder registrar pedidos nuevos.
              <Link href="/staff/catalogo" className="ml-1.5 font-bold text-[#60C2D8] underline decoration-2 underline-offset-2 transition-all duration-300 hover:text-[#4C89D9]">
                Gestionar catálogo
              </Link>
            </p>
          </div>
        </div>
      ) : null}

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
              className={`group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/60 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-500 ${
                isClickable 
                  ? 'cursor-pointer hover:border-[#4C89D9] hover:bg-gradient-to-br hover:from-[#1B2A40] hover:via-[#25354B]/70 hover:to-[#1B2A40] hover:shadow-[0_0_40px_rgba(76,137,217,0.4)] hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98]' 
                  : ''
              }`}
            >
              {/* Animated gradient overlay */}
              {isClickable && (
                <>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/10 via-[#60C2D8]/5 to-[#4C89D9]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#4C89D9]/20 via-[#60C2D8]/20 to-[#4C89D9]/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                  {/* Shine effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 -skew-x-12 translate-x-[-200%] transition-all duration-1000 group-hover:opacity-100 group-hover:translate-x-[200%]" />
                </>
              )}
              
              <div className="relative flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">{card.label}</p>
                  <div className="mt-3 relative inline-block">
                    {isClickable && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                    )}
                    <p className="relative text-3xl font-extrabold text-[#F2F5FA]">
                      {resumenLoading ? <Loader2 className="h-6 w-6 animate-spin text-[#4C89D9]" /> : card.value}
                    </p>
                  </div>
                </div>
                <div className={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4C89D9]/20 to-[#60C2D8]/20 border border-[#4C89D9]/30 transition-all duration-300 ${isClickable ? 'group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-[#4C89D9]/30' : ''}`}>
                  <card.icon className={`h-7 w-7 text-[#4C89D9] transition-colors duration-300 ${isClickable ? 'group-hover:text-[#60C2D8]' : ''}`} />
                </div>
              </div>
              <div className="relative flex items-center justify-between mt-4">
                <p
                  className={`text-xs font-medium ${
                    card.highlight !== undefined
                      ? card.highlight >= 0
                        ? 'text-[#6DF2A4]'
                        : 'text-[#FF8B6B]'
                      : 'text-[#8FA1B7]'
                  }`}
                >
                  {card.description}
                </p>
                {isClickable && (
                  <ArrowRight className="h-4 w-4 text-[#4C89D9] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                )}
              </div>
              
              {/* Corner accent */}
              {isClickable && (
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#4C89D9]/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
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
        <article className="group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">Acción rápida</p>
              <h2 className="mt-2 text-xl font-extrabold text-[#F2F5FA]">Crear pedido rápido</h2>
              <p className="mt-2 text-sm text-[#BFC7D3] leading-relaxed">
                Inicia un pedido tipo walk-in con pocos clics.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4C89D9]/20 to-[#60C2D8]/20 border border-[#4C89D9]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#4C89D9]/30">
              <Plus className="h-7 w-7 text-[#4C89D9]" />
            </div>
          </div>
          <div className="relative mt-6 flex gap-3">
            <Button asChild className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-300">
              <Link href="/staff/walk-in">Crear pedido</Link>
            </Button>
            <Button asChild variant="outline" className="border-2 border-[#25354B] bg-transparent text-[#BFC7D3] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:text-[#F2F5FA] transition-all duration-300">
              <Link href="/staff/pedidos">Ver pedidos</Link>
            </Button>
          </div>
        </article>

        <article className="group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">Servicios</p>
              <h2 className="mt-2 text-xl font-extrabold text-[#F2F5FA]">Catálogo activo</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6DF2A4]/20 to-[#60C2D8]/20 border border-[#6DF2A4]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-[#6DF2A4]/30">
              <Package2 className="h-6 w-6 text-[#6DF2A4]" />
            </div>
          </div>
          <div className="relative mt-6 space-y-3">
            {serviciosQuery.isLoading ? (
              <p className="text-sm text-[#BFC7D3]">Cargando servicios…</p>
            ) : serviciosQuery.data && serviciosQuery.data.length > 0 ? (
              serviciosQuery.data.map((servicio) => (
                <div
                  key={servicio.id}
                  className="flex items-center justify-between rounded-2xl border border-[#25354B]/30 bg-[#25354B]/30 px-4 py-3 transition-all duration-300 hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:shadow-md hover:shadow-[#4C89D9]/10"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#F2F5FA]">{servicio.nombre}</p>
                    {servicio.descripcion ? (
                      <p className="mt-1 text-xs text-[#8FA1B7]">{servicio.descripcion}</p>
                    ) : null}
                  </div>
                  <p className="ml-4 text-sm font-bold bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">
                    {currencyFormatterPrecise.format(servicio.precio)}
                    {servicio.unidad ? <span className="text-xs text-[#8FA1B7] font-normal"> / {servicio.unidad}</span> : null}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#BFC7D3]">No hay servicios activos aún.</p>
            )}
          </div>
          <div className="relative mt-6">
            <Button asChild variant="outline" className="border-2 border-[#25354B] bg-transparent text-[#BFC7D3] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:text-[#F2F5FA] transition-all duration-300">
              <Link href="/staff/catalogo">Gestionar servicios</Link>
            </Button>
          </div>
        </article>
      </div>

      <div className="group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8FA1B7] transition-colors duration-300 group-hover:text-[#4C89D9]" />
            <input
              type="search"
              placeholder="Buscar pedidos por número, cliente o teléfono"
              className="w-full rounded-2xl border-2 border-[#25354B]/50 bg-[#25354B]/30 py-3.5 pl-12 pr-4 text-sm text-[#F2F5FA] placeholder:text-[#8FA1B7] transition-all duration-300 focus:border-[#4C89D9] focus:bg-[#25354B]/50 focus:outline-none focus:ring-2 focus:ring-[#4C89D9]/20"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <p className="text-sm text-[#8FA1B7] font-medium">
            Este buscador aplica a las tarjetas de pedidos pendientes y en proceso.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PedidoListCard
          title="Pedidos Pendientes"
          description="Pedidos que requieren tu atención"
          query={pendientesQuery}
          emptyMessage="No hay pedidos esperando procesamiento."
          estado="creado"
          searchTerm={normalizedSearch}
        />
        <PedidoListCard
          title="Pedidos en Proceso"
          description="Órdenes actualmente en producción"
          query={enProcesoQuery}
          emptyMessage="No hay pedidos en proceso por el momento."
          estado="en_proceso"
          searchTerm={normalizedSearch}
        />
      </div>

      {resumenError ? (
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FF8B6B]/40 bg-gradient-to-br from-[#FF8B6B]/10 via-[#FF8B6B]/5 to-[#FF8B6B]/10 p-5 text-sm text-[#FF8B6B] backdrop-blur-sm transition-all duration-300 hover:border-[#FF8B6B]/60 hover:shadow-xl hover:shadow-[#FF8B6B]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF8B6B]/5 via-transparent to-[#FF8B6B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <p className="relative font-semibold">No pudimos cargar el resumen de pedidos. Intenta recargar la página.</p>
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
  searchTerm?: string;
};

function PedidoListCard({ title, description, query, emptyMessage, estado, searchTerm }: PedidoListCardProps) {
  const filteredItems = (query.data ?? []).filter((pedido) => matchesSearchTerm(pedido, searchTerm));
  const items = filteredItems.slice(0, 4);
  const noResults = !query.isLoading && filteredItems.length === 0;
  const hasSearch = Boolean(searchTerm?.trim());

  return (
    <Link 
      href={`/staff/pedidos?estado=${estado}`}
      className="group block h-full"
    >
      <article className="group relative overflow-hidden flex h-full flex-col gap-4 rounded-3xl border-2 border-[#25354B]/60 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-500 hover:border-[#4C89D9] hover:bg-gradient-to-br hover:from-[#1B2A40] hover:via-[#25354B]/70 hover:to-[#1B2A40] hover:shadow-[0_0_40px_rgba(76,137,217,0.4)] hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/10 via-[#60C2D8]/5 to-[#4C89D9]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* Glow effect */}
        <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#4C89D9]/20 via-[#60C2D8]/20 to-[#4C89D9]/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
        
        <header className="relative flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">{title}</p>
            <h2 className="mt-2 text-lg font-extrabold text-[#F2F5FA]">{description}</h2>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#4C89D9]/10 px-3 py-1.5 text-xs font-semibold text-[#4C89D9] transition-all duration-300 group-hover:bg-[#4C89D9]/20 group-hover:text-[#60C2D8] group-hover:scale-105">
            <span>Ver todos</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </header>

        <div className="flex-1 space-y-3">
          {query.isLoading ? (
            <div className="flex items-center gap-3 text-sm text-[#BFC7D3]">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando pedidos…
            </div>
          ) : noResults ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-[#8FA1B7]">
              {hasSearch ? (
                <p className="mb-3">
                  No encontramos pedidos que coincidan con “{searchTerm?.trim()}” en esta sección.
                </p>
              ) : (
                <p className="mb-3">{emptyMessage}</p>
              )}
              <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-[#4C89D9]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105">
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
                <div className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white px-4 py-3 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 shadow-lg shadow-[#4C89D9]/30">
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

const matchesSearchTerm = (pedido: PedidoListItem, term?: string) => {
  const normalized = term?.trim().toLowerCase();
  if (!normalized || normalized.length === 0) {
    return true;
  }

  const numericTerm = normalized.replace(/[^0-9+]/g, '');
  const idMatch = pedido.id.toLowerCase().includes(normalized);
  const nombreMatch = pedido.clienteNombre?.toLowerCase().includes(normalized);
  const notasMatch = pedido.notas?.toLowerCase().includes(normalized);
  const telefonoMatch =
    numericTerm.length > 0
      ? (pedido.clienteTelefono?.replace(/[^0-9+]/g, '').includes(numericTerm) ?? false)
      : false;

  return idMatch || nombreMatch || notasMatch || telefonoMatch;
};

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
    <li className="group/item flex items-start justify-between gap-4 rounded-2xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 px-6 py-5 shadow-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:bg-gradient-to-br hover:from-[#1B2A40] hover:to-[#25354B]/60 hover:shadow-lg hover:shadow-[#4C89D9]/20 hover:-translate-y-0.5">
      <div className="space-y-1.5 flex-1">
        <h2 className="text-base font-extrabold text-[#F2F5FA]">Pedido #{pedido.id.slice(0, 6)}</h2>
        <p className="text-xs text-[#8FA1B7] font-medium">Recepción: {fecha}</p>
        {pedido.notas ? (
          <p className="text-xs text-[#BFC7D3] leading-relaxed">Notas: {pedido.notas}</p>
        ) : null}
        {pedido.readyAt ? (
          <p className="text-xs text-[#8FA1B7]">Listo desde: {new Date(pedido.readyAt).toLocaleDateString('es-MX')}</p>
        ) : null}
        {pedido.deliveredAt ? (
          <p className="text-xs text-[#8FA1B7]">Entregado: {new Date(pedido.deliveredAt).toLocaleDateString('es-MX')}</p>
        ) : null}
      </div>
      <Badge className={`${config.className} text-xs font-bold capitalize px-3 py-1.5 shadow-sm transition-all duration-300 group-hover/item:scale-105`}>{config.label}</Badge>
    </li>
  );
}

