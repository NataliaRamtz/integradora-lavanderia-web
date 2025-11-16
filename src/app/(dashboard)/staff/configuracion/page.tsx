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
// import { useLavanderia } from '@/features/lavanderias/queries';
// import { useUpdateLavanderiaNombre } from '@/features/lavanderias/mutations';

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

// const lavanderiaSchema = z.object({
//   nombre: z
//     .string({ required_error: 'El nombre es obligatorio.' })
//     .min(3, { message: 'Debe tener al menos 3 caracteres.' })
//     .max(120, { message: 'El nombre es demasiado largo.' }),
// });

// type LavanderiaFormValues = z.infer<typeof lavanderiaSchema>;

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
  const { authUserId, user, perfil /*, activeRole */ } = useSession();
  const updatePerfil = useUpdatePerfil();
  const updatePassword = useUpdatePassword();
  // const lavanderiaId = activeRole?.lavanderia_id ?? '';
  // const lavanderiaQuery = useLavanderia(lavanderiaId);
  // const updateLavanderia = useUpdateLavanderiaNombre(lavanderiaId);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [lavanderiaSuccess, setLavanderiaSuccess] = useState<string | null>(null);
  // const [lavanderiaError, setLavanderiaError] = useState<string | null>(null);
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

  // const lavanderiaForm = useForm<LavanderiaFormValues>({
  //   resolver: zodResolver(lavanderiaSchema),
  //   defaultValues: {
  //     nombre: lavanderiaQuery.data?.nombre ?? '',
  //   },
  // });

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

  // useEffect(() => {
  //   lavanderiaForm.reset({
  //     nombre: lavanderiaQuery.data?.nombre ?? '',
  //   });
  // }, [lavanderiaForm, lavanderiaQuery.data?.nombre]);

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

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-slate-500">Dashboard ▸ Configuración</p>
        <h1 className="text-3xl font-semibold text-slate-50">Configuración del perfil</h1>
        <p className="text-sm text-slate-400">
          Actualiza la información personal y de contacto que usaremos para notificaciones y comunicación.
        </p>
      </header>

      <Card className="border-white/10 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-slate-100">Datos personales</CardTitle>
          <p className="text-sm text-slate-400">
            Mantén tu información actualizada para que el equipo y los clientes puedan contactarte fácilmente.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nombre" error={form.formState.errors.nombre?.message}>
                <Input
                  {...form.register('nombre')}
                  placeholder="Nombre"
                  className="h-11 border-slate-700 bg-slate-950/60 text-slate-100 focus-visible:ring-sky-500"
                  autoComplete="given-name"
                />
              </Field>
              <Field label="Apellido" error={form.formState.errors.apellido?.message}>
                <Input
                  {...form.register('apellido')}
                  placeholder="Apellido"
                  className="h-11 border-slate-700 bg-slate-950/60 text-slate-100 focus-visible:ring-sky-500"
                  autoComplete="family-name"
                />
              </Field>
              <Field label="Teléfono" error={form.formState.errors.telefono?.message}>
                <Input
                  {...form.register('telefono')}
                  placeholder="+52 55 1234 5678"
                  className="h-11 border-slate-700 bg-slate-950/60 text-slate-100 focus-visible:ring-sky-500"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Correo electrónico" error={form.formState.errors.email?.message}>
                <Input
                  {...form.register('email')}
                  type="email"
                  placeholder="correo@laundry.pro"
                  className="h-11 border-slate-700 bg-slate-950/60 text-slate-100 focus-visible:ring-sky-500"
                  autoComplete="email"
                />
              </Field>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {successMessage}
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                className="bg-sky-500 text-white hover:bg-sky-600"
                disabled={updatePerfil.isPending}
              >
                {updatePerfil.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/**
       * Sección temporalmente deshabilitada según solicitud del usuario.
       * <Card className="border-white/10 bg-slate-900/70">
       *   ...
       * </Card>
       */}

      <Card className="border-white/10 bg-slate-900/70">
        <CardHeader>
          <CardTitle className="text-slate-100">Cambiar contraseña</CardTitle>
          <p className="text-sm text-slate-400">
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
                  className="h-11 border-slate-700 bg-slate-950/60 text-slate-100 focus-visible:ring-sky-500"
                  autoComplete="current-password"
                />
              </Field>
              <Field label="Nueva contraseña" error={passwordForm.formState.errors.newPassword?.message}>
                <Input
                  {...passwordForm.register('newPassword')}
                  type="password"
                  placeholder="Nueva contraseña"
                  className="h-11 border-slate-700 bg-slate-950/60 text-slate-100 focus-visible:ring-sky-500"
                  autoComplete="new-password"
                />
              </Field>
              <Field label="Confirmar nueva contraseña" error={passwordForm.formState.errors.confirmPassword?.message}>
                <Input
                  {...passwordForm.register('confirmPassword')}
                  type="password"
                  placeholder="Repite la nueva contraseña"
                  className="h-11 border-slate-700 bg-slate-950/60 text-slate-100 focus-visible:ring-sky-500"
                  autoComplete="new-password"
                />
              </Field>
            </div>

            {passwordError ? (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {passwordError}
              </div>
            ) : null}

            {passwordSuccess ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {passwordSuccess}
              </div>
            ) : null}

            <Button
              type="submit"
              className="bg-sky-500 text-white hover:bg-sky-600"
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
