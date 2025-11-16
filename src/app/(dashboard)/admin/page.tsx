'use client';

import { useMemo } from 'react';
import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  Loader2,
  Users2,
} from 'lucide-react';

import type { AdminDashboardMetrics } from '@/features/admin/api';
import { useAdminDashboardMetrics } from '@/features/admin/queries';

const defaultMetrics: AdminDashboardMetrics = {
  activeLaundries: 0,
  laundriesGrowthPct: 0,
  totalRevenue: 0,
  revenueGrowthPct: 0,
  activeUsers: 0,
  retention30dPct: 0,
  recurrentRevenue: 0,
  retention90dPct: 0,
  retentionTrendPct: 0,
  planSnapshot: [
    { name: 'Freemium', accounts: 0, conversionPct: 0 },
    { name: 'Suscripción', accounts: 0, conversionPct: 0 },
    { name: 'Comisión', accounts: 0, conversionPct: 0 },
  ],
  productEngagement: {
    conversionRatePct: 0,
    mobileUsagePct: 0,
  },
  operationsSummary: {
    supportSlaPct: 0,
    automationsActive: 0,
    q4GoalPct: 0,
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) => new Intl.NumberFormat('es-MX').format(value);

const formatPct = (value: number, options?: { sign?: boolean; digits?: number }) => {
  const formatter = new Intl.NumberFormat('es-MX', {
    maximumFractionDigits: options?.digits ?? 1,
    signDisplay: options?.sign ? 'always' : 'auto',
  });
  return `${formatter.format(value)}%`;
};

export default function AdminHomePage() {
  const { data, isLoading, isFetching } = useAdminDashboardMetrics();
  const metrics = data ?? defaultMetrics;

  const summaryCards = useMemo(
    () => [
      {
        title: 'Lavanderías activas',
        value: formatNumber(metrics.activeLaundries),
        delta: formatPct(metrics.laundriesGrowthPct, { sign: true }),
        subtitle: 'Crecimiento vs. mes anterior',
        icon: Building2,
        accent: 'bg-sky-500/15 text-sky-300',
      },
      {
        title: 'Ingresos acumulados',
        value: formatCurrency(metrics.totalRevenue),
        delta: formatPct(metrics.revenueGrowthPct, { sign: true }),
        subtitle: 'Comparado con el mes anterior',
        icon: ArrowUpRight,
        accent: 'bg-emerald-500/15 text-emerald-300',
      },
      {
        title: 'Usuarios activos',
        value: formatNumber(metrics.activeUsers),
        delta: formatPct(metrics.retention30dPct),
        subtitle: 'Retención últimos 30 días',
        icon: Users2,
        accent: 'bg-indigo-500/15 text-indigo-300',
      },
    ],
    [metrics.activeLaundries, metrics.totalRevenue, metrics.activeUsers, metrics.laundriesGrowthPct, metrics.revenueGrowthPct, metrics.retention30dPct],
  );

  return (
    <section className="space-y-10 text-slate-100">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map(({ title, value, delta, subtitle, icon: Icon, accent }) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
            <div className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-white">{value}</span>
              <span className="text-xs font-medium text-emerald-300">{delta}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Indicadores de crecimiento</h3>
                <p className="text-sm text-slate-400">Ingresos recurrentes y comportamiento agregado de las métricas clave.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200">
                <TrendingIndicator /> Salud positiva
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <IndicatorCard
                label="Ingresos recurrentes"
                amount={formatCurrency(metrics.recurrentRevenue)}
                trend={formatPct(metrics.revenueGrowthPct, { sign: true })}
                caption="MRR estimado"
              />
              <IndicatorCard
                label="Participación por plan"
                amount={formatPct(metrics.planSnapshot[1]?.conversionPct ?? 0)}
                trend="0%"
                caption={`Usuarios Suscripción: ${formatNumber(metrics.planSnapshot[1]?.accounts ?? 0)}`}
              />
              <IndicatorCard
                label="Retención 90 días"
                amount={formatPct(metrics.retention90dPct)}
                trend={formatPct(metrics.retentionTrendPct, { sign: true })}
                caption="Vs. trimestre anterior"
              />
              <IndicatorCard
                label="Ticket promedio"
                amount={formatCurrency(metrics.totalRevenue / Math.max(metrics.activeUsers, 1))}
                trend="--"
                caption="Pedidos digitales + walk-in"
              />
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Engagement y salud del producto</h3>
                <span className="text-xs text-slate-500">Últimos 30 días</span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <EngagementCard
                  title="Tasa de conversión"
                  value={formatPct(metrics.productEngagement.conversionRatePct)}
                  description="Visitas → registro"
                />
                <EngagementCard
                  title="Uso app móvil"
                  value={formatPct(metrics.productEngagement.mobileUsagePct)}
                  description="Usuarios que usan la app en el periodo"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Vista rápida de planes</h3>
                <button className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-sky-500/20 hover:text-sky-200">
                  Ver detalle
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {metrics.planSnapshot.map((plan) => (
                  <PlanCard key={plan.name} name={plan.name} accounts={plan.accounts} conversionPct={plan.conversionPct} />
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Resumen de operaciones</h3>
              <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                <CalendarCheck className="h-4 w-4" /> Objetivos 2025
              </span>
            </div>
            <div className="mt-5 space-y-4">
              <OperationMetric
                title="SLA soporte"
                value={formatPct(metrics.operationsSummary.supportSlaPct)}
                description="Tickets resueltos &lt; 24 hrs"
              />
              <OperationMetric
                title="Automatizaciones activas"
                value={formatNumber(metrics.operationsSummary.automationsActive)}
                description="Flujos activos"
              />
              <OperationMetric
                title="Objetivo Q4"
                value={formatPct(metrics.operationsSummary.q4GoalPct)}
                description="Meta de nuevas lavanderías"
              />
            </div>
          </section>
        </div>
      </div>

      {(isLoading || isFetching) && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Actualizando métricas en tiempo real...
        </div>
      )}
    </section>
  );
}

const TrendingIndicator = () => (
  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300">
    <ArrowUpRight className="h-3 w-3" /> tendencia positiva
  </span>
);

const IndicatorCard = ({
  label,
  amount,
  trend,
  caption,
}: {
  label: string;
  amount: string;
  trend: string;
  caption: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
    <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
    <div className="mt-2 flex items-baseline gap-3">
      <span className="text-xl font-semibold text-white">{amount}</span>
      <span className="text-xs font-medium text-emerald-300">{trend}</span>
    </div>
    <p className="mt-3 text-xs text-slate-500">{caption}</p>
  </div>
);

const EngagementCard = ({ title, value, description }: { title: string; value: string; description: string }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
    <p className="text-xs uppercase tracking-widest text-slate-500">{title}</p>
    <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
    <p className="mt-2 text-xs text-slate-500">{description}</p>
  </div>
);

const PlanCard = ({
  name,
  accounts,
  conversionPct,
}: {
  name: string;
  accounts: number;
  conversionPct: number;
}) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-white">{name}</p>
      <span className="text-xs text-slate-500">{formatNumber(accounts)} cuentas</span>
    </div>
    <p className="mt-2 text-xl font-semibold text-sky-200">{formatPct(conversionPct)}</p>
    <p className="mt-1 text-xs text-slate-500">Conversión del plan</p>
  </div>
);

const OperationMetric = ({ title, value, description }: { title: string; value: string; description: string }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold text-white">{title}</p>
      <span className="text-xl font-semibold text-sky-200">{value}</span>
    </div>
    <p className="mt-2 text-xs text-slate-500">{description}</p>
  </div>
);

