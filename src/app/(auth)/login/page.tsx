'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="flex min-h-svh bg-gradient-to-br from-white via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      {/* INICIO */}
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
        <div className="w-full max-w-md">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50">
              <Link href="/">← Volver</Link>
            </Button>
            <ThemeToggle />
          </div>
          <Card className="border border-slate-200 bg-white/90 shadow-xl dark:border-white/10 dark:bg-slate-900/80">
            <CardHeader className="space-y-3 text-center">
              <CardTitle className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Inicia sesión</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ingresa tus credenciales para acceder y gestionar tu lavandería.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300" htmlFor="email">
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
                  <Label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300" htmlFor="password">
                    <Lock className="h-4 w-4 text-slate-500" /> Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
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
                  <p className="text-xs text-slate-500 dark:text-slate-400">La contraseña debe tener al menos 8 caracteres.</p>
                  {form.formState.errors.password ? (
                    <p className="text-xs text-rose-300">{form.formState.errors.password.message}</p>
                  ) : null}
                </div>

                {serverError ? (
                  <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                    {serverError}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full bg-sky-500 text-white hover:bg-sky-600"
                  disabled={isLoading || loginMutation.isPending}
                >
                  {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                  Iniciar Sesion
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
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