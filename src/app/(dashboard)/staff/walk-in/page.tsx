"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
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
  const [fieldErrors, setFieldErrors] = useState<{
    clienteNombre?: string;
    clienteTelefono?: string;
  }>({});

  const serviciosQuery = useServiciosResumen(lavanderiaId, { limit: 50 });
  const createPedido = useCreateWalkInPedido();
 
  const servicios = useMemo(() => serviciosQuery.data ?? [], [serviciosQuery.data]);
  const catalogoVacio = serviciosQuery.isSuccess && servicios.length === 0;
 
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
    setFieldErrors({});

    if (!lavanderiaId) {
      setFormError("No se ha seleccionado una lavandería activa.");
      return;
    }

    const errors: typeof fieldErrors = {};
    if (!clienteNombre.trim()) {
      errors.clienteNombre = "El nombre del cliente es obligatorio.";
    }
    if (!clienteTelefono.trim()) {
      errors.clienteTelefono = "El teléfono es obligatorio.";
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError("Por favor, completa los campos obligatorios.");
      return;
    }

    if (itemsSeleccionados.length === 0) {
      setFormError("Agrega al menos un servicio para crear el pedido.");
      return;
    }

    const nombreSafe = clienteNombre.trim();
    const telefonoSafe = clienteTelefono.trim();

    try {
      await createPedido.mutateAsync({
        lavanderiaId,
        createdBy: user?.id,
        createdByRoleId: activeRole?.id ?? null,
        clienteNombre: nombreSafe,
        clienteTelefono: telefonoSafe,
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
      setFieldErrors({});
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
        <Button variant="ghost" className="text-[#BFC7D3] hover:text-[#F2F5FA]" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </Button>
        <div className="rounded-3xl border border-dashed border-[#25354B]/50 bg-[#1B2A40]/60 px-6 py-12 text-center text-sm text-[#BFC7D3]">
          Debes tener una lavandería activa para crear pedidos.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="text-[#BFC7D3] hover:text-[#F2F5FA]" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </Button>
      </div>

      <header className="space-y-2 mb-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#F2F5FA] via-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">Crear pedido walk-in</h1>
        <p className="text-sm text-[#BFC7D3] font-medium">
          Registra pedidos de clientes mostrador sin necesidad de cuenta.
        </p>
      </header>

      {catalogoVacio ? (
        <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFD97B]/40 bg-gradient-to-br from-[#FFD97B]/10 via-[#FFD97B]/5 to-[#FFD97B]/10 p-6 text-sm text-[#FFD97B] backdrop-blur-sm transition-all duration-300 hover:border-[#FFD97B]/60 hover:shadow-xl hover:shadow-[#FFD97B]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD97B]/5 via-transparent to-[#FFD97B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <p className="font-bold text-base mb-2">Debes agregar un catálogo primero para poder registrar pedidos walk-in.</p>
            <p className="leading-relaxed">
              Dirígete a{' '}
              <button
                type="button"
                onClick={() => router.push('/staff/catalogo')}
                className="font-bold text-[#60C2D8] underline decoration-2 underline-offset-2 transition-all duration-300 hover:text-[#4C89D9]"
              >
                la sección de catálogo
              </button>{' '}
              para crear tus servicios.
            </p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="group relative overflow-hidden grid gap-5 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20 md:grid-cols-2">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="space-y-2">
            <Label htmlFor="clienteNombre" className="flex items-center gap-1.5">
              Nombre del cliente <span className="text-[#FF8B6B]">*</span>
            </Label>
            <Input
              id="clienteNombre"
              placeholder="Ej. Laura González"
              value={clienteNombre}
              onChange={(event) => {
                setClienteNombre(event.target.value);
                if (fieldErrors.clienteNombre) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.clienteNombre;
                    return next;
                  });
                }
              }}
              className={fieldErrors.clienteNombre ? "border-[#FF8B6B]/50 focus:border-[#FF8B6B] focus:ring-[#FF8B6B]/20" : ""}
            />
            {fieldErrors.clienteNombre ? (
              <div className="flex items-center gap-1.5 text-xs text-[#FF8B6B]">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{fieldErrors.clienteNombre}</span>
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="clienteTelefono" className="flex items-center gap-1.5">
              Teléfono <span className="text-[#FF8B6B]">*</span>
            </Label>
            <Input
              id="clienteTelefono"
              placeholder="Ej. +52 55 1234 5678"
              value={clienteTelefono}
              onChange={(event) => {
                setClienteTelefono(event.target.value);
                if (fieldErrors.clienteTelefono) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.clienteTelefono;
                    return next;
                  });
                }
              }}
              className={fieldErrors.clienteTelefono ? "border-[#FF8B6B]/50 focus:border-[#FF8B6B] focus:ring-[#FF8B6B]/20" : ""}
            />
            {fieldErrors.clienteTelefono ? (
              <div className="flex items-center gap-1.5 text-xs text-[#FF8B6B]">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{fieldErrors.clienteTelefono}</span>
              </div>
            ) : null}
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="notas">Notas adicionales</Label>
            <textarea
              id="notas"
              placeholder="Instrucciones especiales, preferencias, etc."
              className="min-h-[100px] w-full rounded-2xl border border-[#25354B]/50 bg-[#25354B]/30 px-4 py-3 text-sm text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9] focus:outline-none focus:ring-1 focus:ring-[#4C89D9]"
              value={notas}
              onChange={(event) => setNotas(event.target.value)}
            />
          </div>
        </section>

        <section className="group relative overflow-hidden space-y-4 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <header className="relative flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">Servicios</p>
              <h2 className="mt-2 text-lg font-extrabold text-[#F2F5FA]">Selecciona los servicios del pedido</h2>
            </div>
            <Button asChild variant="outline" className="border-2 border-[#25354B] bg-transparent text-xs text-[#BFC7D3] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:text-[#F2F5FA] transition-all duration-300">
              <Link href="/staff/catalogo">Gestionar catálogo</Link>
            </Button>
          </header>

          {serviciosQuery.isLoading ? (
            <p className="text-sm text-[#BFC7D3]">Cargando servicios…</p>
          ) : servicios.length === 0 ? (
            <p className="text-sm text-[#BFC7D3]">
              No tienes servicios activos. Sin catálogo no se pueden crear pedidos nuevos.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {servicios.map((servicio) => {
                const cantidad = cantidades[servicio.id] ?? 0;
                return (
                  <div
                    key={servicio.id}
                    className="group/item relative overflow-hidden flex flex-col gap-3 rounded-2xl border-2 border-[#25354B]/30 bg-gradient-to-br from-[#25354B]/30 to-[#25354B]/20 p-4 transition-all duration-300 hover:border-[#4C89D9]/50 hover:bg-gradient-to-br hover:from-[#25354B]/50 hover:to-[#25354B]/40 hover:shadow-lg hover:shadow-[#4C89D9]/20 hover:-translate-y-0.5"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-extrabold text-[#F2F5FA]">{servicio.nombre}</p>
                      <p className="mt-1 text-xs font-bold bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">
                        {currencyFormatter.format(servicio.precio)}
                        {servicio.unidad ? <span className="text-[#8FA1B7] font-normal"> / {servicio.unidad}</span> : ''}
                      </p>
                      {servicio.descripcion ? (
                        <p className="mt-2 text-xs text-[#BFC7D3] leading-relaxed">{servicio.descripcion}</p>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 w-12 border-2 border-[#25354B] bg-transparent text-[#BFC7D3] hover:border-[#FF8B6B]/50 hover:bg-[#FF8B6B]/10 hover:text-[#FF8B6B] transition-all duration-300"
                        onClick={() => handleCantidad(servicio.id, -1)}
                        disabled={cantidad === 0}
                      >
                        <Minus className="h-6 w-6" />
                      </Button>
                      <span className="w-12 text-center text-lg font-extrabold text-[#F2F5FA] bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 px-2 py-1 rounded-lg">{cantidad}</span>
                      <Button
                        type="button"
                        className="h-12 w-12 bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white hover:shadow-lg hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-300 border-0"
                        onClick={() => handleCantidad(servicio.id, 1)}
                      >
                        <Plus className="h-6 w-6" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="group relative overflow-hidden space-y-4 rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <header className="relative">
            <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">Resumen</p>
            <h2 className="mt-2 text-lg font-extrabold text-[#F2F5FA]">Detalles del pedido</h2>
          </header>

          {itemsSeleccionados.length === 0 ? (
            <p className="relative text-sm text-[#BFC7D3] font-medium">Selecciona servicios para ver el resumen.</p>
          ) : (
            <div className="relative space-y-3 text-sm text-[#BFC7D3]">
              {itemsSeleccionados.map((item) => (
                <div key={item.servicioId} className="flex items-center justify-between rounded-xl border border-[#25354B]/30 bg-[#25354B]/20 px-4 py-2.5 transition-all duration-300 hover:border-[#4C89D9]/50 hover:bg-[#25354B]/40">
                  <span className="font-medium text-[#F2F5FA]">
                    {item.nombre}
                    {item.unidad ? <span className="text-xs text-[#8FA1B7] font-normal"> ({item.unidad})</span> : null} ×{' '}
                    <span className="text-[#4C89D9]">{item.cantidad}</span>
                  </span>
                  <span className="font-bold text-[#F2F5FA]">{currencyFormatter.format(item.subtotal)}</span>
                </div>
              ))}
              <div className="mt-4 flex items-center justify-between rounded-xl border-2 border-[#4C89D9]/30 bg-gradient-to-r from-[#4C89D9]/10 to-[#60C2D8]/10 px-4 py-3 text-base font-extrabold text-[#F2F5FA]">
                <span>Total a cobrar</span>
                <span className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">{currencyFormatter.format(total)}</span>
              </div>
            </div>
          )}
        </section>

        {formError ? (
          <div className="group relative overflow-hidden rounded-2xl border-2 border-[#FF8B6B]/40 bg-gradient-to-br from-[#FF8B6B]/10 via-[#FF8B6B]/5 to-[#FF8B6B]/10 px-4 py-3 text-sm text-[#FF8B6B] backdrop-blur-sm transition-all duration-300 hover:border-[#FF8B6B]/60 hover:shadow-xl hover:shadow-[#FF8B6B]/20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF8B6B]/5 via-transparent to-[#FF8B6B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="relative font-semibold">{formError}</p>
          </div>
        ) : null}

        {formSuccess ? (
          <div className="group relative overflow-hidden rounded-2xl border-2 border-[#6DF2A4]/40 bg-gradient-to-br from-[#6DF2A4]/10 via-[#6DF2A4]/5 to-[#6DF2A4]/10 px-4 py-3 text-sm text-[#6DF2A4] backdrop-blur-sm transition-all duration-300 hover:border-[#6DF2A4]/60 hover:shadow-xl hover:shadow-[#6DF2A4]/20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6DF2A4]/5 via-transparent to-[#6DF2A4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <p className="relative font-semibold">{formSuccess}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            disabled={createPedido.isPending}
            className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-300"
          >
            {createPedido.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Registrar pedido
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-2 border-[#25354B] bg-transparent text-[#BFC7D3] hover:border-[#4C89D9]/50 hover:bg-[#25354B]/50 hover:text-[#F2F5FA] transition-all duration-300"
            onClick={() => router.push('/staff/pedidos')}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  );
}
