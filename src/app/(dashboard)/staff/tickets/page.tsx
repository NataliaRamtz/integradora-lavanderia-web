'use client';

import { useState, useMemo } from 'react';
import { Download, FileText, Loader2, Search, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/features/auth/session-context';
import { useLavanderia } from '@/features/lavanderias/queries';
import { usePedidosList } from '@/features/pedidos/queries';
import { useTickets, useTicketByPedidoId } from '@/features/tickets/queries';
import { useCreateTicket } from '@/features/tickets/mutations';

export default function TicketsPage() {
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';
  const { data: lavanderia } = useLavanderia(lavanderiaId);
  const [pedidoId, setPedidoId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const pedidosQuery = usePedidosList(lavanderiaId, {
    estado: 'todos',
    search: searchTerm,
  });

  const ticketsQuery = useTickets(lavanderiaId);
  const createTicketMutation = useCreateTicket();

  const pedidoSeleccionado = useMemo(() => {
    if (!pedidoId) return null;
    return pedidosQuery.data?.find((p) => p.id === pedidoId || p.id.startsWith(pedidoId));
  }, [pedidoId, pedidosQuery.data]);

  const pedidosRecientes = useMemo(() => {
    return pedidosQuery.data?.slice(0, 10) ?? [];
  }, [pedidosQuery.data]);
  
  const sinPedidosDisponible = !pedidosQuery.isLoading && (pedidosQuery.data?.length ?? 0) === 0;

  // Obtener ticket del pedido seleccionado si existe
  const ticketDelPedido = useTicketByPedidoId(pedidoSeleccionado?.id);

  const generateTicket = async (pedido?: typeof pedidoSeleccionado) => {
    const targetPedido = pedido || pedidoSeleccionado;
    if (!targetPedido || !lavanderiaId) {
      alert('Por favor selecciona un pedido válido');
      return;
    }

    try {
      // Crear o actualizar ticket en el backend
      const { ticket, pin } = await createTicketMutation.mutateAsync({
        pedidoId: targetPedido.id,
        lavanderiaId,
      });

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
                    CÓDIGO DE VALIDACIÓN
─────────────────────────────────────────────────────────

PIN: ${pin}
Código QR: ${ticket.qr_ref ?? 'N/A'}

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
      alert(error instanceof Error ? error.message : 'Error al generar el ticket. Intenta nuevamente.');
    }
  };

  // Función de ticket manual comentada
  // const handleManualTicket = async () => {
  //   if (!manualCliente.trim()) {
  //     alert('Por favor ingresa el nombre del cliente para el ticket manual.');
  //     return;
  //   }

  //   setIsManualGenerating(true);
  //   try {
  //     const totalNumber = Number(manualTotal) || 0;
  //     const fecha = new Date().toLocaleString('es-MX', {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     });

  //     const ticketContent = `
  // ╔═══════════════════════════════════════════════════════╗
  // ║         LAUNDRYPRO - TICKET MANUAL DEL ENCARGADO      ║
  // ╚═══════════════════════════════════════════════════════╝

  // Lavandería: ${lavanderia?.nombre ?? 'N/A'}
  // Fecha: ${fecha}
  // Cliente: ${manualCliente}
  // Total estimado: ${new Intl.NumberFormat('es-MX', {
  //       style: 'currency',
  //       currency: 'MXN',
  //     }).format(totalNumber)}

  // Notas adicionales:
  // ${manualNotas || 'Sin notas registradas'}

  // Generado manualmente por el encargado desde el panel de tickets.
  //     `.trim();

  //     const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = `ticket-manual-${manualCliente.replace(/\s+/g, '-')}-${Date.now()}.txt`;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //     setManualNotas('');
  //     setManualCliente('');
  //     setManualTotal('');
  //   } catch (error) {
  //     console.error('Error al generar ticket manual:', error);
  //     alert('Error al generar el ticket manual. Intenta nuevamente.');
  //   } finally {
  //     setIsManualGenerating(false);
  //   }
  // };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-[#F2F5FA]">Tickets Digitales</h1>
        <p className="text-sm text-[#BFC7D3]">
          Genera y descarga tickets digitales para los pedidos de tu lavandería.
        </p>
      </header>

      {sinPedidosDisponible ? (
        <div className="rounded-3xl border border-[#FFD97B]/40 bg-[#FFD97B]/10 p-5 text-sm text-[#FFD97B]">
          Este cliente aún no tiene tickets generados porque no cuenta con pedidos previos. Crea su primer pedido desde
          walk-in o espera a que el sistema sincronice nuevos pedidos para poder descargar su ticket.
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-[#25354B]/50 bg-[#1B2A40]/60">
          <CardHeader>
            <CardTitle className="text-[#F2F5FA]">Generar Nuevo Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pedidoId" className="text-sm text-[#BFC7D3]">
                Buscar Pedido
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA1B7]" />
                <Input
                  id="pedidoId"
                  type="text"
                  placeholder="Ingresa el ID del pedido o busca por número"
                  value={pedidoId}
                  onChange={(e) => setPedidoId(e.target.value)}
                  className="pl-10 border-[#25354B]/50 bg-[#25354B]/30 text-[#F2F5FA]"
                />
              </div>
              {pedidoId && pedidosQuery.isLoading && (
                <p className="text-xs text-[#BFC7D3]">Buscando pedidos...</p>
              )}
              {pedidoId && pedidosQuery.data && pedidosQuery.data.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-[#BFC7D3]">Pedidos encontrados:</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {pedidosQuery.data.slice(0, 5).map((pedido) => (
                      <button
                        key={pedido.id}
                        onClick={() => setPedidoId(pedido.id)}
                        className={`w-full text-left rounded-xl border px-3 py-2 text-sm transition ${
                          pedidoSeleccionado?.id === pedido.id
                            ? 'border-[#4C89D9] bg-[#4C89D9]/10 text-[#4C89D9]'
                            : 'border-[#25354B]/50 bg-[#25354B]/30 text-[#BFC7D3] hover:bg-[#25354B]/50'
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
              <div className="rounded-2xl border border-[#4C89D9]/30 bg-[#4C89D9]/10 p-4 space-y-2">
                <p className="text-sm font-semibold text-[#4C89D9]">Pedido seleccionado:</p>
                <div className="text-xs text-[#BFC7D3] space-y-1">
                  <p>ID: {pedidoSeleccionado.id.slice(0, 8).toUpperCase()}</p>
                  <p>Cliente: {pedidoSeleccionado.clienteNombre || 'Mostrador'}</p>
                  <p>
                    Total:{' '}
                    {new Intl.NumberFormat('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    }).format(pedidoSeleccionado.total)}
                  </p>
                  {ticketDelPedido.data && (
                    <div className="mt-2 pt-2 border-t border-[#4C89D9]/20 flex items-center gap-2">
                      {ticketDelPedido.data.validado ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-[#6DF2A4]" />
                          <span className="text-[#6DF2A4]">Ticket validado</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-[#FFD97B]" />
                          <span className="text-[#FFD97B]">Ticket pendiente de validar</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={() => generateTicket()}
              disabled={createTicketMutation.isPending || !pedidoSeleccionado}
              className="w-full bg-[#4C89D9] text-white hover:bg-[#4C89D9]/80"
            >
              {createTicketMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {ticketDelPedido.data ? 'Regenerar y Descargar Ticket' : 'Generar y Descargar Ticket'}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#25354B]/50 bg-[#1B2A40]/60">
          <CardHeader>
            <CardTitle className="text-[#F2F5FA]">Pedidos Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <Input
                type="text"
                placeholder="Buscar por cliente, teléfono o pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-[#25354B]/50 bg-[#25354B]/30 text-[#F2F5FA]"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {pedidosQuery.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-[#8FA1B7]" />
                </div>
              ) : pedidosRecientes.length === 0 ? (
                <p className="text-sm text-center py-8 text-[#BFC7D3]">No hay pedidos disponibles</p>
              ) : (
                pedidosRecientes.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between rounded-xl border border-[#25354B]/50 bg-[#25354B]/30 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#F2F5FA]">
                        Pedido #{pedido.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-[#BFC7D3]">
                        {new Date(pedido.createdAt).toLocaleDateString('es-MX')}
                      </p>
                      <p className="text-xs text-[#BFC7D3]">
                        Cliente: {pedido.clienteNombre ?? 'Mostrador'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#F2F5FA]">
                        {new Intl.NumberFormat('es-MX', {
                          style: 'currency',
                          currency: 'MXN',
                        }).format(pedido.total)}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateTicket(pedido)}
                        disabled={createTicketMutation.isPending}
                        className="border-[#25354B]"
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

      {/* Sección de creación manual de tickets comentada
      <Card className="border-[#25354B]/50 bg-[#1B2A40]/60">
        <CardHeader>
          <CardTitle className="text-[#F2F5FA]">Crear ticket manual</CardTitle>
          <p className="text-sm text-[#BFC7D3]">
            Úsalo cuando necesites entregar un comprobante rápido aunque el pedido aún no aparezca en el sistema.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manualCliente" className="text-sm text-[#BFC7D3]">
              Nombre del cliente
            </Label>
            <Input
              id="manualCliente"
              placeholder="Ej. Carla Ramírez"
              value={manualCliente}
              onChange={(event) => setManualCliente(event.target.value)}
              className="border-[#25354B]/50 bg-[#25354B]/30 text-[#F2F5FA]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manualTotal" className="text-sm text-[#BFC7D3]">
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
              className="border-[#25354B]/50 bg-[#25354B]/30 text-[#F2F5FA]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manualNotas" className="text-sm text-[#BFC7D3]">
              Notas para el ticket
            </Label>
            <textarea
              id="manualNotas"
              placeholder="Detalle de prendas, instrucciones o comentarios."
              rows={4}
              className="w-full rounded-2xl border border-[#25354B]/50 bg-[#25354B]/30 px-4 py-3 text-sm text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9] focus:outline-none focus:ring-1 focus:ring-[#4C89D9]"
              value={manualNotas}
              onChange={(event) => setManualNotas(event.target.value)}
            />
          </div>
          <Button
            className="w-full bg-[#4C89D9] text-white hover:bg-[#4C89D9]/80"
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
      */}

      <Card className="border-[#25354B]/50 bg-[#1B2A40]/60">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3 rounded-2xl border border-[#25354B]/50 bg-[#25354B]/30 p-4">
            <FileText className="h-5 w-5 text-[#4C89D9] mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#F2F5FA]">Información</p>
              <p className="text-xs text-[#BFC7D3]">
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
