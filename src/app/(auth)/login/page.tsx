'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Mail, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
      // Log del error para debugging (solo en consola, no se muestra al usuario)
      if (error instanceof Error) {
        console.error('[Auth] Error al iniciar sesión:', error.message);
      } else if (error && typeof error === 'object' && 'message' in error) {
        console.error('[Auth] Error al iniciar sesión:', error);
      } else {
        console.error('[Auth] Error al iniciar sesión:', error);
      }
      
      // Detectar si es un error de credenciales inválidas
      let message = 'No pudimos iniciar sesión. Verifica tus credenciales e intenta nuevamente.';
      
      if (error && typeof error === 'object') {
        try {
          const errorMessage = ('message' in error ? String(error.message || '') : '').toLowerCase();
          const errorCode = ('code' in error ? String(error.code || '') : '').toLowerCase();
          
          // Verificar si es un error de credenciales inválidas de Supabase
          const isInvalidCredentials = 
            errorMessage.includes('invalid login credentials') ||
            errorMessage.includes('invalid credentials') ||
            errorMessage.includes('invalid_credentials') ||
            errorCode === 'invalid_credentials' ||
            errorCode === 'invalid_grant';
          
          if (isInvalidCredentials) {
            message = 'Las credenciales son inválidas';
          } else if (errorMessage && 'message' in error) {
            // Para otros errores, usar el mensaje original si está disponible
            message = String(error.message);
          }
        } catch (err) {
          // Si hay algún error al procesar el error, usar el mensaje por defecto
          console.error('[Auth] Error al procesar el error de login:', err);
        }
      }
      
      setServerError(message);
    }
  });

  return (
    <div className="flex min-h-svh bg-[#0E1624] text-[#F2F5FA]">
      <aside 
        className="hidden w-2/5 border-r border-[#25354B]/50 lg:flex overflow-hidden"
        style={{
          backgroundImage: 'url(/images/login.jpg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
        }}
      >
      </aside>

      <main className="relative flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B2A40]/20 via-transparent to-[#0E1624]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(76,137,217,0.1),transparent_50%)]" />
        <div className="relative w-full max-w-md">
          <div className="mb-4 flex items-center justify-start gap-3">
            <Button variant="ghost" size="sm" asChild className="text-[#BFC7D3] hover:text-[#F2F5FA] hover:bg-[#25354B]/50 transition-all duration-200">
              <Link href="/" className="flex items-center gap-2">
                <span>←</span>
                <span>Volver</span>
              </Link>
            </Button>
          </div>
          <Card className="group relative overflow-hidden border-2 border-[#25354B]/60 bg-gradient-to-br from-[#1B2A40]/90 via-[#25354B]/50 to-[#1B2A40]/90 backdrop-blur-xl shadow-2xl shadow-[#4C89D9]/10 transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-[#4C89D9]/20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CardHeader className="relative space-y-3 text-center pb-4">
              <CardTitle className="text-3xl font-extrabold text-[#F2F5FA]">Inicia sesión</CardTitle>
              <p className="text-sm text-[#BFC7D3]">
                Ingresa tus credenciales para acceder y gestionar tu lavandería.
              </p>
            </CardHeader>
            <CardContent className="relative">
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-[#BFC7D3]" htmlFor="email">
                    <Mail className="h-4 w-4 text-[#4C89D9]" /> Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ejemplo@correo.com"
                    {...form.register('email')}
                  />
                  {form.formState.errors.email ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#FF8B6B]">
                      <AlertCircle className="h-3.5 w-3.5 text-[#FF8B6B] flex-shrink-0" />
                      <span>{form.formState.errors.email.message}</span>
                    </div>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-[#BFC7D3]" htmlFor="password">
                    <Lock className="h-4 w-4 text-[#4C89D9]" /> Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="off"
                      data-1p-ignore
                      data-lpignore="true"
                      placeholder="Escribe tu contraseña"
                      className="pr-12"
                      {...form.register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8FA1B7] hover:text-[#4C89D9]"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#FF8B6B]">
                      <AlertCircle className="h-3.5 w-3.5 text-[#FF8B6B] flex-shrink-0" />
                      <span>{form.formState.errors.password.message}</span>
                    </div>
                  ) : null}
                </div>

                {serverError ? (
                  <div className="rounded-xl border-2 border-[#FF8B6B]/50 bg-gradient-to-br from-[#FF8B6B]/10 to-[#FF8B6B]/5 px-4 py-3 text-sm text-[#FF8B6B] backdrop-blur-sm">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#FF8B6B]/20">
                        <span className="text-xs">⚠</span>
                      </div>
                      <p className="text-xs">{serverError}</p>
                    </div>
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] text-white shadow-2xl shadow-[#4C89D9]/40 hover:shadow-[#4C89D9]/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={isLoading || loginMutation.isPending}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#60C2D8] to-[#4C89D9] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center justify-center">
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Iniciar sesión
                      </>
                    )}
                  </span>
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-[#BFC7D3]">
                ¿Aún no tienes cuenta?{' '}
                <Link href="/register" className="font-semibold text-[#60C2D8] transition-colors duration-200 hover:text-[#4C89D9] underline decoration-[#60C2D8]/30 hover:decoration-[#4C89D9]/50">
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