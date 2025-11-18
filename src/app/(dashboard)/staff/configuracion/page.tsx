'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/features/auth/session-context';
import { useUpdatePerfil, useUpdatePassword } from '@/features/auth/mutations';
import { useLavanderia } from '@/features/lavanderias/queries';
import { useUpdateLavanderia } from '@/features/lavanderias/mutations';

const profileSchema = z.object({
  nombre: z
    .string({ required_error: 'El nombre es obligatorio.' })
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(80, { message: 'El nombre es demasiado largo.' }),
  apellido: z
    .string()
    .max(80, { message: 'El apellido es demasiado largo.' })
    .optional()
    .or(z.literal('')),
  telefono: z
    .string()
    .max(30, { message: 'El teléfono es demasiado largo.' })
    .optional()
    .or(z.literal('')),
  email: z.string({ required_error: 'El correo es obligatorio.' }).email({ message: 'Ingresa un correo válido.' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const lavanderiaSchema = z.object({
  descripcion: z
    .string()
    .max(280, { message: 'Mantén la descripción en máximo 280 caracteres.' })
    .optional()
    .or(z.literal('')),
  horario: z
    .string()
    .max(160, { message: 'El horario es demasiado largo.' })
    .optional()
    .or(z.literal('')),
  telefono: z
    .string()
    .max(40, { message: 'El teléfono es demasiado largo.' })
    .optional()
    .or(z.literal('')),
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

const passwordSchema = z
  .object({
    currentPassword: z
      .string({ required_error: 'La contraseña actual es obligatoria.' })
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    newPassword: z
      .string({ required_error: 'La nueva contraseña es obligatoria.' })
      .min(8, { message: 'Debe tener al menos 8 caracteres.' }),
    confirmPassword: z
      .string({ required_error: 'Confirma la nueva contraseña.' })
      .min(8, { message: 'Debe tener al menos 8 caracteres.' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'La nueva contraseña debe ser diferente a la actual.',
    path: ['newPassword'],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ConfiguracionPage() {
  const { authUserId, user, perfil, activeRole } = useSession();
  const updatePerfil = useUpdatePerfil();
  const updatePassword = useUpdatePassword();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';
  const lavanderiaQuery = useLavanderia(lavanderiaId);
  const updateLavanderia = useUpdateLavanderia();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lavanderiaSuccess, setLavanderiaSuccess] = useState<string | null>(null);
  const [lavanderiaError, setLavanderiaError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const perfilData = useMemo(() => {
    const rawPerfil = (perfil?.perfil ?? {}) as Record<string, unknown>;
    return {
      nombre: (rawPerfil.nombre as string) ?? '',
      apellido: (rawPerfil.apellido as string) ?? '',
      telefono: (rawPerfil.telefono as string) ?? '',
      raw: rawPerfil,
    };
  }, [perfil?.perfil]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: perfilData.nombre,
      apellido: perfilData.apellido,
      telefono: perfilData.telefono,
      email: user?.email ?? '',
    },
  });

  const lavanderiaForm = useForm<LavanderiaFormValues>({
    resolver: zodResolver(lavanderiaSchema),
    defaultValues: {
      descripcion: '',
      horario: '',
      telefono: '',
      lat: '',
      lng: '',
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    form.reset({
      nombre: perfilData.nombre,
      apellido: perfilData.apellido,
      telefono: perfilData.telefono,
      email: user?.email ?? '',
    });
  }, [form, perfilData.apellido, perfilData.nombre, perfilData.telefono, user?.email]);

  useEffect(() => {
    if (!lavanderiaQuery.data) return;
    const config = (lavanderiaQuery.data.config ?? {}) as Record<string, unknown>;
    lavanderiaForm.reset({
      descripcion: lavanderiaQuery.data.descripcion ?? '',
      horario: typeof config?.horario === 'string' ? config.horario : '',
      telefono: typeof config?.telefono === 'string' ? config.telefono : '',
      lat: typeof lavanderiaQuery.data.lat === 'number' ? String(lavanderiaQuery.data.lat) : '',
      lng: typeof lavanderiaQuery.data.lng === 'number' ? String(lavanderiaQuery.data.lng) : '',
    });
  }, [lavanderiaForm, lavanderiaQuery.data]);

  const parseCoordinate = (value: string) => {
    if (!value.trim()) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!authUserId) {
      setErrorMessage('No encontramos la sesión activa. Intenta volver a iniciar sesión.');
      return;
    }

    try {
      const perfilPayload = {
        ...perfilData.raw,
        nombre: values.nombre.trim(),
        apellido: values.apellido?.trim() ?? '',
        telefono: values.telefono?.trim() ?? '',
      };

      await updatePerfil.mutateAsync({
        authUserId,
        email: values.email.trim(),
        currentEmail: user?.email ?? '',
        perfil: perfilPayload,
        preferencias: (perfil?.preferencias as Record<string, unknown>) ?? {},
      });

      setSuccessMessage('Perfil actualizado correctamente. Si cambiaste el correo, revisa tu bandeja para confirmar el cambio.');
    } catch (error) {
      console.error('[Perfil] Error al actualizar', error);
      const message =
        error instanceof Error
          ? error.message
          : 'No pudimos actualizar tu perfil. Intenta nuevamente.';
      setErrorMessage(message);
    }
  });

  const handleLavanderiaSubmit = lavanderiaForm.handleSubmit(async (values) => {
    if (!lavanderiaId) {
      setLavanderiaError('No encontramos la lavandería activa.');
      return;
    }

    setLavanderiaSuccess(null);
    setLavanderiaError(null);

    try {
      await updateLavanderia.mutateAsync({
        id: lavanderiaId,
        descripcion: values.descripcion?.trim() || null,
        config: {
          ...(lavanderiaQuery.data?.config && typeof lavanderiaQuery.data.config === 'object'
            ? lavanderiaQuery.data.config
            : {}),
          horario: values.horario?.trim() || null,
          telefono: values.telefono?.trim() || null,
        },
        lat: parseCoordinate(values.lat),
        lng: parseCoordinate(values.lng),
      });
      setLavanderiaSuccess('La información de tu lavandería se actualizó correctamente.');
      await lavanderiaQuery.refetch();
    } catch (error) {
      console.error('[Lavandería] Error al actualizar', error);
      const message =
        error instanceof Error
          ? error.message
          : 'No pudimos actualizar la lavandería. Intenta nuevamente.';
      setLavanderiaError(message);
    }
  });

  return (
    <section className="space-y-6">
      <header className="space-y-2 mb-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#F2F5FA] via-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">Configuración del perfil</h1>
        <p className="text-sm text-[#BFC7D3] font-medium">
          Actualiza la información personal y de contacto que usaremos para notificaciones y comunicación.
        </p>
      </header>

      <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative">
          <CardTitle className="text-[#F2F5FA] font-extrabold">Datos personales</CardTitle>
          <p className="text-sm text-[#BFC7D3] font-medium">
            Mantén tu información actualizada para que el equipo y los clientes puedan contactarte fácilmente.
          </p>
        </CardHeader>
        <CardContent className="relative">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nombre" error={form.formState.errors.nombre?.message}>
                <Input
                  {...form.register('nombre')}
                  placeholder="Nombre"
                  className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Apellido" error={form.formState.errors.apellido?.message}>
                <Input
                  {...form.register('apellido')}
                  placeholder="Apellido"
                  className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  autoComplete="family-name"
                />
              </Field>
              <Field label="Teléfono" error={form.formState.errors.telefono?.message}>
                <Input
                  {...form.register('telefono')}
                  placeholder="+52 55 1234 5678"
                  className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Correo electrónico" error={form.formState.errors.email?.message}>
                <Input
                  {...form.register('email')}
                  type="email"
                  placeholder="correo@laundry.pro"
                  className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  autoComplete="email"
                />
              </Field>
            </div>

            {errorMessage ? (
              <div className="group relative overflow-hidden rounded-2xl border-2 border-[#FF8B6B]/40 bg-gradient-to-br from-[#FF8B6B]/10 via-[#FF8B6B]/5 to-[#FF8B6B]/10 px-4 py-3 text-sm text-[#FF8B6B] backdrop-blur-sm transition-all duration-300 hover:border-[#FF8B6B]/60 hover:shadow-xl hover:shadow-[#FF8B6B]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8B6B]/5 via-transparent to-[#FF8B6B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="relative font-semibold">{errorMessage}</p>
              </div>
            ) : null}

            {successMessage ? (
              <div className="group relative overflow-hidden rounded-2xl border-2 border-[#6DF2A4]/40 bg-gradient-to-br from-[#6DF2A4]/10 via-[#6DF2A4]/5 to-[#6DF2A4]/10 px-4 py-3 text-sm text-[#6DF2A4] backdrop-blur-sm transition-all duration-300 hover:border-[#6DF2A4]/60 hover:shadow-xl hover:shadow-[#6DF2A4]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6DF2A4]/5 via-transparent to-[#6DF2A4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="relative font-semibold">{successMessage}</p>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-300"
                disabled={updatePerfil.isPending}
              >
                {updatePerfil.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative space-y-2">
          <CardTitle className="text-[#F2F5FA] font-extrabold">Datos de la lavandería</CardTitle>
          <p className="text-sm text-[#BFC7D3] font-medium">
            Mantén actualizada la información que verán tus clientes y tu equipo operativo.
          </p>
        </CardHeader>
        <CardContent className="relative">
          {!lavanderiaId ? (
            <div className="rounded-2xl border border-dashed border-[#25354B]/60 bg-[#1B2A40]/50 px-6 py-8 text-center text-sm text-[#BFC7D3]">
              No encontramos una lavandería activa asociada a tu usuario.
            </div>
          ) : lavanderiaQuery.isLoading ? (
            <div className="flex items-center justify-center rounded-2xl border border-[#25354B]/50 bg-[#1B2A40]/50 px-6 py-10 text-sm text-[#BFC7D3]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#4C89D9]" />
              Cargando información de la lavandería…
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleLavanderiaSubmit}>
              <div className="grid gap-5 lg:grid-cols-2">
                <Field label="Descripción" error={lavanderiaForm.formState.errors.descripcion?.message}>
                  <textarea
                    {...lavanderiaForm.register('descripcion')}
                    placeholder="Describe tu servicio, filosofía o beneficios."
                    className="min-h-[120px] w-full rounded-2xl border-2 border-[#25354B]/50 bg-[#1B2A40]/60 px-4 py-3 text-sm text-[#F2F5FA] placeholder:text-[#8FA1B7] focus:border-[#4C89D9] focus:outline-none focus:ring-2 focus:ring-[#4C89D9]/20 transition-all duration-300"
                  />
                </Field>
                <div className="space-y-5">
                  <Field label="Horario" error={lavanderiaForm.formState.errors.horario?.message}>
                    <Input
                      {...lavanderiaForm.register('horario')}
                      placeholder="Lunes a sábado, 9:00 - 20:00"
                      className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                    />
                  </Field>
                  <Field label="Teléfono de contacto" error={lavanderiaForm.formState.errors.telefono?.message}>
                    <Input
                      {...lavanderiaForm.register('telefono')}
                      placeholder="+52 55 1234 5678"
                      className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                    />
                  </Field>
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Latitud" error={lavanderiaForm.formState.errors.lat?.message}>
                  <Input
                    {...lavanderiaForm.register('lat')}
                    placeholder="Ej. 19.4326"
                    className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  />
                </Field>
                <Field label="Longitud" error={lavanderiaForm.formState.errors.lng?.message}>
                  <Input
                    {...lavanderiaForm.register('lng')}
                    placeholder="Ej. -99.1332"
                    className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  />
                </Field>
              </div>

              {lavanderiaError ? (
                <div className="group relative overflow-hidden rounded-2xl border-2 border-[#FF8B6B]/40 bg-gradient-to-br from-[#FF8B6B]/10 via-[#FF8B6B]/5 to-[#FF8B6B]/10 px-4 py-3 text-sm text-[#FF8B6B] backdrop-blur-sm transition-all duration-300 hover:border-[#FF8B6B]/60 hover:shadow-xl hover:shadow-[#FF8B6B]/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF8B6B]/5 via-transparent to-[#FF8B6B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <p className="relative font-semibold">{lavanderiaError}</p>
                </div>
              ) : null}

              {lavanderiaSuccess ? (
                <div className="group relative overflow-hidden rounded-2xl border-2 border-[#6DF2A4]/40 bg-gradient-to-br from-[#6DF2A4]/10 via-[#6DF2A4]/5 to-[#6DF2A4]/10 px-4 py-3 text-sm text-[#6DF2A4] backdrop-blur-sm transition-all duration-300 hover:border-[#6DF2A4]/60 hover:shadow-xl hover:shadow-[#6DF2A4]/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#6DF2A4]/5 via-transparent to-[#6DF2A4]/5 opacity-0 transition-opacity duración-300 group-hover:opacity-100" />
                  <p className="relative font-semibold">{lavanderiaSuccess}</p>
                </div>
              ) : null}

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-300"
                  disabled={updateLavanderia.isPending}
                >
                  {updateLavanderia.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Guardar datos de la lavandería
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/**
       * Sección temporalmente deshabilitada según solicitud del usuario.
       * <Card className="border-white/10 bg-slate-900/70">
       *   ...
       * </Card>
       */}

      <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardHeader className="relative">
          <CardTitle className="text-[#F2F5FA] font-extrabold">Cambiar contraseña</CardTitle>
          <p className="text-sm text-[#BFC7D3] font-medium">
            Usa una contraseña robusta para proteger tu cuenta. Si cambias el correo, deberás confirmarlo por email.
          </p>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={passwordForm.handleSubmit(async (values) => {
              setPasswordError(null);
              setPasswordSuccess(null);

              try {
                await updatePassword.mutateAsync({
                  email: user?.email ?? '',
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                });
                setPasswordSuccess('Contraseña actualizada. En algunos casos te pediremos iniciar sesión de nuevo.');
                passwordForm.reset();
              } catch (error) {
                console.error('[Perfil] Error al actualizar contraseña', error);
                const message =
                  error instanceof Error
                    ? error.message
                    : 'No pudimos actualizar tu contraseña. Intenta nuevamente.';
                setPasswordError(message);
              }
            })}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Contraseña actual" error={passwordForm.formState.errors.currentPassword?.message}>
                <Input
                  {...passwordForm.register('currentPassword')}
                  type="password"
                  placeholder="Contraseña actual"
                  className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  autoComplete="current-password"
                />
              </Field>
              <Field label="Nueva contraseña" error={passwordForm.formState.errors.newPassword?.message}>
                <Input
                  {...passwordForm.register('newPassword')}
                  type="password"
                  placeholder="Nueva contraseña"
                  className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirmar nueva contraseña" error={passwordForm.formState.errors.confirmPassword?.message}>
                <Input
                  {...passwordForm.register('confirmPassword')}
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  className="relative h-11 border-2 border-[#25354B]/50 bg-[#1B2A40]/60 text-[#F2F5FA] focus-visible:border-[#4C89D9] focus-visible:ring-2 focus-visible:ring-[#4C89D9]/20 transition-all duration-300"
                  autoComplete="new-password"
                />
              </Field>
            </div>

            {passwordError ? (
              <div className="group relative overflow-hidden rounded-2xl border-2 border-[#FF8B6B]/40 bg-gradient-to-br from-[#FF8B6B]/10 via-[#FF8B6B]/5 to-[#FF8B6B]/10 px-4 py-3 text-sm text-[#FF8B6B] backdrop-blur-sm transition-all duration-300 hover:border-[#FF8B6B]/60 hover:shadow-xl hover:shadow-[#FF8B6B]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8B6B]/5 via-transparent to-[#FF8B6B]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="relative font-semibold">{passwordError}</p>
              </div>
            ) : null}

            {passwordSuccess ? (
              <div className="group relative overflow-hidden rounded-2xl border-2 border-[#6DF2A4]/40 bg-gradient-to-br from-[#6DF2A4]/10 via-[#6DF2A4]/5 to-[#6DF2A4]/10 px-4 py-3 text-sm text-[#6DF2A4] backdrop-blur-sm transition-all duration-300 hover:border-[#6DF2A4]/60 hover:shadow-xl hover:shadow-[#6DF2A4]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#6DF2A4]/5 via-transparent to-[#6DF2A4]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="relative font-semibold">{passwordSuccess}</p>
              </div>
            ) : null}

            <Button
              type="submit"
              className="bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-lg shadow-[#4C89D9]/30 hover:shadow-xl hover:shadow-[#4C89D9]/40 hover:scale-105 transition-all duration-300"
              disabled={updatePassword.isPending}
            >
              {updatePassword.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Actualizar contraseña
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm text-slate-200">{label}</Label>
      </div>
      {children}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
