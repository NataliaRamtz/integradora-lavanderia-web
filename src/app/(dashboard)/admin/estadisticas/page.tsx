'use client';

import { useAdminDashboardMetrics } from '@/features/admin/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, TrendingUp, TrendingDown } from 'lucide-react';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value: number) => new Intl.NumberFormat('es-MX').format(value);
const formatPct = (value: number, options?: { sign?: boolean }) => {
  const formatter = new Intl.NumberFormat('es-MX', {
    maximumFractionDigits: 1,
    signDisplay: options?.sign ? 'always' : 'auto',
  });
  return `${formatter.format(value)}%`;
};

export default function AdminEstadisticasPage() {
  const { data, isLoading } = useAdminDashboardMetrics();

  if (isLoading) {
    return (
      <section className="space-y-6">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-widest dark:text-slate-500 text-slate-600">Dashboard ▸ Estadísticas</p>
          <h1 className="text-3xl font-semibold dark:text-slate-50 text-slate-900">Estadísticas Administrativas</h1>
        </header>
        <div className="flex items-center justify-center rounded-3xl border dark:border-white/10 border-slate-200 dark:bg-slate-900/60 bg-white/80 py-20 dark:text-slate-400 text-slate-600">
          <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Cargando estadísticas…
        </div>
      </section>
    );
  }

  const metrics = data ?? {
    activeLaundries: 0,
    laundriesGrowthPct: 0,
    totalRevenue: 0,
    revenueGrowthPct: 0,
    activeUsers: 0,
    retention30dPct: 0,
    recurrentRevenue: 0,
    retention90dPct: 0,
    retentionTrendPct: 0,
    planSnapshot: [],
    productEngagement: { conversionRatePct: 0, mobileUsagePct: 0 },
    operationsSummary: { supportSlaPct: 0, automationsActive: 0, q4GoalPct: 0 },
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest dark:text-slate-500 text-slate-600">Dashboard ▸ Estadísticas</p>
        <h1 className="text-3xl font-semibold dark:text-slate-50 text-slate-900">Estadísticas Administrativas</h1>
        <p className="text-sm dark:text-slate-400 text-slate-600">
          Métricas globales y análisis del rendimiento de la plataforma.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm dark:text-slate-400 text-slate-600">Lavanderías Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold dark:text-white text-slate-900">{formatNumber(metrics.activeLaundries)}</span>
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  metrics.laundriesGrowthPct >= 0 ? 'text-emerald-300 dark:text-emerald-300 text-emerald-600' : 'text-rose-300 dark:text-rose-300 text-rose-600'
                }`}
              >
                {metrics.laundriesGrowthPct >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {formatPct(metrics.laundriesGrowthPct, { sign: true })}
              </span>
            </div>
            <p className="mt-2 text-xs dark:text-slate-500 text-slate-600">Crecimiento vs. mes anterior</p>
          </CardContent>
        </Card>

        <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm dark:text-slate-400 text-slate-600">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold dark:text-white text-slate-900">{formatCurrency(metrics.totalRevenue)}</span>
              <span
                className={`inline-flex items-center gap-1 text-sm font-medium ${
                  metrics.revenueGrowthPct >= 0 ? 'text-emerald-300 dark:text-emerald-300 text-emerald-600' : 'text-rose-300 dark:text-rose-300 text-rose-600'
                }`}
              >
                {metrics.revenueGrowthPct >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {formatPct(metrics.revenueGrowthPct, { sign: true })}
              </span>
            </div>
            <p className="mt-2 text-xs dark:text-slate-500 text-slate-600">Comparado con el mes anterior</p>
          </CardContent>
        </Card>

        <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm dark:text-slate-400 text-slate-600">Usuarios Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold dark:text-white text-slate-900">{formatNumber(metrics.activeUsers)}</span>
            </div>
            <p className="mt-2 text-xs dark:text-slate-500 text-slate-600">Retención últimos 30 días: {formatPct(metrics.retention30dPct)}</p>
          </CardContent>
        </Card>

        <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm dark:text-slate-400 text-slate-600">Ingresos Recurrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-semibold dark:text-white text-slate-900">{formatCurrency(metrics.recurrentRevenue)}</span>
            <p className="mt-2 text-xs dark:text-slate-500 text-slate-600">MRR estimado</p>
          </CardContent>
        </Card>

        <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm dark:text-slate-400 text-slate-600">Retención 90 Días</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-semibold dark:text-white text-slate-900">{formatPct(metrics.retention90dPct)}</span>
            <p className="mt-2 text-xs dark:text-slate-500 text-slate-600">Vs. trimestre anterior</p>
          </CardContent>
        </Card>

        <Card className="dark:border-white/10 border-slate-200 dark:bg-slate-900/70 bg-white/80">
          <CardHeader>
            <CardTitle className="text-sm dark:text-slate-400 text-slate-600">Engagement del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs dark:text-slate-500 text-slate-600">Tasa de conversión</p>
              <p className="text-xl font-semibold dark:text-white text-slate-900">{formatPct(metrics.productEngagement.conversionRatePct)}</p>
            </div>
            <div>
              <p className="text-xs dark:text-slate-500 text-slate-600">Uso app móvil</p>
              <p className="text-xl font-semibold dark:text-white text-slate-900">{formatPct(metrics.productEngagement.mobileUsagePct)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
