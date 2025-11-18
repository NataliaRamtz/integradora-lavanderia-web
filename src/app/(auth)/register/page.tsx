'use client';

import React, { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Loader2, Lock, Mail, Phone, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getBrowserClient } from '@/lib/supabase';
import { registerSchema, type RegisterInput } from './schema';

const LaundryLogo = ({ size = 48 }: { size?: number }) => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="70" fill="#DFF3FF" stroke="#1C4E80" strokeWidth="4"/>
    <line x1="40" y1="70" x2="160" y2="70" stroke="#1C4E80" strokeWidth="4" strokeLinecap="round"/>
    <rect x="88" y="60" width="8" height="18" fill="#FCE5A7" stroke="#1C4E80" strokeWidth="3"/>
    <rect x="104" y="60" width="8" height="18" fill="#FCE5A7" stroke="#1C4E80" strokeWidth="3"/>
    <path d="M80 80 L120 80 L135 95 L135 140 L65 140 L65 95 Z"
          fill="#FFFFFF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
    <path d="M40 115 C30 110 28 95 42 90 C55 95 55 112 40 115 Z"
          fill="#DFF3FF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
    <path d="M160 115 C175 112 175 95 158 90 C145 95 147 110 160 115 Z"
          fill="#DFF3FF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
  </svg>
);

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
  const [activeField, setActiveField] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
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

  const passwordValue = form.watch('password');
  const confirmPasswordValue = form.watch('confirmPassword');
  
  // Validación dinámica de contraseña
  const getPasswordErrors = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Una letra mayúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Un número');
    }
    return errors;
  };

  // Validación dinámica de confirmar contraseña
  const getConfirmPasswordErrors = (confirmPassword: string, password: string): string[] => {
    const errors: string[] = [];
    if (!confirmPassword) {
      errors.push('Se debe confirmar la contraseña');
    } else if (confirmPassword !== password) {
      errors.push('Las contraseñas no coinciden');
    }
    return errors;
  };


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
        // Traducir errores comunes de Supabase al español
        let errorMessage = signUpError?.message ?? 'No pudimos crear tu cuenta. Intenta nuevamente.';
        
        const errorMsg = (signUpError?.message || '').toLowerCase();
        const errorCode = (signUpError?.code || '').toLowerCase();
        
        // Verificar si el error indica que el email ya está registrado
        if (
          errorMsg.includes('user already registered') ||
          errorMsg.includes('email already registered') ||
          errorMsg.includes('already registered') ||
          errorMsg.includes('already exists') ||
          errorCode === 'user_already_registered'
        ) {
          errorMessage = 'Este correo ya está registrado. Por favor, usa otro correo o inicia sesión.';
        } else if (errorMsg.includes('email rate limit') || errorMsg.includes('too many requests')) {
          errorMessage = 'Demasiados intentos. Por favor, espera unos minutos e intenta nuevamente.';
        } else if (errorMsg.includes('invalid email')) {
          errorMessage = 'El correo electrónico no es válido. Por favor, verifica e intenta nuevamente.';
        }
        
        throw new Error(errorMessage);
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

      <main className="relative flex flex-1 items-center justify-center px-4 py-6 sm:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1B2A40]/20 via-transparent to-[#0E1624]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(76,137,217,0.1),transparent_50%)]" />
        <div className="relative w-full max-w-6xl">
          <div className="mb-4 flex items-center justify-start gap-3">
            <Button variant="ghost" size="sm" asChild className="text-[#BFC7D3] hover:text-[#F2F5FA] hover:bg-[#25354B]/50 transition-all duration-200">
              <Link href="/" className="flex items-center gap-2">
                <span>←</span>
                <span>Volver</span>
              </Link>
            </Button>
          </div>
          <div className="max-w-2xl mx-auto">
            <Card className="group relative overflow-hidden border-2 border-[#25354B]/60 bg-gradient-to-br from-[#1B2A40]/90 via-[#25354B]/50 to-[#1B2A40]/90 backdrop-blur-xl shadow-2xl shadow-[#4C89D9]/10 transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-[#4C89D9]/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative space-y-3 text-center pb-4">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center">
                  <LaundryLogo size={64} />
                </div>
                <CardTitle className="text-3xl font-extrabold text-[#F2F5FA]">Crea tu cuenta</CardTitle>
                <p className="text-sm text-[#BFC7D3]">
                  Registra tu lavandería y obtén acceso inmediato al panel de encargados.
                </p>
              </CardHeader>
              <CardContent className="relative">
                <form className="space-y-5" onSubmit={onSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <FieldGroup
                    label="Nombre"
                    icon={<User className="h-4 w-4" />}
                    error={form.formState.errors.firstName?.message}
                    isActive={activeField === 'firstName'}
                    htmlFor="firstName"
                  >
                    <Input
                      id="firstName"
                      autoComplete="given-name"
                      placeholder="Nombre"
                      onFocus={() => setActiveField('firstName')}
                      {...form.register('firstName', {
                        onBlur: () => setActiveField(null),
                      })}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Apellido"
                    icon={<User className="h-4 w-4" />}
                    error={form.formState.errors.lastName?.message}
                    isActive={activeField === 'lastName'}
                    htmlFor="lastName"
                  >
                    <Input
                      id="lastName"
                      autoComplete="family-name"
                      placeholder="Apellido"
                      onFocus={() => setActiveField('lastName')}
                      {...form.register('lastName', {
                        onBlur: () => setActiveField(null),
                      })}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Teléfono"
                    icon={<Phone className="h-4 w-4" />}
                    error={form.formState.errors.phone?.message}
                    isActive={activeField === 'phone'}
                    htmlFor="phone"
                  >
                    <Input
                      id="phone"
                      autoComplete="tel"
                      placeholder="52 55 1234 5678"
                      type="tel"
                      onFocus={() => setActiveField('phone')}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'Enter') {
                          e.preventDefault();
                        }
                      }}
                      {...form.register('phone', {
                        onBlur: () => setActiveField(null),
                      })}
                    />
                  </FieldGroup>

                  <FieldGroup
                    label="Correo"
                    icon={<Mail className="h-4 w-4" />}
                    error={form.formState.errors.email?.message}
                    isActive={activeField === 'email'}
                    htmlFor="email"
                  >
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="ejemplo@correo.com"
                      onFocus={() => setActiveField('email')}
                      {...form.register('email', {
                        onBlur: () => setActiveField(null),
                      })}
                    />
                  </FieldGroup>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FieldGroup
                    label="Contraseña"
                    icon={<Lock className="h-4 w-4" />}
                    error={undefined}
                    isActive={activeField === 'password'}
                    htmlFor="password"
                    dynamicErrors={activeField === 'password' && passwordValue ? getPasswordErrors(passwordValue) : []}
                  >
                    <div className="space-y-1">
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="off"
                          data-1p-ignore
                          data-lpignore="true"
                          placeholder="Escribe tu contraseña"
                          className="pr-12"
                          onFocus={() => setActiveField('password')}
                          {...form.register('password', {
                            onBlur: () => setActiveField(null),
                          })}
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
                      {(!activeField || activeField !== 'password') && (
                        <p className="text-xs text-[#8FA1B7]">Mínimo 8 caracteres, una letra mayúscula y un número.</p>
                      )}
                    </div>
                  </FieldGroup>

                  <FieldGroup
                    label="Confirmar contraseña"
                    icon={<Lock className="h-4 w-4" />}
                    error={undefined}
                    isActive={activeField === 'confirmPassword'}
                    htmlFor="confirmPassword"
                    dynamicErrors={activeField === 'confirmPassword' && confirmPasswordValue !== undefined ? getConfirmPasswordErrors(confirmPasswordValue, passwordValue) : []}
                  >
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="off"
                        data-1p-ignore
                        data-lpignore="true"
                        placeholder="Repite la contraseña"
                        className="pr-12"
                        onFocus={() => setActiveField('confirmPassword')}
                        {...form.register('confirmPassword', {
                          onBlur: () => setActiveField(null),
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8FA1B7] hover:text-[#4C89D9]"
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </FieldGroup>
                </div>

                <FieldGroup
                  label="Nombre de la lavandería"
                  icon={<Building2 className="h-4 w-4" />}
                  error={form.formState.errors.lavanderia?.message}
                  isActive={activeField === 'lavanderia'}
                  htmlFor="lavanderia"
                >
                  <Input
                    id="lavanderia"
                    placeholder="Lavandería Centro"
                    onFocus={() => setActiveField('lavanderia')}
                    {...form.register('lavanderia', {
                      onBlur: () => setActiveField(null),
                    })}
                  />
                </FieldGroup>

                <div className="flex flex-col gap-2 rounded-xl border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 px-4 py-3 text-sm backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50">
                  <div className="flex items-start gap-3">
                  <input
                    id="acceptTerms"
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-[#25354B] bg-[#1B2A40] text-[#4C89D9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C89D9] transition-all duration-200"
                    {...form.register('acceptTerms')}
                  />
                    <Label htmlFor="acceptTerms" className="text-left text-[#BFC7D3] text-xs leading-relaxed">
                      Acepto los términos, condiciones y políticas de privacidad de LaundryPro.
                    </Label>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => window.open('/informacion#terminos', '_blank', 'noopener')}
                      className="text-xs font-semibold text-[#60C2D8] underline transition-colors duration-200 hover:text-[#4C89D9]"
                    >
                      Leer más
                    </button>
                  </div>
                </div>
                {form.formState.errors.acceptTerms ? (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#FF8B6B] animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-3.5 w-3.5 text-[#FF8B6B] flex-shrink-0" />
                    <span>{form.formState.errors.acceptTerms.message}</span>
                  </div>
                ) : null}

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
                  disabled={isSubmitting}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#60C2D8] to-[#4C89D9] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      'Crear mi lavandería'
                    )}
                  </span>
                </Button>

                <p className="text-center text-xs text-[#BFC7D3]">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="font-semibold text-[#60C2D8] transition-colors duration-200 hover:text-[#4C89D9] underline decoration-[#60C2D8]/30 hover:decoration-[#4C89D9]/50">
                    Inicia sesión aquí
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

type FieldGroupProps = {
  label: string;
  htmlFor: string;
  error?: string;
  isActive?: boolean;
  dynamicErrors?: string[];
  icon?: ReactNode;
  children: ReactNode;
};

function FieldGroup({ label, htmlFor, error, isActive, dynamicErrors = [], icon, children }: FieldGroupProps) {
  const showError = isActive && (error || dynamicErrors.length > 0);
  const displayError = error || (dynamicErrors.length > 0 ? dynamicErrors.join(', ') : undefined);
  
  return (
    <div className="space-y-2.5 pb-1">
      <Label htmlFor={htmlFor} className="flex items-center gap-2.5 text-sm font-medium text-[#BFC7D3]">
        <span className="text-[#4C89D9]">{icon}</span>
        {label}
      </Label>
      <div className="relative">
        {children}
        {showError && displayError && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#FF8B6B] animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="h-3.5 w-3.5 text-[#FF8B6B] flex-shrink-0" />
            <span>{displayError}</span>
          </div>
        )}
      </div>
    </div>
  );
}