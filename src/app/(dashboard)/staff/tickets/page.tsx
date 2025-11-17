'use client';

import { useState, useMemo } from 'react';
import { Download, FileText, Loader2, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/features/auth/session-context';
import { useLavanderia } from '@/features/lavanderias/queries';
import { usePedidosList } from '@/features/pedidos/queries';
import { getBrowserClient } from '@/lib/supabase';

export default function TicketsPage() {
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';
  const { data: lavanderia } = useLavanderia(lavanderiaId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pedidoId, setPedidoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [manualCliente, setManualCliente] = useState('');
  const [manualTotal, setManualTotal] = useState('');
  const [manualNotas, setManualNotas] = useState('');
  const [isManualGenerating, setIsManualGenerating] = useState(false);

  const pedidosQuery = usePedidosList(lavanderiaId, {
    estado: 'todos',
    search: searchTerm,
  });

  const pedidoSeleccionado = useMemo(() => {
    if (!pedidoId) return null;
    return pedidosQuery.data?.find((p) => p.id === pedidoId || p.id.startsWith(pedidoId));
  }, [pedidoId, pedidosQuery.data]);

  const pedidosRecientes = useMemo(() => {
    return pedidosQuery.data?.slice(0, 10) ?? [];
  }, [pedidosQuery.data]);
  const sinPedidosDisponible = !pedidosQuery.isLoading && (pedidosQuery.data?.length ?? 0) === 0;

  const generateTicket = async (pedido?: typeof pedidoSeleccionado) => {
    const targetPedido = pedido || pedidoSeleccionado;
    if (!targetPedido) {
      alert('Por favor selecciona un pedido válido');
      return;
    }

    setIsGenerating(true);
    try {
      const fecha = new Date(targetPedido.createdAt).toLocaleString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const ticketContent = `
╔═══════════════════════════════════════════════════════╗
║              LAUNDRYPRO - TICKET DIGITAL              ║
╚═══════════════════════════════════════════════════════╝

Lavandería: ${lavanderia?.nombre ?? 'N/A'}
Pedido: #${targetPedido.id.slice(0, 8).toUpperCase()}
Fecha: ${fecha}
Estado: ${targetPedido.estado.toUpperCase()}

${targetPedido.clienteNombre ? `Cliente: ${targetPedido.clienteNombre}` : 'Cliente: Mostrador'}
${targetPedido.clienteTelefono ? `Teléfono: ${targetPedido.clienteTelefono}` : ''}

${targetPedido.notas ? `Notas: ${targetPedido.notas}` : ''}

─────────────────────────────────────────────────────────
                    RESUMEN DEL PEDIDO
─────────────────────────────────────────────────────────

Total: ${new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(targetPedido.total)}

─────────────────────────────────────────────────────────

Gracias por su preferencia
LaundryPro - Sistema de Gestión de Lavanderías

═══════════════════════════════════════════════════════
      `.trim();

      const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-${targetPedido.id.slice(0, 8)}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar ticket:', error);
      alert('Error al generar el ticket. Intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualTicket = async () => {
    if (!manualCliente.trim()) {
      alert('Por favor ingresa el nombre del cliente para el ticket manual.');
      return;
    }

    setIsManualGenerating(true);
    try {
      const totalNumber = Number(manualTotal) || 0;
      const fecha = new Date().toLocaleString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const ticketContent = `
╔═══════════════════════════════════════════════════════╗
║         LAUNDRYPRO - TICKET MANUAL DEL ENCARGADO      ║
╚═══════════════════════════════════════════════════════╝

Lavandería: ${lavanderia?.nombre ?? 'N/A'}
Fecha: ${fecha}
Cliente: ${manualCliente}
Total estimado: ${new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(totalNumber)}

Notas adicionales:
${manualNotas || 'Sin notas registradas'}

Generado manualmente por el encargado desde el panel de tickets.
      `.trim();

      const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ticket-manual-${manualCliente.replace(/\s+/g, '-')}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setManualNotas('');
      setManualCliente('');
      setManualTotal('');
    } catch (error) {
      console.error('Error al generar ticket manual:', error);
      alert('Error al generar el ticket manual. Intenta nuevamente.');
    } finally {
      setIsManualGenerating(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest dark:text-slate-500 text-slate-600">Dashboard ▸ Tickets</p>
        <h1 className="text-3xl font-semibold dark:text-slate-50 text-slate-900">Tickets Digitales</h1>
        <p className="text-sm dark:text-slate-400 text-slate-600">
          Genera y descarga tickets digitales para los pedidos de tu lavandería.
        </p>
      </header>

      {sinPedidosDisponible ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
          Este cliente aún no tiene tickets generados porque no cuenta con pedidos previos. Crea su primer pedido desde
          walk-in o espera a que el sistema sincronice nuevos pedidos para poder descargar su ticket.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
          <CardHeader>
            <CardTitle className="dark:text-slate-100 text-slate-900">Generar Nuevo Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pedidoId" className="text-sm dark:text-slate-200 text-slate-700">
                Buscar Pedido
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 dark:text-slate-400 text-slate-500" />
                <Input
                  id="pedidoId"
                  type="text"
                  placeholder="Ingresa el ID del pedido o busca por número"
                  value={pedidoId}
                  onChange={(e) => setPedidoId(e.target.value)}
                  className="pl-10 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100 border-slate-300 bg-white text-slate-900"
                />
              </div>
              {pedidoId && pedidosQuery.isLoading && (
                <p className="text-xs dark:text-slate-400 text-slate-600">Buscando pedidos...</p>
              )}
              {pedidoId && pedidosQuery.data && pedidosQuery.data.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs dark:text-slate-400 text-slate-600">Pedidos encontrados:</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {pedidosQuery.data.slice(0, 5).map((pedido) => (
                      <button
                        key={pedido.id}
                        onClick={() => setPedidoId(pedido.id)}
                        className={`w-full text-left rounded-xl border px-3 py-2 text-sm transition ${
                          pedidoSeleccionado?.id === pedido.id
                            ? 'border-sky-500 bg-sky-500/10 dark:text-sky-200 text-sky-700'
                            : 'dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/80'
                        }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Pedido #{pedido.id.slice(0, 8).toUpperCase()}</span>
                            <span className="text-xs">
                            {new Intl.NumberFormat('es-MX', {
                              style: 'currency',
                              currency: 'MXN',
                            }).format(pedido.total)}
                          </span>
                        </div>
                          <p className="text-xs mt-1">
                            Cliente: {pedido.clienteNombre ?? 'Mostrador'}
                          </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {pedidoSeleccionado && (
              <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 dark:bg-sky-500/10 p-4 space-y-2">
                <p className="text-sm font-semibold dark:text-sky-200 text-sky-700">Pedido seleccionado:</p>
                <div className="text-xs dark:text-slate-300 text-slate-700 space-y-1">
                  <p>ID: {pedidoSeleccionado.id.slice(0, 8).toUpperCase()}</p>
                  <p>Cliente: {pedidoSeleccionado.clienteNombre || 'Mostrador'}</p>
                  <p>
                    Total:{' '}
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    }).format(pedidoSeleccionado.total)}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={() => generateTicket()}
              disabled={isGenerating || !pedidoSeleccionado}
              className="w-full bg-sky-500 text-white hover:bg-sky-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Ticket Digital
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
          <CardHeader>
            <CardTitle className="dark:text-slate-100 text-slate-900">Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <Input
                type="text"
                placeholder="Buscar por cliente, teléfono o pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100 border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pedidosQuery.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin dark:text-slate-400 text-slate-600" />
                </div>
              ) : pedidosRecientes.length === 0 ? (
                <p className="text-sm text-center py-8 dark:text-slate-400 text-slate-600">No hay pedidos disponibles</p>
              ) : (
                pedidosRecientes.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between rounded-xl border dark:border-white/10 border-slate-200 dark:bg-slate-950/60 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold dark:text-slate-100 text-slate-900">
                        Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs dark:text-slate-400 text-slate-600">
                        {new Date(pedido.createdAt).toLocaleDateString('es-MX')}
                      </p>
                      <p className="text-xs dark:text-slate-400 text-slate-600">
                        Cliente: {pedido.clienteNombre ?? 'Mostrador'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold dark:text-slate-100 text-slate-900">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                        }).format(pedido.total)}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateTicket(pedido)}
                        disabled={isGenerating}
                        className="dark:border-slate-700 border-slate-300"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
        <CardHeader>
          <CardTitle className="dark:text-slate-100 text-slate-900">Crear ticket manual</CardTitle>
          <p className="text-sm dark:text-slate-400 text-slate-600">
            Úsalo cuando necesites entregar un comprobante rápido aunque el pedido aún no aparezca en el sistema.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manualCliente" className="text-sm dark:text-slate-200 text-slate-700">
              Nombre del cliente
            </Label>
            <Input
              id="manualCliente"
              placeholder="Ej. Carla Ramírez"
              value={manualCliente}
              onChange={(event) => setManualCliente(event.target.value)}
              className="dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100 border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manualTotal" className="text-sm dark:text-slate-200 text-slate-700">
              Total estimado (MXN)
            </Label>
            <Input
              id="manualTotal"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={manualTotal}
              onChange={(event) => setManualTotal(event.target.value)}
              className="dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100 border-slate-300 bg-white text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manualNotas" className="text-sm dark:text-slate-200 text-slate-700">
              Notas para el ticket
            </Label>
            <textarea
              id="manualNotas"
              placeholder="Detalle de prendas, instrucciones o comentarios."
              rows={4}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100"
              value={manualNotas}
              onChange={(event) => setManualNotas(event.target.value)}
            />
          </div>
          <Button
            className="w-full bg-sky-600 text-white hover:bg-sky-700"
            onClick={handleManualTicket}
            disabled={isManualGenerating}
          >
            {isManualGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando ticket manual…
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Crear y descargar ticket
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 rounded-2xl border dark:border-white/10 border-slate-200 dark:bg-slate-950/60 bg-slate-50 p-4">
            <FileText className="h-5 w-5 dark:text-sky-400 text-sky-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold dark:text-slate-100 text-slate-900">Información</p>
              <p className="text-xs dark:text-slate-400 text-slate-600">
                Los tickets digitales incluyen toda la información del pedido y se descargan en formato de texto.
                Puedes imprimirlos o compartirlos digitalmente con tus clientes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
