'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Phone, Mail, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from '@/features/auth/session-context';
import {
  usePedidoDetalle,
  useUpdatePedidoEstado,
} from '@/features/pedidos/queries';
import type { PedidoEstado } from '@/features/pedidos/constants';

const estadoLabels: Record<PedidoEstado, string> = {
  creado: 'En Espera',
  en_proceso: 'En Proceso',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const estadoOptions: PedidoEstado[] = ['creado', 'en_proceso', 'listo', 'entregado', 'cancelado'];

const estadoColors: Record<PedidoEstado, string> = {
  creado: 'bg-sky-100 text-sky-700',
  en_proceso: 'bg-amber-100 text-amber-700',
  listo: 'bg-emerald-100 text-emerald-700',
  entregado: 'bg-slate-200 text-slate-700',
  cancelado: 'bg-rose-100 text-rose-700',
};

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
});

export default function PedidoDetallePage() {
  const router = useRouter();
  const params = useParams<{ pedidoId: string }>();
  const pedidoId = params.pedidoId;
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';

  const { data: pedido, isLoading, refetch } = usePedidoDetalle(lavanderiaId, pedidoId);
  const updateEstado = useUpdatePedidoEstado(lavanderiaId);

  const accionesDisponibles: PedidoEstado[] = useMemo(() => {
    if (!pedido) return [] as PedidoEstado[];
    switch (pedido.estado) {
      case 'creado':
        return ['en_proceso', 'listo', 'entregado'];
      case 'en_proceso':
        return ['listo', 'entregado'];
      case 'listo':
        return ['entregado'];
      default:
        return [];
    }
  }, [pedido]);

  const handleChangeEstado = async (nuevoEstado: PedidoEstado) => {
    if (!pedido) return;
    await updateEstado.mutateAsync({ pedidoId: pedido.id, estado: nuevoEstado });
    refetch();
  };

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-10 text-center text-sm text-slate-400">
        Cargando información del pedido…
      </section>
    );
  }

  if (!pedido) {
    return (
      <section className="space-y-4">
        <Button variant="ghost" className="text-slate-300" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </Button>
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/70 px-6 py-12 text-center text-sm text-slate-400">
          No encontramos el pedido solicitado.
        </div>
      </section>
    );
  }

  const fechaRecepcion = new Date(pedido.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subtotal = pedido.items.reduce((acc, item) => acc + item.subtotal, 0);
  const impuestos = subtotal * 0.05;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-slate-300" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </Button>
        <p className="text-xs text-slate-500">Dashboard ▸ Pedidos ▸ Pedido {pedido.id.slice(0, 6)}</p>
      </div>

      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-50">Pedido #{pedido.id.slice(0, 6)}</h1>
          <p className="text-sm text-slate-400">Detalles completos del pedido</p>
        </div>
        <Badge className={`${estadoColors[pedido.estado]} text-xs font-semibold`}>{estadoLabels[pedido.estado]}</Badge>
      </header>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <article className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className={`${estadoColors[pedido.estado]} text-xs font-semibold`}>{estadoLabels[pedido.estado]}</Badge>
            <select
              value={pedido.estado}
              onChange={(event) => handleChangeEstado(event.target.value as PedidoEstado)}
              className="rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-xs text-slate-200 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {estadoOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-900 text-slate-100">
                  {estadoLabels[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <p>
              <span className="text-slate-500">Fecha de recepción:</span> {fechaRecepcion}
            </p>
            {pedido.readyAt ? (
              <p>
                <span className="text-slate-500">Listo desde:</span> {new Date(pedido.readyAt).toLocaleDateString('es-MX')}
              </p>
            ) : null}
            {pedido.deliveredAt ? (
              <p>
                <span className="text-slate-500">Entregado:</span> {new Date(pedido.deliveredAt).toLocaleDateString('es-MX')}
              </p>
            ) : null}
          </div>

          {pedido.notas ? (
            <div className="rounded-2xl border border-white/5 bg-slate-950 px-4 py-3 text-sm text-slate-200">
              <span className="block text-xs uppercase tracking-wide text-slate-500">Notas del cliente</span>
              {pedido.notas}
            </div>
          ) : null}
        </article>

        <article className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-200">
          <h2 className="text-base font-semibold text-slate-50">Información del Cliente</h2>
          <p className="text-lg font-semibold text-slate-100">{pedido.clienteNombre ?? 'Cliente mostrador'}</p>
          {pedido.clienteTelefono ? (
            <p className="flex items-center gap-2 text-slate-300">
              <Phone className="h-4 w-4" /> {pedido.clienteTelefono}
            </p>
          ) : null}
          {pedido.clienteEmail ? (
            <p className="flex items-center gap-2 text-slate-300">
              <Mail className="h-4 w-4" /> {pedido.clienteEmail}
            </p>
          ) : null}
          {pedido.clienteDireccion ? (
            <p className="flex items-center gap-2 text-slate-300">
              <MapPin className="h-4 w-4" /> {pedido.clienteDireccion}
            </p>
          ) : null}
        </article>
      </div>

      <article className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <h2 className="text-base font-semibold text-slate-50">Servicios</h2>
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="min-w-full text-sm text-slate-200">
            <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Servicio</th>
                <th className="px-4 py-3 text-left font-medium">Cantidad</th>
                <th className="px-4 py-3 text-left font-medium">Precio</th>
                <th className="px-4 py-3 text-left font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item) => (
                <tr key={item.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-100">{item.nombre ?? 'Servicio'}</p>
                    {item.notas ? (
                      <p className="text-xs text-slate-500">Notas: {item.notas}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">{item.cantidad}</td>
                  <td className="px-4 py-3">{currencyFormatter.format(item.precioUnit)}</td>
                  <td className="px-4 py-3">{currencyFormatter.format(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950/50">
              <tr>
                <td className="px-4 py-3 text-right font-medium" colSpan={3}>
                  Subtotal
                </td>
                <td className="px-4 py-3">{currencyFormatter.format(subtotal)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-right font-medium" colSpan={3}>
                  IVA (5%)
                </td>
                <td className="px-4 py-3">{currencyFormatter.format(impuestos)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-right text-base font-semibold" colSpan={3}>
                  Total
                </td>
                <td className="px-4 py-3 text-base font-semibold">
                  {currencyFormatter.format(pedido.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </article>

      {accionesDisponibles.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          {accionesDisponibles.map((accion) => (
            <Button
              key={accion}
              onClick={() => handleChangeEstado(accion)}
              disabled={updateEstado.isPending}
              className={`min-w-[160px] ${accion === 'en_proceso' ? 'bg-sky-500 hover:bg-sky-600' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              {updateEstado.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {accion === 'en_proceso'
                ? 'Iniciar proceso'
                : accion === 'listo'
                ? 'Marcar como listo'
                : 'Marcar como entregado'}
            </Button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
