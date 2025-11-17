'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, CheckCircle2, Loader2, Lock, Mail, Phone, Shirt, User, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="flex min-h-svh bg-gradient-to-br from-white via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <aside 
        className="hidden w-2/5 flex-col items-center justify-center border-r border-slate-200 dark:border-white/10 lg:flex"
        style={{
          backgroundImage: 'url(/images/login.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-2xl">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50">
              <Link href="/">← Volver</Link>
            </Button>
            <ThemeToggle />
          </div>
          <Card className="border border-slate-200 bg-white/90 shadow-2xl dark:border-white/10 dark:bg-slate-900/80">
            <CardHeader className="space-y-3 text-center">
              <CardTitle className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Crea tu cuenta</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
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
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Mínimo 8 caracteres"
                          className="pr-12"
                          {...form.register('password')}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tu contraseña debe tener al menos 8 caracteres.</p>
                    </div>
                  </FieldGroup>

                  <FieldGroup
                    label="Confirmar contraseña"
                    icon={<Lock className="h-4 w-4 text-slate-500" />}
                    error={form.formState.errors.confirmPassword?.message}
                    htmlFor="confirmPassword"
                  >
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Repite la contraseña"
                        className="pr-12"
                        {...form.register('confirmPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
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

                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-950/60">
                  <div className="flex items-start gap-3">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-900"
                    {...form.register('acceptTerms')}
                  />
                    <Label htmlFor="acceptTerms" className="text-left text-slate-700 dark:text-slate-300">
                      Acepto los términos, condiciones y políticas de privacidad de LaundryPro.
                    </Label>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => window.open('/informacion#terminos', '_blank', 'noopener')}
                      className="text-xs font-semibold text-sky-600 underline transition hover:text-sky-500 dark:text-sky-300 dark:hover:text-sky-200"
                    >
                      Leer más
                    </button>
                  </div>
                </div>
                {form.formState.errors.acceptTerms ? (
                  <p className="text-xs text-rose-300">{form.formState.errors.acceptTerms.message}</p>
                ) : null}

                {serverError ? (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                    {serverError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full bg-sky-500 text-white hover:bg-sky-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shirt className="mr-2 h-4 w-4" />}
                  Crear mi lavandería
                </Button>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
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
      <Label htmlFor={htmlFor} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        {icon}
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}