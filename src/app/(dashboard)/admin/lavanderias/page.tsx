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
  Search,
  AlertCircle,
  X,
  Mail,
  CreditCard,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LavanderiaWithEncargado } from '@/features/lavanderias/api';
import { useUpdateLavanderia } from '@/features/lavanderias/mutations';
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
  encargado_email: z
    .string()
    .email({ message: 'Correo electrónico inválido.' })
    .optional()
    .or(z.literal('')),
});

type LavanderiaFormValues = z.infer<typeof lavanderiaSchema>;

const parseConfig = (config: LavanderiaWithEncargado['config']) => {
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

const getPlanName = (config: LavanderiaWithEncargado['config']): string => {
  if (!config || typeof config !== 'object') {
    return 'Freemium';
  }
  const cfg = config as Record<string, unknown>;
  const plan = cfg.plan as string | undefined;
  if (plan === 'suscripcion' || plan === 'Suscripción' || plan === 'subscription') {
    return 'Suscripción';
  }
  if (plan === 'comision' || plan === 'Comisión' || plan === 'commission') {
    return 'Comisión';
  }
  return 'Freemium';
};

export default function AdminLavanderiasPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<LavanderiaWithEncargado | null>(null);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const listQuery = useLavanderiasList();
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

  const editForm = useForm<LavanderiaFormValues>({
    resolver: zodResolver(lavanderiaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      horario: '',
      activo: true,
      lat: '',
      lng: '',
      encargado_email: '',
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
        encargado_email: '',
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
      encargado_email: selected.encargado_email ?? '',
    });
  }, [editForm, selected]);

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
        encargado_email: undefined, // No se puede editar el correo desde aquí
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

  const handleToggleActivo = async (lavanderia: LavanderiaWithEncargado) => {
    setToggleLoading(lavanderia.id);
    const parsed = parseConfig(lavanderia.config);
    const nuevoEstado = !parsed.activo;

    try {
      await updateMutation.mutateAsync({
        id: lavanderia.id,
        config: {
          ...(lavanderia.config && typeof lavanderia.config === 'object' ? lavanderia.config : {}),
          activo: nuevoEstado,
        },
      });
    } catch (error) {
      console.error('[Admin] Error al cambiar estado de lavandería', error);
    } finally {
      setToggleLoading(null);
    }
  };

  return (
    <section className="space-y-6 text-[#F2F5FA]">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#F2F5FA] via-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">
          Lavanderías
        </h1>
        <p className="text-sm text-[#BFC7D3]">
          Administra las lavanderías del ecosistema: edita datos operativos, verifica su estatus y visualiza su plan de cuenta.
        </p>
      </header>

      <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 shadow-lg shadow-[#4C89D9]/10 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="relative py-6">
          <div className="flex w-full items-center gap-3 rounded-2xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 px-4 py-3 text-sm text-[#BFC7D3] backdrop-blur-sm transition-all duration-300 focus-within:border-[#4C89D9]/50 focus-within:shadow-lg focus-within:shadow-[#4C89D9]/10 md:max-w-md">
            <Search className="h-4 w-4 text-[#8FA1B7]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o descripción"
              className="flex-1 bg-transparent text-sm text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:outline-none"
            />
          </div>
        </CardContent>
      </Card>

      {selected ? (
        <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 shadow-lg shadow-[#4C89D9]/10 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <CardHeader className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-extrabold text-[#F2F5FA]">Editar lavandería</CardTitle>
                <p className="text-sm text-[#BFC7D3]">Actualiza la información operativa y el estado de la lavandería.</p>
              </div>
              <button
                type="button"
                className="text-xs text-[#8FA1B7] transition hover:text-[#F2F5FA] hover:scale-110"
                onClick={() => {
                  setSelected(null);
                  setUpdateMessage(null);
                  setUpdateError(null);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <form className="space-y-5" onSubmit={handleUpdate}>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Nombre" error={editForm.formState.errors.nombre?.message}>
                  <Input
                    {...editForm.register('nombre')}
                    className="border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9]/50 focus:ring-2 focus:ring-[#4C89D9]/20"
                  />
                </Field>
                <Field label="Horario" error={editForm.formState.errors.horario?.message}>
                  <Input
                    {...editForm.register('horario')}
                    className="border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9]/50 focus:ring-2 focus:ring-[#4C89D9]/20"
                  />
                </Field>
                <Field label="Descripción" error={editForm.formState.errors.descripcion?.message} className="md:col-span-2">
                  <Input
                    {...editForm.register('descripcion')}
                    className="border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9]/50 focus:ring-2 focus:ring-[#4C89D9]/20"
                  />
                </Field>
                <Field label="Correo del encargado (solo lectura)" className="md:col-span-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8FA1B7]" />
                    <Input
                      type="email"
                      value={selected.encargado_email || 'Sin encargado asignado'}
                      readOnly
                      disabled
                      className="border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/40 to-[#25354B]/30 pl-10 text-[#8FA1B7] cursor-not-allowed opacity-70"
                    />
                  </div>
                  <p className="text-xs text-[#8FA1B7] mt-1">El correo del encargado no se puede modificar desde aquí.</p>
                </Field>
                <Field label="Latitud" error={editForm.formState.errors.lat?.message}>
                  <Input
                    {...editForm.register('lat')}
                    className="border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9]/50 focus:ring-2 focus:ring-[#4C89D9]/20"
                  />
                </Field>
                <Field label="Longitud" error={editForm.formState.errors.lng?.message}>
                  <Input
                    {...editForm.register('lng')}
                    className="border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9]/50 focus:ring-2 focus:ring-[#4C89D9]/20"
                  />
                </Field>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-[#BFC7D3]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#25354B] bg-[#1B2A40] text-[#4C89D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C89D9] transition-all duration-200"
                      {...editForm.register('activo')}
                    />
                    Lavandería activa
                  </label>
                </div>
              </div>

              {updateError ? (
                <div className="rounded-xl border-2 border-[#FF8B6B]/50 bg-gradient-to-br from-[#FF8B6B]/10 to-[#FF8B6B]/5 px-4 py-3 text-sm text-[#FF8B6B] backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>{updateError}</p>
                  </div>
                </div>
              ) : null}
              {updateMessage ? (
                <div className="rounded-xl border-2 border-[#6DF2A4]/50 bg-gradient-to-br from-[#6DF2A4]/10 to-[#6DF2A4]/5 px-4 py-3 text-sm text-[#6DF2A4] backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>{updateMessage}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Guardar cambios
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-[#25354B]/50 bg-transparent text-[#BFC7D3] hover:bg-[#25354B]/50 hover:border-[#4C89D9]/50 transition-all duration-200"
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
        <div className="flex items-center justify-between text-sm text-[#BFC7D3]">
          <p>
            Mostrando <span className="font-semibold text-[#F2F5FA]">{filtered.length}</span> de{' '}
            <span className="font-semibold text-[#F2F5FA]">{lavanderias.length}</span> lavanderías
          </p>
          {listQuery.isLoading ? (
            <span className="inline-flex items-center gap-2 text-xs text-[#8FA1B7]">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Cargando datos...
            </span>
          ) : null}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((lavanderia) => {
            const parsed = parseConfig(lavanderia.config);
            const isActive = parsed.activo;
            const planName = getPlanName(lavanderia.config);
            const planColors = {
              'Freemium': 'from-[#8FA1B7]/20 to-[#BFC7D3]/20 border-[#8FA1B7]/30 text-[#8FA1B7]',
              'Suscripción': 'from-[#4C89D9]/20 to-[#60C2D8]/20 border-[#4C89D9]/30 text-[#4C89D9]',
              'Comisión': 'from-[#FFD97B]/20 to-[#FF8B6B]/20 border-[#FFD97B]/30 text-[#FFD97B]',
            };
            return (
              <article
                key={lavanderia.id}
                className="group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 shadow-lg shadow-[#4C89D9]/10 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20 hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-extrabold text-[#F2F5FA]">{lavanderia.nombre}</h3>
                        <button
                          type="button"
                          onClick={() => handleToggleActivo(lavanderia)}
                          disabled={toggleLoading === lavanderia.id}
                          className={`group relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isActive
                              ? 'bg-gradient-to-r from-[#6DF2A4]/20 to-[#60C2D8]/20 border border-[#6DF2A4]/30 text-[#6DF2A4] hover:from-[#6DF2A4]/30 hover:to-[#60C2D8]/30 hover:border-[#6DF2A4]/50 hover:shadow-lg hover:shadow-[#6DF2A4]/20 hover:scale-105'
                              : 'bg-gradient-to-r from-[#FF8B6B]/20 to-[#FF4D4F]/20 border border-[#FF8B6B]/30 text-[#FF8B6B] hover:from-[#FF8B6B]/30 hover:to-[#FF4D4F]/30 hover:border-[#FF8B6B]/50 hover:shadow-lg hover:shadow-[#FF8B6B]/20 hover:scale-105'
                          }`}
                        >
                          <div className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r opacity-0 transition-opacity duration-200 group-hover:opacity-10 ${
                            isActive ? 'from-[#6DF2A4] to-[#60C2D8]' : 'from-[#FF8B6B] to-[#FF4D4F]'
                          }`} />
                          {toggleLoading === lavanderia.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <span className="relative">{isActive ? 'Activa' : 'Inactiva'}</span>
                          )}
                        </button>
                      </div>
                      {lavanderia.descripcion ? (
                        <p className="text-sm text-[#BFC7D3]">{lavanderia.descripcion}</p>
                      ) : null}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#8FA1B7]">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 bg-gradient-to-r ${planColors[planName as keyof typeof planColors] || planColors.Freemium} border font-semibold`}>
                          <CreditCard className="h-3 w-3" />
                          {planName}
                        </span>
                        {lavanderia.encargado_email ? (
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5 text-[#8FA1B7]" /> {lavanderia.encargado_email}
                          </span>
                        ) : null}
                        {parsed.horario ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#8FA1B7]" /> {parsed.horario}
                          </span>
                        ) : null}
                        {lavanderia.lat != null && lavanderia.lng != null ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#8FA1B7]" /> {lavanderia.lat.toFixed(3)},{' '}
                            {lavanderia.lng.toFixed(3)}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#8FA1B7]" />
                          {new Intl.DateTimeFormat('es-MX', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }).format(new Date(lavanderia.created_at))}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 border-[#25354B]/50 bg-transparent text-[#BFC7D3] hover:bg-[#25354B]/50 hover:border-[#4C89D9]/50 hover:text-[#4C89D9] transition-all duration-200"
                        onClick={() => {
                          setSelected(lavanderia);
                          setUpdateMessage(null);
                          setUpdateError(null);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {!listQuery.isLoading && filtered.length === 0 ? (
            <div className="rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-8 text-center text-sm text-[#BFC7D3] backdrop-blur-md">
              <p className="font-medium text-[#F2F5FA]">No encontramos lavanderías con los filtros aplicados.</p>
              <p>Intenta ajustar la búsqueda.</p>
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
      <Label className="text-sm font-medium text-[#BFC7D3]">{label}</Label>
      {children}
      {error ? (
        <div className="flex items-center gap-1.5 text-xs text-[#FF8B6B]">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  );
}
