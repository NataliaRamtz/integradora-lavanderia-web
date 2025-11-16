'use client';

import { useDeferredValue, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronDown, Plus, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-context';
import { usePedidosList } from '@/features/pedidos/queries';
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
  creado: 'bg-sky-100 text-sky-700',
  en_proceso: 'bg-amber-100 text-amber-700',
  listo: 'bg-emerald-100 text-emerald-700',
  entregado: 'bg-slate-200 text-slate-700',
  cancelado: 'bg-rose-100 text-rose-700',
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

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-slate-500">Dashboard ▸ Pedidos</p>
        <h1 className="text-3xl font-semibold text-slate-50">Gestión de Pedidos</h1>
        <p className="text-sm text-slate-400">Administra todos los pedidos de tu lavandería</p>
      </header>

      <article className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Acción rápida</p>
          <h2 className="text-xl font-semibold text-slate-50">Crear pedido rápido</h2>
          <p className="mt-1 text-sm text-slate-400">
            Registra pedidos mostrador sin necesidad de que el cliente tenga cuenta.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-sky-500 text-white hover:bg-sky-600">
            <Link href="/staff/walk-in">
              <Plus className="mr-2 h-4 w-4" /> Crear pedido
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-700 bg-transparent text-slate-300">
            <Link href="/staff">Ver dashboard</Link>
          </Button>
        </div>
      </article>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar por número de pedido o cliente"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="relative">
          <select
            value={estado}
            onChange={(event) => setEstado(event.target.value as PedidoEstado | 'todos')}
            className="appearance-none rounded-2xl border border-white/10 bg-slate-900/70 py-3 pl-4 pr-10 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            {estadosOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="space-y-4">
        {pedidosQuery.isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400">
            Cargando pedidos…
          </div>
        ) : pedidos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400">
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
  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-100">Pedido #{pedido.id.slice(0, 6)}</h2>
          <p className="text-xs text-slate-500">Recepción: {fecha}</p>
          {pedido.notas ? (
            <p className="text-xs text-slate-400">Notas: {pedido.notas}</p>
          ) : null}
        </div>
        <Badge className={`${estadoColor} text-xs font-semibold capitalize`}>{estadoLabel}</Badge>
      </div>

      <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
        <p>
          <span className="text-slate-500">Cliente:</span> {pedido.clienteNombre ?? 'Cliente mostrador'}
        </p>
        {pedido.clienteTelefono ? (
          <p>
            <span className="text-slate-500">Teléfono:</span> {pedido.clienteTelefono}
          </p>
        ) : null}
        <p>
          <span className="text-slate-500">Total:</span> {currencyFormatter.format(pedido.total)}
        </p>
      </div>

      <div className="flex items-center justify-end">
        <Button asChild className="bg-sky-500 text-white hover:bg-sky-600">
          <Link href={`/staff/pedidos/${pedido.id}`}>Ver detalles</Link>
        </Button>
      </div>
    </article>
  );
}

export default function PedidosPage() {
  return (
    <Suspense
      fallback={
        <section className="space-y-6">
          <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-slate-900/60 py-20 text-slate-400">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Cargando pedidos…
          </div>
        </section>
      }
    >
      <PedidosPageContent />
    </Suspense>
  );
}

