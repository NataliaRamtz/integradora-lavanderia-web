'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import {
  BarChart3,
  Building2,
  Layers3,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users2,
} from 'lucide-react';

import { ProtectedShell } from '@/features/auth/components/protected-shell';
import { useSession } from '@/features/auth/session-context';

const navigation = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Lavanderías', href: '/admin/lavanderias', icon: Building2 },
  { label: 'Usuarios', href: '/admin/usuarios', icon: Users2 },
  { label: 'Gestión de Planes', href: '/admin/planes', icon: Layers3 },
  { label: 'Estadísticas', href: '/admin/estadisticas', icon: BarChart3 },
  { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, perfil, signOut } = useSession();

  const fullName = useMemo(() => {
    const rawPerfil = (perfil?.perfil as Record<string, unknown>) ?? {};
    const nombre = (rawPerfil.nombre as string | undefined)?.trim();
    const apellido = (rawPerfil.apellido as string | undefined)?.trim();
    const result = [nombre, apellido].filter(Boolean).join(' ').trim();
    return result.length > 0 ? result : 'Superadmin LaundryPro';
  }, [perfil?.perfil]);

  const initials = useMemo(() => {
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'LP';
  }, [fullName]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
    router.refresh();
  };

  return (
    <ProtectedShell requiredRoles={['superadmin']} fallbackRoute="/login">
      <div className="flex min-h-svh bg-slate-950 text-slate-100">
        <aside className="hidden w-64 flex-col border-r border-white/10 bg-slate-950/95 px-5 pb-6 pt-8 shadow-[0_0_40px_-30px] shadow-sky-500 lg:flex">
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
              <span className="text-lg font-semibold">LP</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">LaundryPro</p>
              <p className="text-xs text-slate-400">Panel Superadmin</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/30'
                      : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-sky-300' : 'text-slate-500'}`} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">Superadmin</p>
            <p className="mt-1 text-sm font-semibold text-white">{fullName}</p>
            <p className="text-xs text-slate-400">{user?.email ?? 'superadmin@laundrypro.com'}</p>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-rose-400 transition hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-950 text-slate-400 shadow-sm shadow-black/40 lg:hidden">
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Dashboard</p>
                  <h1 className="text-2xl font-semibold text-white">Panel de Superadmin</h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 rounded-full border border-white/10 bg-slate-950/90 px-4 py-2 shadow-sm shadow-black/40 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/20 text-sm font-semibold text-sky-200">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-100">{fullName}</p>
                  <p className="text-xs text-slate-500">Superadmin global</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 bg-slate-950 px-4 py-8 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-7xl space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedShell>
  );
}