'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Activity,
  ChevronRight,
  Edit,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminUsers } from '@/features/admin/users/queries';
import { useUpdateAdminUser } from '@/features/admin/users/mutations';
import type { AdminUser } from '@/features/admin/users/api';

const roleLabels: Record<string, string> = {
  superadmin: 'Administrador',
  encargado: 'Encargado de lavandería',
  repartidor: 'Repartidor',
  cliente: 'Cliente',
};

const roleOrder = ['superadmin', 'encargado', 'cliente', 'repartidor'] as const;

const statusLabels: Record<'active' | 'inactive', string> = {
  active: 'Activo',
  inactive: 'Inactivo',
};

const userDetailSchema = z.object({
  nombre: z.string().min(1, 'Ingresa un nombre.'),
  apellido: z.string().optional().or(z.literal('')),
  email: z.string().email('Correo inválido'),
  telefono: z.string().optional().or(z.literal('')),
  rol: z.enum(['superadmin', 'encargado', 'repartidor', 'cliente']),
  activo: z.boolean(),
});

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const getFullName = (perfil: Record<string, unknown>) => {
  const nombre = (perfil.nombre as string | undefined)?.trim() ?? '';
  const apellido = (perfil.apellido as string | undefined)?.trim() ?? '';
  const result = `${nombre} ${apellido}`.trim();
  return result.length > 0 ? result : 'Usuario LaundryPro';
};

const getPhone = (perfil: Record<string, unknown>) => (perfil.telefono as string | undefined) ?? '—';

export default function AdminUsuariosPage() {
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const updateUserMutation = useUpdateAdminUser();

  const usersQuery = useAdminUsers();
  const allUsers = useMemo(() => usersQuery.data ?? [], [usersQuery.data]);

  const selectedUser = useMemo(
    () => allUsers.find((user) => user.id === selectedUserId) ?? null,
    [allUsers, selectedUserId],
  );

  const filteredUsers = useMemo(() => {
    if (!search.trim()) {
      return allUsers;
    }
    const term = search.toLowerCase().trim();
    return allUsers.filter((user) => {
      const perfil = user.perfil ?? {};
      
      // Búsqueda por nombre completo
      const fullName = getFullName(perfil).toLowerCase();
      const nombre = ((perfil.nombre as string | undefined) ?? '').toLowerCase();
      const apellido = ((perfil.apellido as string | undefined) ?? '').toLowerCase();
      
      // Búsqueda por email (desde el campo email del usuario)
      const email = (user.email ?? '').toLowerCase();
      
      // Búsqueda por rol (tanto el label traducido como el valor original)
      const roleLabel = (roleLabels[user.rol] ?? user.rol).toLowerCase();
      const roleValue = user.rol.toLowerCase();
      
      // Buscar en todos los campos
      return (
        fullName.includes(term) ||
        nombre.includes(term) ||
        apellido.includes(term) ||
        email.includes(term) ||
        roleLabel.includes(term) ||
        roleValue.includes(term)
      );
    });
  }, [allUsers, search]);

  const metrics = useMemo(() => calculateMetrics(allUsers), [allUsers]);

  const detailForm = useForm<z.infer<typeof userDetailSchema>>({
    resolver: zodResolver(userDetailSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      rol: 'cliente',
      activo: true,
    },
  });

  const handleOpenDetail = (userId: string) => {
    setSelectedUserId(userId);
    const user = allUsers.find((item) => item.id === userId);
    if (!user) return;
    const perfil = user.perfil ?? {};

    detailForm.reset({
      nombre: (perfil.nombre as string | undefined) ?? '',
      apellido: (perfil.apellido as string | undefined) ?? '',
      email: (perfil.email as string | undefined) ?? '',
      telefono: (perfil.telefono as string | undefined) ?? '',
      rol: user.rol,
      activo: Boolean(user.activo),
    });
  };

  const handleCloseDetail = () => {
    setSelectedUserId(null);
    detailForm.reset();
  };

  const onSubmitDetail = detailForm.handleSubmit(async (values) => {
    if (!selectedUser) return;
    await updateUserMutation.mutateAsync({
      usuarioAppId: selectedUser.id,
      nombre: values.nombre.trim(),
      apellido: values.apellido?.trim() ?? '',
      email: values.email.trim(),
      telefono: values.telefono?.trim() ?? '',
      rol: values.rol,
      activo: values.activo,
    });
    handleCloseDetail();
  });

  const handleToggleActive = async (user: AdminUser) => {
    const perfil = user.perfil ?? {};
    await updateUserMutation.mutateAsync({
      usuarioAppId: user.id,
      nombre: ((perfil.nombre as string | undefined) ?? '').trim(),
      apellido: ((perfil.apellido as string | undefined) ?? '').trim(),
      email: ((perfil.email as string | undefined) ?? '').trim(),
      telefono: ((perfil.telefono as string | undefined) ?? '').trim(),
      rol: user.rol,
      activo: !user.activo,
    });
  };

  return (
    <section className="space-y-10 text-slate-100">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Usuarios del ecosistema</h1>
        <p className="text-sm text-slate-400">
          Supervisa el estado de las cuentas y gestiona accesos clave para cada lavandería de LaundryPro.
        </p>
      </header>

      <SummaryGrid metrics={metrics} loading={usersQuery.isLoading} />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <RoleDistribution metrics={metrics} loading={usersQuery.isLoading} />
        <AccountStatus metrics={metrics} />
      </div>

      <Card className="border-white/10 bg-slate-900/70">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-xl text-white">Gestión de usuarios</CardTitle>
            <p className="text-sm text-slate-400">
              Busca usuarios por nombre completo, correo electrónico o rol (Administrador, Supervisor, Operador, Cliente).
            </p>
          </div>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-400">
            <Users className="h-4 w-4" /> Añadir usuario
          </Link>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            <SearchIcon className="h-4 w-4 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, correo o rol..."
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs text-slate-500 transition hover:text-slate-300"
              >
                Limpiar
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {usersQuery.isLoading ? (
              <SkeletonCard />
            ) : null}

            {filteredUsers.map((user) => {
              const perfil = user.perfil ?? {};
              const fullName = getFullName(perfil);
              const email = user.email ?? '—';
              const phone = getPhone(perfil);
              const roleLabel = roleLabels[user.rol] ?? user.rol;
              const status = user.activo ? 'Activo' : 'Inactivo';

              return (
                <article
                  key={user.id}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <AvatarCircle name={fullName} />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{fullName}</h3>
                        <p className="text-xs uppercase tracking-widest text-slate-500">{roleLabel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(user)}
                        disabled={updateUserMutation.isPending}
                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-200 ${
                          user.activo
                            ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30 hover:bg-emerald-500/25 cursor-pointer'
                            : 'bg-rose-500/15 text-rose-200 border border-rose-500/30 hover:bg-rose-500/25 cursor-pointer'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {updateUserMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
                        {status}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-slate-950/40 px-3 py-2">
                      <Mail className="h-4 w-4 text-sky-400 flex-shrink-0" />
                      <span className="font-medium text-slate-200">{email}</span>
                    </div>
                    <p className="flex items-center gap-2 text-slate-400">
                      <Phone className="h-4 w-4 text-slate-500" /> {phone}
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-slate-500" /> {user.lavanderia_nombre ?? 'Sin lavandería asignada'}
                      </span>
                      <span className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-slate-500" /> Último acceso: {formatDateTime(user.updated_at)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Button
                      variant="outline"
                      className="border-white/10 bg-slate-950/60 text-slate-200 hover:bg-slate-900"
                      onClick={() => handleOpenDetail(user.id)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Gestionar usuario
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          {!usersQuery.isLoading && filteredUsers.length === 0 ? (
            <p className="text-center text-sm text-slate-400">No encontramos usuarios con el criterio de búsqueda.</p>
          ) : null}
        </CardContent>
      </Card>

      <UserDetailDrawer
        open={Boolean(selectedUser)}
        onClose={handleCloseDetail}
        form={detailForm}
        onSubmit={onSubmitDetail}
        loading={updateUserMutation.isPending}
        user={selectedUser}
      />
    </section>
  );
}

const calculateMetrics = (users: AdminUser[]) => {
  const total = users.length;
  const admins = users.filter((user) => user.rol === 'superadmin').length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const activeToday = users.filter((user) => new Date(user.updated_at) >= startOfToday).length;

  const statusCounts = users.reduce(
    (acc, user) => {
      if (user.activo === true) {
        acc.active += 1;
      } else {
        acc.inactive += 1;
      }
      return acc;
    },
    { active: 0, inactive: 0 },
  );

  const roleCounts = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.rol] = (acc[user.rol] ?? 0) + 1;
    return acc;
  }, {});

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentMonthCount = users.filter((user) => new Date(user.created_at) >= startOfMonth).length;
  const prevMonthCount = users.filter((user) => {
    const createdAt = new Date(user.created_at);
    return createdAt >= startOfPrevMonth && createdAt < startOfMonth;
  }).length;

  const growthPct = prevMonthCount === 0 ? (currentMonthCount > 0 ? 100 : 0) : ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;

  return {
    total,
    admins,
    activeToday,
    growthPct,
    statusCounts,
    roleCounts,
  };
};

const SummaryGrid = ({ metrics, loading }: { metrics: ReturnType<typeof calculateMetrics>; loading: boolean }) => {
  const cards = [
    {
      title: 'Usuarios totales',
      value: metrics.total,
      subtitle: `${metrics.growthPct >= 0 ? '+' : ''}${metrics.growthPct.toFixed(1)}% vs. mes pasado`,
      icon: Users,
      accent: 'bg-sky-500/10 text-sky-200 border border-sky-500/20',
    },
    {
      title: 'Administradores',
      value: metrics.admins,
      subtitle: 'Control de cuentas privilegiadas',
      icon: ShieldCheck,
      accent: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20',
    },
    {
      title: 'Activos hoy',
      value: metrics.activeToday,
      subtitle: 'Usuarios con sesión en las últimas 24 h',
      icon: Activity,
      accent: 'bg-violet-500/10 text-violet-200 border border-violet-500/20',
    },
    {
      title: 'Inactivos',
      value: metrics.statusCounts.inactive,
      subtitle: 'Cuentas desactivadas',
      icon: ChevronRight,
      accent: 'bg-rose-500/10 text-rose-200 border border-rose-500/20',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
        >
          <div className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>
            <card.icon className="h-5 w-5" />
          </div>
          <p className="text-xs uppercase tracking-widest text-slate-500">{card.title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{loading ? '—' : card.value}</p>
          <p className="mt-2 text-xs text-slate-500">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
};

const RoleDistribution = ({
  metrics,
  loading,
}: {
  metrics: ReturnType<typeof calculateMetrics>;
  loading: boolean;
}) => (
  <Card className="border-white/10 bg-slate-900/70">
    <CardHeader>
      <CardTitle className="text-white">Distribución por rol</CardTitle>
      <p className="text-sm text-slate-400">Usuarios agrupados según su nivel de acceso.</p>
    </CardHeader>
    <CardContent className="space-y-4">
      {roleOrder.map((role) => {
        const label = roleLabels[role] ?? role;
        const total = metrics.total || 1;
        const count = metrics.roleCounts[role] ?? 0;
        const pct = (count / total) * 100;
        return (
          <div key={role} className="space-y-2">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>{label}</span>
              <span className="text-xs text-slate-500">
                {loading ? '—' : `${count} usuarios • ${pct.toFixed(0)}%`}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sky-500 to-sky-300"
                style={{ width: loading ? '0%' : `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
);

const AccountStatus = ({ metrics }: { metrics: ReturnType<typeof calculateMetrics> }) => {
  const total = metrics.total || 1;
  const entries: Array<{ key: keyof typeof statusLabels; value: number }> = [
    { key: 'active', value: metrics.statusCounts.active },
    { key: 'inactive', value: metrics.statusCounts.inactive },
  ];

  return (
    <Card className="border-white/10 bg-slate-900/70">
      <CardHeader>
        <CardTitle className="text-white">Estado de cuentas</CardTitle>
        <p className="text-sm text-slate-400">Seguimiento rápido de activas e inactivas.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.key} className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            <span>{statusLabels[entry.key]}</span>
            <span className="font-semibold text-white">
              {entry.value} usuarios ({((entry.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const AvatarCircle = ({ name }: { name: string }) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 via-emerald-400 to-violet-500 text-sm font-semibold text-white shadow-lg">
      {initials || 'LP'}
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.25 5.25a7.5 7.5 0 0011.4 11.4z" />
  </svg>
);

const SkeletonCard = () => (
  <div className="animate-pulse rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-slate-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 rounded bg-slate-800" />
        <div className="h-2 w-1/3 rounded bg-slate-800" />
      </div>
    </div>
    <div className="mt-5 space-y-2">
      <div className="h-2 w-full rounded bg-slate-800" />
      <div className="h-2 w-3/4 rounded bg-slate-800" />
      <div className="h-2 w-1/2 rounded bg-slate-800" />
    </div>
    <div className="mt-5 h-9 w-32 rounded bg-slate-800" />
  </div>
);

const UserDetailDrawer = ({
  open,
  onClose,
  form,
  onSubmit,
  loading,
  user,
}: {
  open: boolean;
  onClose: () => void;
  form: ReturnType<typeof useForm<z.infer<typeof userDetailSchema>>>;
  onSubmit: () => void;
  loading: boolean;
  user: AdminUser | null;
}) => {
  if (!open || !user) return null;
  const lavanderiaNombre = user.lavanderia_nombre ?? 'Sin lavandería asignada';
  const email = user.email ?? '—';

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-end bg-black/40 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col gap-6 overflow-y-auto border-l border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Gestionar usuario</h2>
            <p className="text-sm text-slate-400">Actualiza la información y permisos del usuario seleccionado.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-400 transition hover:text-slate-200"
          >
            Cerrar
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-3">
          <div>
            <p className="text-xs text-slate-500">Correo electrónico</p>
            <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Mail className="h-4 w-4 text-sky-400" />
              {email}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Lavandería asignada</p>
            <p className="text-sm font-semibold text-slate-100">{lavanderiaNombre}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Último acceso</p>
            <p className="text-sm text-slate-300">{formatDateTime(user.updated_at)}</p>
          </div>
        </div>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre" error={form.formState.errors.nombre?.message}>
              <Input {...form.register('nombre')} className="bg-slate-900/70" />
            </Field>
            <Field label="Apellido" error={form.formState.errors.apellido?.message}>
              <Input {...form.register('apellido')} className="bg-slate-900/70" />
            </Field>
          </div>
          <Field label="Correo" error={form.formState.errors.email?.message}>
            <Input {...form.register('email')} className="bg-slate-900/70" />
          </Field>
          <Field label="Teléfono" error={form.formState.errors.telefono?.message}>
            <Input {...form.register('telefono')} className="bg-slate-900/70" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rol" error={form.formState.errors.rol?.message}>
              <select
                {...form.register('rol')}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {roleOrder.map((role) => (
                  <option key={role} value={role}>
                    {roleLabels[role] ?? role}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estado" error={form.formState.errors.activo?.message}>
              <select
                {...form.register('activo', { setValueAs: (value) => value === 'true' })}
                className="h-11 w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </Field>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="bg-sky-500 text-white hover:bg-sky-400" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Guardar cambios
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-transparent text-slate-300 hover:bg-slate-900"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

type FieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

const Field = ({ label, error, children }: FieldProps) => (
  <div className="space-y-2">
    <Label className="text-sm text-slate-300">{label}</Label>
    {children}
    {error ? <p className="text-xs text-rose-300">{error}</p> : null}
  </div>
);
