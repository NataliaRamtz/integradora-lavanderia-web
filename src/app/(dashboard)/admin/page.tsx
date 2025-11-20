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
        iconGradient: 'from-[#4C89D9] via-[#60C2D8] to-[#4C89D9]',
        iconColor: 'text-[#4C89D9]',
        iconBg: 'bg-gradient-to-br from-[#4C89D9]/20 to-[#60C2D8]/20 border border-[#4C89D9]/30',
        borderGradient: 'border-[#4C89D9]/50',
        bgGradient: 'from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80',
      },
      {
        title: 'Ingresos acumulados',
        value: formatCurrency(metrics.totalRevenue),
        delta: formatPct(metrics.revenueGrowthPct, { sign: true }),
        subtitle: 'Comparado con el mes anterior',
        icon: ArrowUpRight,
        iconGradient: 'from-[#6DF2A4] via-[#60C2D8] to-[#6DF2A4]',
        iconColor: 'text-[#6DF2A4]',
        iconBg: 'bg-gradient-to-br from-[#6DF2A4]/20 to-[#60C2D8]/20 border border-[#6DF2A4]/30',
        borderGradient: 'border-[#6DF2A4]/50',
        bgGradient: 'from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80',
      },
      {
        title: 'Usuarios activos',
        value: formatNumber(metrics.activeUsers),
        delta: formatPct(metrics.retention30dPct),
        subtitle: 'Retención últimos 30 días',
        icon: Users2,
        iconGradient: 'from-[#FFD97B] via-[#FF8B6B] to-[#FFD97B]',
        iconColor: 'text-[#FFD97B]',
        iconBg: 'bg-gradient-to-br from-[#FFD97B]/20 to-[#FF8B6B]/20 border border-[#FFD97B]/30',
        borderGradient: 'border-[#FFD97B]/50',
        bgGradient: 'from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80',
      },
    ],
    [metrics.activeLaundries, metrics.totalRevenue, metrics.activeUsers, metrics.laundriesGrowthPct, metrics.revenueGrowthPct, metrics.retention30dPct],
  );

  return (
    <section className="space-y-6 text-[#F2F5FA]">
      {/* Cards de resumen - Grid equilibrado */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map(({ title, value, delta, subtitle, icon: Icon, iconGradient, iconColor, iconBg, borderGradient, bgGradient }) => (
          <article 
            key={title} 
            className={`group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br ${bgGradient} p-6 shadow-lg shadow-[#4C89D9]/10 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20 hover:-translate-y-1`}
          >
            {/* Animated gradient overlay */}
            <div className={`pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br ${iconGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
            {/* Glow effect */}
            <div className={`pointer-events-none absolute -inset-0.5 rounded-3xl bg-gradient-to-r ${iconGradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20`} />
            
            <div className="relative">
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl relative`}>
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${iconGradient} opacity-30 blur-sm`} />
                <Icon className={`relative h-7 w-7 ${iconColor} drop-shadow-[0_0_12px_currentColor] opacity-90 group-hover:opacity-100 transition-opacity`} />
              </div>
              <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">{title}</p>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold bg-gradient-to-r from-[#F2F5FA] to-[#BFC7D3] bg-clip-text text-transparent">{value}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${iconGradient} bg-opacity-20 text-white`}>{delta}</span>
              </div>
              <p className="mt-2 text-xs text-[#8FA1B7]">{subtitle}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Sección de Indicadores de crecimiento - Una sola fila */}
      <section className="group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-8 shadow-lg shadow-[#4C89D9]/10 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-extrabold bg-gradient-to-r from-[#F2F5FA] via-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">Indicadores de crecimiento</h3>
              <p className="text-sm text-[#BFC7D3] mt-1">Ingresos recurrentes y comportamiento agregado de las métricas clave.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6DF2A4]/20 to-[#60C2D8]/20 border border-[#6DF2A4]/30 px-3 py-1 text-xs font-semibold text-[#6DF2A4]">
              <TrendingIndicator /> Salud positiva
            </span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
        </div>
      </section>

      {/* Fila inferior - 3 columnas */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <section className="group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 shadow-lg shadow-[#4C89D9]/10 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20 flex flex-col min-h-[320px]">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex flex-col flex-1">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold text-[#F2F5FA]">Engagement y salud del producto</h3>
              <span className="text-xs text-[#8FA1B7] font-medium">Últimos 30 días</span>
            </div>
            <div className="space-y-4 flex-1">
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
          </div>
        </section>

        <section className="group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 shadow-lg shadow-[#4C89D9]/10 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20 flex flex-col min-h-[320px]">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex flex-col flex-1">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold text-[#F2F5FA]">Vista rápida de planes</h3>
              <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4C89D9]/20 to-[#60C2D8]/20 border border-[#4C89D9]/30 px-3 py-1 text-xs font-semibold text-[#4C89D9] transition-all duration-300 hover:from-[#4C89D9]/30 hover:to-[#60C2D8]/30 hover:scale-105">
                Ver detalle
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="space-y-4 flex-1">
              {metrics.planSnapshot.map((plan) => (
                <PlanCard key={plan.name} name={plan.name} accounts={plan.accounts} conversionPct={plan.conversionPct} />
              ))}
            </div>
          </div>
        </section>

        <section className="group relative overflow-hidden rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 p-6 shadow-lg shadow-[#4C89D9]/10 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-xl hover:shadow-[#4C89D9]/20 flex flex-col min-h-[320px]">
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative flex flex-col flex-1">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-extrabold text-[#F2F5FA]">Resumen de operaciones</h3>
              <span className="inline-flex items-center gap-2 text-xs text-[#8FA1B7] font-medium">
                <CalendarCheck className="h-4 w-4" /> Objetivos 2025
              </span>
            </div>
            <div className="space-y-4 flex-1">
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
          </div>
        </section>
      </div>

      {(isLoading || isFetching) && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 px-4 py-3 text-sm text-[#BFC7D3] backdrop-blur-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[#4C89D9]" /> Actualizando métricas en tiempo real...
        </div>
      )}
    </section>
  );
}

const TrendingIndicator = () => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6DF2A4]">
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
  <div className="group relative overflow-hidden rounded-2xl border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-lg hover:shadow-[#4C89D9]/10">
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative">
      <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">{label}</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#F2F5FA] to-[#BFC7D3] bg-clip-text text-transparent">{amount}</span>
        <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-gradient-to-r from-[#6DF2A4]/20 to-[#60C2D8]/20 text-[#6DF2A4]">{trend}</span>
      </div>
      <p className="mt-3 text-xs text-[#8FA1B7]">{caption}</p>
    </div>
  </div>
);

const EngagementCard = ({ title, value, description }: { title: string; value: string; description: string }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-lg hover:shadow-[#4C89D9]/10 h-full flex flex-col">
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative flex flex-col flex-1">
      <p className="text-xs uppercase tracking-widest text-[#8FA1B7] font-medium">{title}</p>
      <p className="mt-3 text-2xl font-extrabold bg-gradient-to-r from-[#4C89D9] via-[#60C2D8] to-[#4C89D9] bg-clip-text text-transparent">{value}</p>
      <p className="mt-2 text-xs text-[#8FA1B7] flex-1">{description}</p>
    </div>
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
  <div className="group relative overflow-hidden rounded-2xl border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-lg hover:shadow-[#4C89D9]/10 hover:-translate-y-0.5 flex flex-col">
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative flex flex-col flex-1">
      <div className="flex items-center justify-between">
        <p className="text-sm font-extrabold text-[#F2F5FA]">{name}</p>
        <span className="text-xs text-[#8FA1B7] font-medium">{formatNumber(accounts)} cuentas</span>
      </div>
      <p className="mt-2 text-xl font-extrabold bg-gradient-to-r from-[#4C89D9] via-[#60C2D8] to-[#4C89D9] bg-clip-text text-transparent">{formatPct(conversionPct)}</p>
      <p className="mt-1 text-xs text-[#8FA1B7] flex-1">Conversión del plan</p>
    </div>
  </div>
);

const OperationMetric = ({ title, value, description }: { title: string; value: string; description: string }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/60 to-[#25354B]/40 p-4 backdrop-blur-sm transition-all duration-300 hover:border-[#4C89D9]/50 hover:shadow-lg hover:shadow-[#4C89D9]/10 hover:-translate-y-0.5">
    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative">
      <div className="flex items-center justify-between">
        <p className="text-sm font-extrabold text-[#F2F5FA]">{title}</p>
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#4C89D9] via-[#60C2D8] to-[#4C89D9] bg-clip-text text-transparent">{value}</span>
      </div>
      <p className="mt-2 text-xs text-[#8FA1B7]">{description}</p>
    </div>
  </div>
);

