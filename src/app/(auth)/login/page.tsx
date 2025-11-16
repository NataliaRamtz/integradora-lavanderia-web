'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Mail, Lock, Loader2, Shirt } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { usePasswordLogin, loginSchema, type LoginInput } from '@/features/auth/mutations';
import { useSession } from '@/features/auth/session-context';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, primaryRole, isGlobalAdmin, roles, hasRolesLoaded } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = usePasswordLogin();

  const postLoginRoute = useMemo(() => {
    if (!hasRolesLoaded) {
      return null;
    }

    const hasSuperadminRole = roles.some((role) => role.rol === 'superadmin' && role.activo);

    if (isGlobalAdmin || primaryRole === 'superadmin' || hasSuperadminRole) {
      return '/admin';
    }

    return '/staff';
  }, [hasRolesLoaded, isGlobalAdmin, primaryRole, roles]);

  useEffect(() => {
    if (!isAuthenticated || !hasRolesLoaded || !postLoginRoute) {
      return;
    }

    router.replace(postLoginRoute);
    router.refresh();
  }, [hasRolesLoaded, isAuthenticated, postLoginRoute, router]);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    try {
      await loginMutation.mutateAsync(values);
    } catch (error) {
      console.error('[Auth] Error al iniciar sesión', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No pudimos iniciar sesión. Verifica tus credenciales e intenta nuevamente.';
      setServerError(message);
    }
  });

  return (
    <div className="flex min-h-svh bg-slate-950 text-slate-100">
      <aside className="hidden w-2/5 flex-col justify-center items-center border-r border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-12 py-14 lg:flex">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
            <Shirt className="h-16 w-16" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold text-slate-100 mb-2">LaundryPro</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Ropa limpia, gestión inteligente</p>
          </div>
          <div className="w-full max-w-sm">
            <div className="relative aspect-square bg-gradient-to-br from-sky-500/20 to-blue-500/20 rounded-3xl border border-sky-500/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Shirt className="h-32 w-32 text-sky-400/40" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-sky-500/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <div className="mb-4 flex justify-end">
            <ThemeToggle />
          </div>
          <Card className="border-white/10 bg-slate-900/80 shadow-xl">
            <CardHeader className="space-y-3 text-center">
              <CardTitle className="text-3xl font-semibold text-slate-100">Inicia sesión</CardTitle>
              <p className="text-sm text-slate-400">
                Ingresa tus credenciales para acceder al panel del staff y gestionar tu lavandería.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm text-slate-300" htmlFor="email">
                    <Mail className="h-4 w-4 text-slate-500" /> Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="encargado@laundry.pro"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email ? (
                    <p className="text-xs text-rose-300">{form.formState.errors.email.message}</p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm text-slate-300" htmlFor="password">
                    <Lock className="h-4 w-4 text-slate-500" /> Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...form.register('password')}
                  />
                  {form.formState.errors.password ? (
                    <p className="text-xs text-rose-300">{form.formState.errors.password.message}</p>
                  ) : null}
                </div>

                {serverError ? (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {serverError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full bg-sky-500 text-white hover:bg-sky-600"
                  disabled={isLoading || loginMutation.isPending}
                >
                  {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  Entrar al panel
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-400">
                ¿Aún no tienes cuenta?{' '}
                <Link href="/register" className="font-medium text-sky-300 transition hover:text-sky-200">
                  Crea una aquí
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
