'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CheckCircle2, Loader2, Lock, Mail, Phone, Sparkles, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBrowserClient } from '@/lib/supabase';
import { registerSchema, type RegisterInput } from './schema';

const toSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      lavanderia: '',
      acceptTerms: false,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    setIsSubmitting(true);

    const supabase = getBrowserClient();

    try {
      const { email, password, lavanderia, firstName, lastName, phone } = values;

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName,
            lastName,
            phone,
          },
          emailRedirectTo:
            typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
        },
      });

      if (signUpError || !signUpData?.user) {
        throw new Error(signUpError?.message ?? 'No pudimos crear tu cuenta. Intenta nuevamente.');
      }

      const user = signUpData.user;

      const payload = {
        p_auth_user_id: user.id,
        p_lavanderia_nombre: lavanderia.trim(),
        p_slug_base: toSlug(lavanderia),
        p_first_name: firstName.trim(),
        p_last_name: lastName.trim(),
        p_phone: phone.trim(),
      };

      const supabaseWithRpc = supabase as unknown as {
        rpc: (
          fn: 'register_encargado',
          args: typeof payload
        ) => Promise<{ error: Error | null }>;
      };

      const { error: rpcError } = await supabaseWithRpc.rpc('register_encargado', payload);

      if (rpcError) {
        await supabase.auth.signOut();
        throw new Error(
          rpcError.message ??
            'No pudimos preparar tu espacio de lavandería. Intenta de nuevo o contacta a soporte.'
        );
      }

      router.replace('/staff');
      router.refresh();
    } catch (error) {
      console.error('[Auth] Error al registrar encargado', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Ocurrió un error al crear tu cuenta. Intenta nuevamente.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="flex min-h-svh bg-slate-950 text-slate-100">
      <aside className="hidden w-1/2 flex-col justify-between border-r border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-12 py-14 xl:flex">
        <div className="flex items-center gap-3 text-slate-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-semibold">LaundryPro</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Staff Platform</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-slate-100">
            Crea el espacio digital de tu lavandería.
          </h2>
          <p className="text-sm text-slate-400">
            Controla pedidos, clientes walk-in y catálogos de servicio desde un panel diseñado para encargados.
          </p>

          <div className="grid gap-4 text-sm text-slate-300">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
              <div>
                <p className="font-medium text-slate-200">Onboarding guiado</p>
                <p className="text-slate-400">Conecta tu catálogo y pedidos en minutos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
              <div>
                <p className="font-medium text-slate-200">Enfoque omnicanal</p>
                <p className="text-slate-400">Gestiona pedidos móviles y walk-in desde el mismo dashboard.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500">¿Ya tienes cuenta? <Link href="/login" className="text-sky-300">Inicia sesión</Link></p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-2xl">
          <Card className="border-white/10 bg-slate-900/80 shadow-2xl">
            <CardHeader className="space-y-3 text-center">
              <CardTitle className="text-3xl font-semibold text-slate-100">Crea tu cuenta</CardTitle>
              <p className="text-sm text-slate-400">
                Registra tu lavandería y obtén acceso inmediato al panel de encargados.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <FieldGroup
                    label="Nombre"
                    icon={<User className="h-4 w-4 text-slate-500" />}
                    error={form.formState.errors.firstName?.message}
                    htmlFor="firstName"
                  >
                    <Input
                      id="firstName"
                      autoComplete="given-name"
                      placeholder="Nombre"
                      {...form.register('firstName')}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Apellido"
                    icon={<User className="h-4 w-4 text-slate-500" />}
                    error={form.formState.errors.lastName?.message}
                    htmlFor="lastName"
                  >
                    <Input
                      id="lastName"
                      autoComplete="family-name"
                      placeholder="Apellido"
                      {...form.register('lastName')}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Teléfono"
                    icon={<Phone className="h-4 w-4 text-slate-500" />}
                    error={form.formState.errors.phone?.message}
                    htmlFor="phone"
                  >
                    <Input
                      id="phone"
                      autoComplete="tel"
                      placeholder="+52 55 1234 5678"
                      {...form.register('phone')}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Correo"
                    icon={<Mail className="h-4 w-4 text-slate-500" />}
                    error={form.formState.errors.email?.message}
                    htmlFor="email"
                  >
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="encargado@laundry.pro"
                      {...form.register('email')}
                    />
                  </FieldGroup>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FieldGroup
                    label="Contraseña"
                    icon={<Lock className="h-4 w-4 text-slate-500" />}
                    error={form.formState.errors.password?.message}
                    htmlFor="password"
                  >
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Crea una contraseña"
                      {...form.register('password')}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Confirmar contraseña"
                    icon={<Lock className="h-4 w-4 text-slate-500" />}
                    error={form.formState.errors.confirmPassword?.message}
                    htmlFor="confirmPassword"
                  >
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repite la contraseña"
                      {...form.register('confirmPassword')}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup
                  label="Nombre de la lavandería"
                  icon={<Building2 className="h-4 w-4 text-slate-500" />}
                  error={form.formState.errors.lavanderia?.message}
                  htmlFor="lavanderia"
                >
                  <Input
                    id="lavanderia"
                    placeholder="Lavandería Centro"
                    {...form.register('lavanderia')}
                  />
                </FieldGroup>

                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    {...form.register('acceptTerms')}
                  />
                  <Label htmlFor="acceptTerms" className="text-left text-slate-300">
                    Acepto los términos, condiciones y políticas de privacidad de LaundryPro.
                  </Label>
                </div>
                {form.formState.errors.acceptTerms ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.acceptTerms.message}</p>
                ) : null}

                {serverError ? (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {serverError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full bg-sky-500 text-white hover:bg-sky-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  Crear mi lavandería
                </Button>

                <p className="text-center text-sm text-slate-400">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="font-medium text-sky-300 transition hover:text-sky-200">
                    Inicia sesión aquí
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

type FieldGroupProps = {
  label: string;
  htmlFor: string;
  error?: string;
  icon?: ReactNode;
  children: ReactNode;
};

function FieldGroup({ label, htmlFor, error, icon, children }: FieldGroupProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="flex items-center gap-2 text-sm text-slate-300">
        {icon}
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
