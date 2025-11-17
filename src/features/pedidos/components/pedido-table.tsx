import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { Loader2 } from 'lucide-react';
import type { PedidoListItem } from '../schemas';
import type { PedidoEstado } from '../constants';
import { Badge } from '@/components/ui/badge';

type PedidoTableProps = {
  estado: PedidoEstado;
  isLoading: boolean;
  data: PedidoListItem[];
};

const estadoLabels: Record<PedidoEstado, string> = {
  creado: 'Creado',
  en_proceso: 'En proceso',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

export const PedidoTable = ({ estado, isLoading, data }: PedidoTableProps) => {
  return (
    <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Pedidos {estadoLabels[estado]}
          </h2>
          <p className="text-sm text-slate-400">
            {isLoading ? 'Actualizando...' : `${data.length} pedidos`}
          </p>
        </div>
        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-slate-300" />}
      </header>

      <div className="overflow-hidden rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-900/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Pedido
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Creado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/40">
            {!isLoading && data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-400">
                  No hay pedidos en este estado.
                </td>
              </tr>
            )}
            {data.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-slate-900/50">
                <td className="px-4 py-3 text-sm font-medium text-slate-100">
                  {pedido.id.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 text-sm text-slate-200">
                  {pedido.clienteNombre ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-200">
                  ${pedido.total.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-200">
                  <Badge estado={pedido.estado} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">
                  {format(new Date(pedido.createdAt), "d 'de' MMM, HH:mm", {
                    locale: es,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

