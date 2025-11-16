'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CheckCircle2,
  Clock,
  Edit,
  Loader2,
  MapPin,
  Plus,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LavanderiaRow } from '@/features/lavanderias/api';
import { useCreateLavanderia, useUpdateLavanderia } from '@/features/lavanderias/mutations';
import { useLavanderiasList } from '@/features/lavanderias/queries';

const lavanderiaSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio.' })
    .min(3, { message: 'Ingresa al menos 3 caracteres.' })
    .max(120, { message: 'Nombre demasiado largo.' }),
  descripcion: z
    .string()
    .max(280, { message: 'Mantén la descripción corta.' })
    .optional()
    .or(z.literal('')),
  horario: z
    .string()
    .max(160, { message: 'El horario es demasiado largo.' })
    .optional()
    .or(z.literal('')),
  activo: z.boolean({ required_error: 'Indica si la lavandería está activa.' }),
  lat: z
    .string()
    .optional()
    .or(z.literal('')),
  lng: z
    .string()
    .optional()
    .or(z.literal('')),
});

type LavanderiaFormValues = z.infer<typeof lavanderiaSchema>;

const parseConfig = (config: LavanderiaRow['config']) => {
  if (!config || typeof config !== 'object') {
    return { activo: true, horario: '' };
  }
  const cfg = config as Record<string, unknown>;
  const activo = cfg.activo === false ? false : true;
  const horario = typeof cfg.horario === 'string' ? cfg.horario : '';
  return { activo, horario };
};

const toNumberOrNull = (value: string | undefined | null) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function AdminLavanderiasPage() {
  const [search, setSearch] = useState('');
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [selected, setSelected] = useState<LavanderiaRow | null>(null);
  const [createMessage, setCreateMessage] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const listQuery = useLavanderiasList();
  const createMutation = useCreateLavanderia();
  const updateMutation = useUpdateLavanderia();
 
  const lavanderias = useMemo(() => listQuery.data ?? [], [listQuery.data]);

  const filtered = useMemo(() => {
    if (!search.trim()) return lavanderias;
    const term = search.toLowerCase();
    return lavanderias.filter((lav) =>
      [lav.nombre, lav.descripcion]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term)),
    );
  }, [lavanderias, search]);

  const createForm = useForm<LavanderiaFormValues>({
    resolver: zodResolver(lavanderiaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      horario: '',
      activo: true,
      lat: '',
      lng: '',
    },
  });

  const editForm = useForm<LavanderiaFormValues>({
    resolver: zodResolver(lavanderiaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      horario: '',
      activo: true,
      lat: '',
      lng: '',
    },
  });

  useEffect(() => {
    if (!selected) {
      editForm.reset({
        nombre: '',
        descripcion: '',
        horario: '',
        activo: true,
        lat: '',
        lng: '',
      });
      return;
    }

    const parsed = parseConfig(selected.config);
    editForm.reset({
      nombre: selected.nombre,
      descripcion: selected.descripcion ?? '',
      horario: parsed.horario,
      activo: parsed.activo,
      lat: selected.lat != null ? String(selected.lat) : '',
      lng: selected.lng != null ? String(selected.lng) : '',
    });
  }, [editForm, selected]);

  const handleCreate = createForm.handleSubmit(async (values) => {
    setCreateMessage(null);
    setCreateError(null);
    try {
      await createMutation.mutateAsync({
        nombre: values.nombre.trim(),
        descripcion: values.descripcion?.trim() || null,
        config: {
          activo: values.activo,
          horario: values.horario?.trim() || null,
        },
        lat: toNumberOrNull(values.lat),
        lng: toNumberOrNull(values.lng),
      });
      setCreateMessage('Lavandería creada correctamente.');
      createForm.reset({ nombre: '', descripcion: '', horario: '', activo: true, lat: '', lng: '' });
      setShowCreatePanel(false);
    } catch (error) {
      console.error('[Admin] Error al crear lavandería', error);
      setCreateError(
        error instanceof Error ? error.message : 'No pudimos crear la lavandería. Intenta nuevamente.',
      );
    }
  });

  const handleUpdate = editForm.handleSubmit(async (values) => {
    if (!selected) return;
    setUpdateMessage(null);
    setUpdateError(null);
    try {
      await updateMutation.mutateAsync({
        id: selected.id,
        nombre: values.nombre.trim(),
        descripcion: values.descripcion?.trim() || null,
        config: {
          ...(selected.config && typeof selected.config === 'object' ? selected.config : {}),
          activo: values.activo,
          horario: values.horario?.trim() || null,
        },
        lat: toNumberOrNull(values.lat),
        lng: toNumberOrNull(values.lng),
      });
      setUpdateMessage('Lavandería actualizada correctamente.');
      setSelected(null);
    } catch (error) {
      console.error('[Admin] Error al actualizar lavandería', error);
      setUpdateError(
        error instanceof Error ? error.message : 'No pudimos actualizar la lavandería. Intenta de nuevo.',
      );
    }
  });

  return (
    <section className="space-y-10 text-slate-100">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Lavanderías</h1>
        <p className="text-sm text-slate-400">
          Administra las lavanderías del ecosistema: edita datos operativos, verifica su estatus y registra nuevas
          ubicaciones.
        </p>
      </header>

      <Card className="border-white/10 bg-slate-900/70">
        <CardContent className="py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 md:max-w-md">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o descripción"
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
            </div>
            <Button
              onClick={() => {
                setShowCreatePanel((prev) => !prev);
                setCreateMessage(null);
                setCreateError(null);
              }}
              className="inline-flex items-center gap-2 bg-sky-500 text-white hover:bg-sky-400"
            >
              <Plus className="h-4 w-4" /> {showCreatePanel ? 'Cerrar formulario' : 'Nueva lavandería'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showCreatePanel ? (
        <Card className="border-white/10 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-lg text-white">Registrar nueva lavandería</CardTitle>
            <p className="text-sm text-slate-400">Completa los datos básicos para agregar una nueva ubicación.</p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleCreate}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre" error={createForm.formState.errors.nombre?.message}>
                  <Input
                    {...createForm.register('nombre')}
                    placeholder="LaundryPro Centro"
                    className="bg-slate-950/60"
                  />
                </Field>
                <Field label="Horario" error={createForm.formState.errors.horario?.message}>
                  <Input
                    {...createForm.register('horario')}
                    placeholder="Lunes a sábado · 8:00 - 20:00"
                    className="bg-slate-950/60"
                  />
                </Field>
                <Field label="Descripción" error={createForm.formState.errors.descripcion?.message} className="md:col-span-2">
                  <Input
                    {...createForm.register('descripcion')}
                    placeholder="Lavandería boutique con servicio exprés"
                    className="bg-slate-950/60"
                  />
                </Field>
                <Field label="Latitud" error={createForm.formState.errors.lat?.message}>
                  <Input
                    {...createForm.register('lat')}
                    placeholder="19.4326"
                    className="bg-slate-950/60"
                  />
                </Field>
                <Field label="Longitud" error={createForm.formState.errors.lng?.message}>
                  <Input
                    {...createForm.register('lng')}
                    placeholder="-99.1332"
                    className="bg-slate-950/60"
                  />
                </Field>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                      {...createForm.register('activo')}
                    />
                    Lavandería activa
                  </label>
                </div>
              </div>

              {createError ? (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {createError}
                </div>
              ) : null}
              {createMessage ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {createMessage}
                </div>
              ) : null}

              <Button
                type="submit"
                className="bg-sky-500 text-white hover:bg-sky-400"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar lavandería
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {selected ? (
        <Card className="border-white/10 bg-slate-900/70">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg text-white">Editar lavandería</CardTitle>
                <p className="text-sm text-slate-400">Actualiza la información operativa y el estado de la lavandería.</p>
              </div>
              <button
                type="button"
                className="text-xs text-slate-500 transition hover:text-slate-300"
                onClick={() => {
                  setSelected(null);
                  setUpdateMessage(null);
                  setUpdateError(null);
                }}
              >
                Cerrar
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleUpdate}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre" error={editForm.formState.errors.nombre?.message}>
                  <Input {...editForm.register('nombre')} className="bg-slate-950/60" />
                </Field>
                <Field label="Horario" error={editForm.formState.errors.horario?.message}>
                  <Input {...editForm.register('horario')} className="bg-slate-950/60" />
                </Field>
                <Field label="Descripción" error={editForm.formState.errors.descripcion?.message} className="md:col-span-2">
                  <Input {...editForm.register('descripcion')} className="bg-slate-950/60" />
                </Field>
                <Field label="Latitud" error={editForm.formState.errors.lat?.message}>
                  <Input {...editForm.register('lat')} className="bg-slate-950/60" />
                </Field>
                <Field label="Longitud" error={editForm.formState.errors.lng?.message}>
                  <Input {...editForm.register('lng')} className="bg-slate-950/60" />
                </Field>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                      {...editForm.register('activo')}
                    />
                    Lavandería activa
                  </label>
                </div>
              </div>

              {updateError ? (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {updateError}
                </div>
              ) : null}
              {updateMessage ? (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {updateMessage}
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-sky-500 text-white hover:bg-sky-400"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Guardar cambios
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/10 bg-transparent text-slate-300 hover:bg-slate-900"
                  onClick={() => setSelected(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <p>
            Mostrando <span className="font-semibold text-slate-100">{filtered.length}</span> de{' '}
            <span className="font-semibold text-slate-100">{lavanderias.length}</span> lavanderías
          </p>
          {listQuery.isLoading ? (
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando datos...
            </span>
          ) : null}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((lavanderia) => {
            const parsed = parseConfig(lavanderia.config);
            const isActive = parsed.activo;
            return (
              <article
                key={lavanderia.id}
                className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">{lavanderia.nombre}</h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-200 border border-rose-500/30'
                        }`}
                      >
                        {isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    {lavanderia.descripcion ? (
                      <p className="text-sm text-slate-400">{lavanderia.descripcion}</p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      {parsed.horario ? (
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-500" /> {parsed.horario}
                        </span>
                      ) : null}
                      {lavanderia.lat != null && lavanderia.lng != null ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-500" /> {lavanderia.lat.toFixed(3)},{' '}
                          {lavanderia.lng.toFixed(3)}
                        </span>
                      ) : null}
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
                        {new Intl.DateTimeFormat('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).format(new Date(lavanderia.created_at))}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/10 bg-slate-950/60 text-slate-200 hover:bg-slate-900"
                    onClick={() => {
                      setSelected(lavanderia);
                      setUpdateMessage(null);
                      setUpdateError(null);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Button>
                </div>
              </article>
            );
          })}

          {!listQuery.isLoading && filtered.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center text-sm text-slate-400">
              <p className="font-medium text-slate-200">No encontramos lavanderías con los filtros aplicados.</p>
              <p>Intenta ajustar la búsqueda o crea una nueva lavandería.</p>
            </div>
          ) : null}
        </div>
      </section>
    </section>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

function Field({ label, error, children, className }: FieldProps) {
  return (
    <div className={`space-y-2 ${className ?? ''}`}>
      <Label className="text-sm text-slate-300">{label}</Label>
      {children}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
