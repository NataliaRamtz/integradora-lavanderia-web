'use client';

import { useDeferredValue, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronDown, Plus, Loader2, Clock, PlayCircle, CheckCircle2, Package, XCircle, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-context';
import { usePedidosList } from '@/features/pedidos/queries';
import { useServiciosResumen } from '@/features/servicios/queries';
import type { PedidoEstado } from '@/features/pedidos/constants';
import type { PedidoListItem } from '@/features/pedidos/schemas';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

const estadoLabels: Record<PedidoEstado, string> = {
  creado: 'En Espera',
  en_proceso: 'En Proceso',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const estadoColors: Record<PedidoEstado, string> = {
  creado: 'bg-[#4C89D9]/20 text-[#4C89D9] border border-[#4C89D9]/30',
  en_proceso: 'bg-[#FFD97B]/20 text-[#FFD97B] border border-[#FFD97B]/30',
  listo: 'bg-[#6DF2A4]/20 text-[#6DF2A4] border border-[#6DF2A4]/30',
  entregado: 'bg-[#8FA1B7]/20 text-[#8FA1B7] border border-[#8FA1B7]/30',
  cancelado: 'bg-[#FF8B6B]/20 text-[#FF8B6B] border border-[#FF8B6B]/30',
};

const estadoIcons: Record<PedidoEstado, typeof Clock> = {
  creado: Clock,
  en_proceso: PlayCircle,
  listo: CheckCircle2,
  entregado: Package,
  cancelado: XCircle,
};

const estadoIconColors: Record<PedidoEstado, string> = {
  creado: 'from-[#4C89D9] via-[#60C2D8] to-[#4C89D9]',
  en_proceso: 'from-[#FFD97B] via-[#FF8B6B] to-[#FFD97B]',
  listo: 'from-[#6DF2A4] via-[#60C2D8] to-[#6DF2A4]',
  entregado: 'from-[#8FA1B7] via-[#BFC7D3] to-[#8FA1B7]',
  cancelado: 'from-[#FF8B6B] via-[#FFD97B] to-[#FF8B6B]',
};

const estadoIconGlow: Record<PedidoEstado, string> = {
  creado: 'shadow-[0_0_20px_rgba(76,137,217,0.6)]',
  en_proceso: 'shadow-[0_0_20px_rgba(255,217,123,0.6)]',
  listo: 'shadow-[0_0_20px_rgba(109,242,164,0.6)]',
  entregado: 'shadow-[0_0_20px_rgba(143,161,183,0.6)]',
  cancelado: 'shadow-[0_0_20px_rgba(255,139,107,0.6)]',
};

const estadosOptions: Array<{ value: PedidoEstado | 'todos'; label: string }> = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'creado', label: 'En Espera' },
  { value: 'en_proceso', label: 'En Proceso' },
  { value: 'listo', label: 'Listos' },
  { value: 'entregado', label: 'Entregados' },
  { value: 'cancelado', label: 'Cancelados' },
];

function PedidosPageContent() {
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';
  const searchParams = useSearchParams();
  const serviciosQuery = useServiciosResumen(lavanderiaId);

  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<PedidoEstado | 'todos'>(() => {
    const estadoParam = searchParams.get('estado');
    if (estadoParam && ['creado', 'en_proceso', 'listo', 'entregado', 'cancelado'].includes(estadoParam)) {
      return estadoParam as PedidoEstado;
    }
    return 'todos';
  });
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const estadoParam = searchParams.get('estado');
    if (estadoParam && ['creado', 'en_proceso', 'listo', 'entregado', 'cancelado'].includes(estadoParam)) {
      setEstado(estadoParam as PedidoEstado);
    }
  }, [searchParams]);

  const pedidosQuery = usePedidosList(lavanderiaId, {
    estado,
    search: deferredSearch,
  });

  const pedidos = pedidosQuery.data ?? [];
  const catalogoVacio = !serviciosQuery.isLoading && (serviciosQuery.data?.length ?? 0) === 0;

  return (
    <section className="space-y-6">
      <header className="space-y-2 mb-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#F2F5FA] via-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">Gestión de Pedidos</h1>
        <p className="text-sm text-[#BFC7D3] font-medium">Administra todos los pedidos de tu lavandería</p>
      </header>

      {catalogoVacio ? (
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFD97B]/40 bg-gradient-to-br from-[#FFD97B]/10 via-[#FFD97B]/5 to-[#FFD97B]/10 p-6 text-sm text-[#FFD97B] backdrop-blur-sm transition-all duration-300 hover:border-[#FFD97B]/60 hover:shadow-xl hover:shadow-[#FFD97B]/20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFD97B]/5 via-transparent to-[#FFD97B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <p className="font-bold text-base mb-2">Antes de crear pedidos</p>
            <p className="leading-relaxed">
              Necesitas agregar servicios a tu catálogo. Sin catálogo no es posible registrar pedidos nuevos.{' '}
              <Link href="/staff/catalogo" className="font-bold text-[#60C2D8] underline decoration-2 underline-offset-2 transition-all duration-300 hover:text-[#4C89D9]">
                Crear catálogo
              </Link>
            </p>
          </div>
        </div>
      ) : null}

      <article className="group relative overflow-hidden flex items-center justify-between gap-4 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 px-6 py-5 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">Acción rápida</p>
          <h2 className="mt-2 text-xl font-extrabold text-[#F2F5FA]">Crear pedido rápido</h2>
          <p className="mt-1 text-sm text-[#BFC7D3] font-medium">
            Registra pedidos mostrador sin necesidad de que el cliente tenga cuenta.
          </p>
        </div>
        <div className="relative flex gap-3">
          <Button asChild className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-300">
            <Link href="/staff/walk-in">
              <Plus className="mr-2 h-4 w-4" /> Crear pedido
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-2 border-[#25354B] bg-transparent text-[#BFC7D3] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:text-[#F2F5FA] transition-all duration-300">
            <Link href="/staff">Ver dashboard</Link>
          </Button>
        </div>
      </article>

      <div className="group relative overflow-hidden flex flex-wrap items-center gap-3 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA1B7] transition-colors duration-300 group-hover:text-[#4C89D9]" />
          <input
            type="search"
            placeholder="Buscar por número de pedido o telefono"
            className="relative w-full rounded-2xl border-2 border-[#25354B]/50 bg-[#1B2A40]/60 py-3 pl-10 pr-4 text-sm text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9] focus:bg-[#25354B]/50 focus:outline-none focus:ring-2 focus:ring-[#4C89D9]/20 transition-all duration-300"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="relative">
          <select
            value={estado}
            onChange={(event) => setEstado(event.target.value as PedidoEstado | 'todos')}
            className="relative appearance-none rounded-2xl border-2 border-[#25354B]/50 bg-[#1B2A40]/60 py-3 pl-4 pr-10 text-sm text-[#F2F5FA] focus:border-[#4C89D9] focus:bg-[#25354B]/50 focus:outline-none focus:ring-2 focus:ring-[#4C89D9]/20 transition-all duration-300"
          >
            {estadosOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1B2A40] text-[#F2F5FA]">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA1B7] transition-colors duration-300 group-hover:text-[#4C89D9]" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pedidosQuery.isLoading ? (
          <div className="md:col-span-2 lg:col-span-3 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 px-6 py-10 text-center text-sm text-[#BFC7D3] backdrop-blur-md">
            <Loader2 className="mx-auto h-5 w-5 animate-spin mb-2" />
            Cargando pedidos…
          </div>
        ) : pedidos.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 rounded-3xl border-2 border-dashed border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 px-6 py-10 text-center text-sm text-[#BFC7D3] backdrop-blur-md">
            No encontramos pedidos con los filtros aplicados.
          </div>
        ) : (
          pedidos.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
        )}
      </div>
    </section>
  );
}

type PedidoCardProps = {
  pedido: PedidoListItem;
};

function PedidoCard({ pedido }: PedidoCardProps) {
  const estadoLabel = estadoLabels[pedido.estado];
  const estadoColor = estadoColors[pedido.estado];
  const EstadoIcon = estadoIcons[pedido.estado];
  const iconGradient = estadoIconColors[pedido.estado];
  const iconGlow = estadoIconGlow[pedido.estado];
  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/staff/pedidos/${pedido.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4C89D9]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E1624]"
    >
      <article className="relative overflow-hidden flex flex-col gap-4 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 px-6 py-5 shadow-sm h-[240px] transition-all duration-300 group-hover:border-[#4C89D9]/50 group-hover:shadow-lg group-hover:shadow-[#4C89D9]/20 group-hover:-translate-y-1">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`relative flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${iconGradient} border-2 border-white/20 ${iconGlow} transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-2xl`}>
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${iconGradient} opacity-50 blur-md`} />
              <EstadoIcon className="relative h-8 w-8 text-white drop-shadow-lg" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h2 className="text-lg font-extrabold text-[#F2F5FA]">Pedido #{pedido.id.slice(0, 6)}</h2>
              <p className="text-xs text-[#8FA1B7] font-medium">Recepción: {fecha}</p>
              {pedido.notas ? (
                <p className="text-xs text-[#BFC7D3] leading-relaxed line-clamp-2">{pedido.notas}</p>
              ) : null}
            </div>
          </div>
          <Badge className={`${estadoColor} text-xs font-bold capitalize px-3 py-1.5 shadow-sm flex-shrink-0`}>{estadoLabel}</Badge>
        </div>

        <div className="relative grid gap-2 text-sm text-[#BFC7D3] md:grid-cols-2 flex-1">
          <p className="truncate">
            <span className="text-[#8FA1B7] font-medium">Cliente:</span> <span className="text-[#F2F5FA]">{pedido.clienteNombre ?? 'Cliente mostrador'}</span>
          </p>
          {pedido.clienteTelefono ? (
            <p className="truncate">
              <span className="text-[#8FA1B7] font-medium">Teléfono:</span> <span className="text-[#F2F5FA]">{pedido.clienteTelefono}</span>
            </p>
          ) : (
            <p className="truncate"></p>
          )}
          <p className="md:col-span-2">
            <span className="text-[#8FA1B7] font-medium">Total:</span>{' '}
            <span className="text-lg font-bold bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">
              {currencyFormatter.format(pedido.total)}
            </span>
          </p>
        </div>

        <div className="relative flex items-center justify-end mt-auto text-sm font-semibold text-[#4C89D9]">
          <span className="flex items-center gap-1">
            Ver detalles
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function PedidosPage() {
  return (
    <Suspense
      fallback={
        <section className="space-y-6">
          <div className="flex items-center justify-center rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 py-20 text-[#BFC7D3] backdrop-blur-md">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Cargando pedidos…
          </div>
        </section>
      }
    >
      <PedidosPageContent />
    </Suspense>
  );
}

