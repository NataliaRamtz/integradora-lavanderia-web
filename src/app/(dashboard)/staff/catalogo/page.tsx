'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  Pencil,
  Plus,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/features/auth/session-context';
import {
  useCreateServicio,
  useServicios,
  useToggleServicioActivo,
  useUpdateServicio,
} from '@/features/servicios/queries';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
});

type FormState = {
  nombre: string;
  descripcion: string;
  unidad: '' | 'pieza' | 'kg' | 'servicio';
  precio: string;
  categoria: string;
  imagenUrl: string;
  orden: string;
  activo: boolean;
};

const emptyForm: FormState = {
  nombre: '',
  descripcion: '',
  unidad: '',
  precio: '',
  categoria: '',
  imagenUrl: '',
  orden: '',
  activo: true,
};

const unidadOptions: Array<{ value: '' | 'pieza' | 'kg' | 'servicio'; label: string }> = [
  { value: '', label: 'Sin unidad' },
  { value: 'pieza', label: 'Por pieza' },
  { value: 'kg', label: 'Por kilogramo' },
  { value: 'servicio', label: 'Por servicio' },
];

export default function CatalogoPage() {
  const router = useRouter();
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';

  const { data: servicios, isLoading, refetch } = useServicios(lavanderiaId);
  const createServicio = useCreateServicio(lavanderiaId);
  const updateServicioMutation = useUpdateServicio(lavanderiaId);
  const toggleServicioMutation = useToggleServicioActivo(lavanderiaId);

  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const sortedServicios = useMemo(() => servicios ?? [], [servicios]);

  const handleEdit = (id: string) => {
    const servicio = servicios?.find((item) => item.id === id);
    if (!servicio) return;

    setEditingId(id);
    setFormError(null);
    setFormSuccess(null);
    setFormState({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion ?? '',
      unidad: servicio.unidad ?? '',
      precio: String(servicio.precio ?? ''),
      categoria: servicio.categoria ?? '',
      imagenUrl: servicio.imagenUrl ?? '',
      orden: servicio.orden ? String(servicio.orden) : '',
      activo: servicio.activo,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormState(emptyForm);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lavanderiaId) {
      setFormError('Debes tener una lavandería activa.');
      return;
    }

    const precio = Number(formState.precio);
    if (Number.isNaN(precio) || precio <= 0) {
      setFormError('Ingresa un precio válido.');
      return;
    }

    setFormError(null);
    setFormSuccess(null);

    const payload = {
      nombre: formState.nombre.trim(),
      descripcion: formState.descripcion.trim() || undefined,
      unidad: formState.unidad || undefined,
      precio,
      categoria: formState.categoria.trim() || undefined,
      imagenUrl: formState.imagenUrl.trim() || undefined,
      orden: formState.orden ? Number(formState.orden) : undefined,
      activo: formState.activo,
    };

    try {
      if (editingId) {
        await updateServicioMutation.mutateAsync({ servicioId: editingId, data: payload });
        setFormSuccess('Servicio actualizado correctamente.');
      } else {
        await createServicio.mutateAsync(payload);
        setFormSuccess('Servicio creado correctamente.');
      }
      await refetch();
      handleCancelEdit();
    } catch (error) {
      console.error(error);
      setFormError(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar el servicio. Intenta nuevamente.'
      );
    }
  };

  const handleToggleActivo = async (servicioId: string, activo: boolean) => {
    try {
      await toggleServicioMutation.mutateAsync({ servicioId, activo });
      await refetch();
    } catch (error) {
      console.error(error);
      setFormError('No pudimos cambiar el estado del servicio.');
    }
  };

  if (!lavanderiaId) {
    return (
      <section className="space-y-4">
        <Button variant="ghost" className="text-slate-300" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Regresar
        </Button>
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/70 px-6 py-12 text-center text-sm text-slate-400">
          Debes seleccionar una lavandería para administrar los servicios.
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-slate-500">Dashboard ▸ Catálogos</p>
        <h1 className="text-3xl font-semibold text-slate-50">Catálogo de servicios</h1>
        <p className="text-sm text-slate-400">
          Administra los servicios disponibles en tu lavandería. Puedes activarlos, editarlos o crear nuevos.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">
            {editingId ? 'Editar servicio' : 'Nuevo servicio'}
          </h2>
          {editingId ? (
            <Button type="button" variant="outline" className="border-slate-700 bg-transparent text-xs text-slate-300" onClick={handleCancelEdit}>
              Cancelar edición
            </Button>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              required
              placeholder="Lavado regular"
              value={formState.nombre}
              onChange={(event) => setFormState((prev) => ({ ...prev, nombre: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="precio">Precio</Label>
            <Input
              id="precio"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="50"
              value={formState.precio}
              onChange={(event) => setFormState((prev) => ({ ...prev, precio: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unidad">Unidad</Label>
            <select
              id="unidad"
              className="h-11 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-sm text-slate-100 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={formState.unidad}
              onChange={(event) => setFormState((prev) => ({ ...prev, unidad: event.target.value as FormState['unidad'] }))}
            >
              {unidadOptions.map((option) => (
                <option key={option.value || 'none'} value={option.value} className="bg-slate-900 text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría (opcional)</Label>
            <Input
              id="categoria"
              placeholder="Lavado, Planchado, Tintorería"
              value={formState.categoria}
              onChange={(event) => setFormState((prev) => ({ ...prev, categoria: event.target.value }))}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <textarea
              id="descripcion"
              placeholder="Instrucciones o características del servicio"
              className="min-h-[80px] w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              value={formState.descripcion}
              onChange={(event) => setFormState((prev) => ({ ...prev, descripcion: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imagenUrl">URL de imagen (opcional)</Label>
            <Input
              id="imagenUrl"
              placeholder="https://..."
              value={formState.imagenUrl}
              onChange={(event) => setFormState((prev) => ({ ...prev, imagenUrl: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="orden">Orden (opcional)</Label>
            <Input
              id="orden"
              type="number"
              placeholder="1"
              value={formState.orden}
              onChange={(event) => setFormState((prev) => ({ ...prev, orden: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Button
              type="button"
              variant="outline"
              className={`border-slate-700 bg-transparent text-xs transition ${formState.activo ? 'text-emerald-400' : 'text-slate-400'}`}
              onClick={() => setFormState((prev) => ({ ...prev, activo: !prev.activo }))}
            >
              {formState.activo ? 'Activo' : 'Inactivo'}
            </Button>
          </div>
        </div>

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

        <div className="flex items-center gap-3">
          <Button type="submit" className="bg-sky-500 text-white hover:bg-sky-600" disabled={createServicio.isPending || updateServicioMutation.isPending}>
            {(createServicio.isPending || updateServicioMutation.isPending) ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {editingId ? 'Guardar cambios' : 'Crear servicio'}
          </Button>
          <Button type="button" variant="outline" className="border-slate-700 bg-transparent text-slate-300" onClick={handleCancelEdit}>
            Limpiar
          </Button>
        </div>
      </form>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">Servicios actuales</h2>
          <p className="text-sm text-slate-400">Total: {servicios?.length ?? 0}</p>
        </header>

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400">
            Cargando servicios…
          </div>
        ) : sortedServicios.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 px-6 py-10 text-center text-sm text-slate-400">
            Aún no tienes servicios registrados.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedServicios.map((servicio) => (
              <article
                key={servicio.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">{servicio.nombre}</h3>
                    <p className="text-sm text-slate-400">
                      {currencyFormatter.format(servicio.precio)}
                      {servicio.unidad ? ` / ${servicio.unidad}` : ''}
                    </p>
                  </div>
                  <BadgeEstado activo={servicio.activo} />
                </div>

                {servicio.descripcion ? (
                  <p className="text-sm text-slate-400">{servicio.descripcion}</p>
                ) : null}
                <div className="grid gap-1 text-xs text-slate-500">
                  {servicio.categoria ? <p>Categoría: {servicio.categoria}</p> : null}
                  {servicio.orden ? <p>Orden: {servicio.orden}</p> : null}
                  {servicio.createdAt ? (
                    <p>
                      Creado: {new Date(servicio.createdAt).toLocaleDateString('es-MX', { dateStyle: 'medium' })}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-transparent text-xs text-slate-300"
                    onClick={() => handleEdit(servicio.id)}
                  >
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
                  </Button>
                  <Button
                    type="button"
                    className={`text-xs ${servicio.activo ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
                    onClick={() => handleToggleActivo(servicio.id, !servicio.activo)}
                    disabled={toggleServicioMutation.isPending}
                  >
                    {toggleServicioMutation.isPending ? (
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                    ) : null}
                    {servicio.activo ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

type BadgeEstadoProps = {
  activo: boolean;
};

function BadgeEstado({ activo }: BadgeEstadoProps) {
  return activo ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
      <CheckCircle2 className="h-3 w-3" /> Activo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300">
      <XCircle className="h-3 w-3" /> Inactivo
    </span>
  );
}
