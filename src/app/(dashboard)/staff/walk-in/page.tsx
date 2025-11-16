"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/session-context";
import { useServiciosResumen } from "@/features/servicios/queries";
import { useCreateWalkInPedido } from "@/features/pedidos/queries";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});

export default function WalkInPage() {
  const router = useRouter();
  const { activeRole, user } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? "";

  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [notas, setNotas] = useState("");
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const serviciosQuery = useServiciosResumen(lavanderiaId, { limit: 50 });
  const createPedido = useCreateWalkInPedido();
 
  const servicios = useMemo(() => serviciosQuery.data ?? [], [serviciosQuery.data]);
 
  const itemsSeleccionados = useMemo(
    () =>
      servicios
        .map((servicio) => {
          const cantidad = cantidades[servicio.id] ?? 0;
          if (cantidad <= 0) return null;
          return {
            servicioId: servicio.id,
            nombre: servicio.nombre,
            cantidad,
            precioUnit: servicio.precio,
            subtotal: servicio.precio * cantidad,
            unidad: servicio.unidad,
          };
        })
        .filter(Boolean) as Array<{
          servicioId: string;
          nombre: string;
          cantidad: number;
          precioUnit: number;
          subtotal: number;
          unidad?: string;
        }>,
    [servicios, cantidades]
  );

  const total = itemsSeleccionados.reduce((acc, item) => acc + item.subtotal, 0);

  const handleCantidad = (servicioId: string, delta: number) => {
    setCantidades((prev) => {
      const next = Math.max(0, (prev[servicioId] ?? 0) + delta);
      return { ...prev, [servicioId]: next };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!lavanderiaId) {
      setFormError("No se ha seleccionado una lavandería activa.");
      return;
    }

    if (itemsSeleccionados.length === 0) {
      setFormError("Agrega al menos un servicio para crear el pedido.");
      return;
    }

    try {
      await createPedido.mutateAsync({
        lavanderiaId,
        createdBy: user?.id,
        createdByRoleId: activeRole?.id ?? null,
        clienteNombre: clienteNombre.trim() || undefined,
        clienteTelefono: clienteTelefono.trim() || undefined,
        notas: notas.trim() || undefined,
        items: itemsSeleccionados.map((item) => ({
          servicioId: item.servicioId,
          cantidad: item.cantidad,
          precioUnit: item.precioUnit,
          subtotal: item.subtotal,
        })),
      });

      setFormSuccess("Pedido creado correctamente.");
      setCantidades({});
      setNotas("");
      setClienteNombre("");
      setClienteTelefono("");
      router.push("/staff/pedidos");
    } catch (error) {
      console.error(error);
      setFormError(
        error instanceof Error
          ? error.message
          : "No pudimos crear el pedido. Intenta nuevamente."
      );
    }
  };

  if (!lavanderiaId) {
    return (
      <section className="space-y-4">
        <Button variant="ghost" className="text-slate-300" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </Button>
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/70 px-6 py-12 text-center text-sm text-slate-400">
          Debes tener una lavandería activa para crear pedidos.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-slate-300" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </Button>
        <p className="text-xs text-slate-500">Dashboard ▸ Pedidos ▸ Crear walk-in</p>
      </div>

      <header className="space-y-1">
        <h1 className="text-3xl font-semibold text-slate-50">Crear pedido walk-in</h1>
        <p className="text-sm text-slate-400">
          Registra pedidos de clientes mostrador sin necesidad de cuenta.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="grid gap-5 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clienteNombre">Nombre del cliente</Label>
            <Input
              id="clienteNombre"
              placeholder="Ej. Laura González"
              value={clienteNombre}
              onChange={(event) => setClienteNombre(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clienteTelefono">Teléfono</Label>
            <Input
              id="clienteTelefono"
              placeholder="Ej. +52 55 1234 5678"
              value={clienteTelefono}
              onChange={(event) => setClienteTelefono(event.target.value)}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="notas">Notas adicionales</Label>
            <textarea
              id="notas"
              placeholder="Instrucciones especiales, preferencias, etc."
              className="min-h-[100px] w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={notas}
              onChange={(event) => setNotas(event.target.value)}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <header className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Servicios</p>
              <h2 className="text-lg font-semibold text-slate-100">Selecciona los servicios del pedido</h2>
            </div>
            <Button asChild variant="outline" className="border-slate-700 bg-transparent text-xs text-slate-300">
              <Link href="/staff/catalogo">Gestionar catálogo</Link>
            </Button>
          </header>

          {serviciosQuery.isLoading ? (
            <p className="text-sm text-slate-400">Cargando servicios…</p>
          ) : servicios.length === 0 ? (
            <p className="text-sm text-slate-400">
              No tienes servicios activos. Crea al menos uno para registrar pedidos.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {servicios.map((servicio) => {
                const cantidad = cantidades[servicio.id] ?? 0;
                return (
                  <div
                    key={servicio.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{servicio.nombre}</p>
                      <p className="text-xs text-slate-500">
                        {currencyFormatter.format(servicio.precio)}
                        {servicio.unidad ? ` / ${servicio.unidad}` : ''}
                      </p>
                      {servicio.descripcion ? (
                        <p className="mt-1 text-xs text-slate-500">{servicio.descripcion}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 w-8 border-slate-700 bg-transparent text-slate-300"
                        onClick={() => handleCantidad(servicio.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-sm font-semibold text-slate-100">{cantidad}</span>
                      <Button
                        type="button"
                        className="h-8 w-8 bg-sky-500 text-white hover:bg-sky-600"
                        onClick={() => handleCantidad(servicio.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <header>
            <p className="text-xs uppercase tracking-wide text-slate-500">Resumen</p>
            <h2 className="text-lg font-semibold text-slate-100">Detalles del pedido</h2>
          </header>

          {itemsSeleccionados.length === 0 ? (
            <p className="text-sm text-slate-400">Selecciona servicios para ver el resumen.</p>
          ) : (
            <div className="space-y-2 text-sm text-slate-300">
              {itemsSeleccionados.map((item) => (
                <div key={item.servicioId} className="flex items-center justify-between">
                  <span>
                    {item.nombre}
                    {item.unidad ? <span className="text-xs text-slate-500"> ({item.unidad})</span> : null} ×{' '}
                    {item.cantidad}
                  </span>
                  <span>{currencyFormatter.format(item.subtotal)}</span>
                </div>
              ))}
              <div className="mt-3 flex items-center justify-between text-base font-semibold text-slate-100">
                <span>Total a cobrar</span>
                <span>{currencyFormatter.format(total)}</span>
              </div>
            </div>
          )}
        </section>

        {formError ? (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {formError}
          </div>
        ) : null}

        {formSuccess ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {formSuccess}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={createPedido.isPending}
            className="bg-sky-500 text-white hover:bg-sky-600"
          >
            {createPedido.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Registrar pedido
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-slate-700 bg-transparent text-slate-300"
            onClick={() => router.push('/staff/pedidos')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
