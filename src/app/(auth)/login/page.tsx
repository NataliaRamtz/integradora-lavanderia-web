'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Mail, Lock, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
      <aside className="hidden w-2/5 flex-col justify-between border-r border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-12 py-14 lg:flex">
        <div className="flex items-center gap-3 text-slate-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-semibold">LaundryPro</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Operaciones sin esfuerzo</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold text-slate-100">
            Lleva tu lavandería al siguiente nivel.
          </h2>
          <p className="text-sm text-slate-400">
            Administra pedidos, monitorea ingresos y brinda una experiencia excepcional a tus clientes desde un solo lugar.
          </p>
          <div className="grid gap-4 text-sm text-slate-300">
            <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              «Con LaundryPro organizamos pedidos walk-in y en línea sin perder el control.»
            </p>
            <p className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              Estadísticas accionables y flujos rápidos para tu equipo de encargado.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500">© {new Date().getFullYear()} LaundryPro. Todos los derechos reservados.</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
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
