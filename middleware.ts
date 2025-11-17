import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/supabase/database.types';

const protectedPrefixes = ['/staff', '/admin'];
const authRoutes = ['/login', '/register'];

const isProtectedRoute = (pathname: string) =>
  protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

const isAuthRoute = (pathname: string) =>
  authRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req: request, res: response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  if (!session && isProtectedRoute(pathname)) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isAuthRoute(pathname)) {
    const redirectUrl = new URL('/staff', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (!session) {
    return response;
  }

  if (pathname.startsWith('/admin')) {
    const { data } = await supabase
      .from('roles_app')
      .select('rol')
      .eq('usuario_id', session.user.id)
      .eq('activo', true)
      .limit(10);

    type RoleRow = Pick<Database['public']['Tables']['roles_app']['Row'], 'rol'>;
    const roles = (data ?? []) as RoleRow[];

    const isSuperAdmin = roles.some((role) => role.rol === 'superadmin');

    if (!isSuperAdmin) {
      const redirectUrl = new URL('/staff', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname.startsWith('/staff')) {
    const { data } = await supabase
      .from('roles_app')
      .select('rol, lavanderia_id')
      .eq('usuario_id', session.user.id)
      .eq('activo', true)
      .limit(10);

    type RoleRow = Pick<Database['public']['Tables']['roles_app']['Row'], 'rol' | 'lavanderia_id'>;
    const roles = (data ?? []) as RoleRow[];

    const hasStaffRole = roles.some(
      (role) =>
        (role.rol === 'encargado' && role.lavanderia_id) ||
        role.rol === 'superadmin'
    );

    if (!hasStaffRole) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', '/');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets).*)'],
};

