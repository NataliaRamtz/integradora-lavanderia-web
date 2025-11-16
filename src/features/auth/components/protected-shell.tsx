'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSession } from '../session-context';

type ProtectedShellProps = {
  children: React.ReactNode;
  requiredRoles?: Array<'superadmin' | 'encargado' | 'repartidor' | 'cliente'>;
  fallbackRoute?: string;
};

export const ProtectedShell = ({
  children,
  requiredRoles,
  fallbackRoute = '/login',
}: ProtectedShellProps) => {
  const router = useRouter();
  const { status, isAuthenticated, roles } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(fallbackRoute);
    }
  }, [fallbackRoute, router, status]);

  useEffect(() => {
    if (!requiredRoles || !requiredRoles.length) {
      return;
    }

    if (!roles.length) {
      return;
    }

    const hasRequiredRole = roles.some((role) =>
      requiredRoles.includes(role.rol)
    );

    if (!hasRequiredRole) {
      router.replace('/login');
    }
  }, [requiredRoles, roles, router]);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Cargando sesión...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

