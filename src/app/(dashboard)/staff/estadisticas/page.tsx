'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useSession } from '@/features/auth/session-context';
import { useEstadisticasDashboard } from '@/features/estadisticas/queries';
import type { PedidoEstado } from '@/features/pedidos/constants';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
});

const percentageFormatter = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

const estadoLabels: Record<PedidoEstado, string> = {
  creado: 'Pendientes',
  en_proceso: 'En proceso',
  listo: 'Listos',
  entregado: 'Entregados',
  cancelado: 'Cancelados',
};

const estadoColors: Record<PedidoEstado, string> = {
  creado: 'bg-amber-400',
  en_proceso: 'bg-sky-500',
  listo: 'bg-emerald-500',
  entregado: 'bg-slate-200',
  cancelado: 'bg-rose-500',
};

export default function EstadisticasPage() {
  const { activeRole } = useSession();
  const lavanderiaId = activeRole?.lavanderia_id ?? '';

  const estadisticasQuery = useEstadisticasDashboard(lavanderiaId);

  const data = estadisticasQuery.data;
  const isLoading = estadisticasQuery.isLoading;

  const totalEstado = useMemo(() => {
    if (!data) return 0;
    return Object.values(data.estadoPedidos).reduce((acc, value) => acc + value, 0);
  }, [data]);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-slate-500">Dashboard ▸ Estadísticas</p>
        <h1 className="text-3xl font-semibold text-slate-50">Estadísticas y métricas</h1>
        <p className="text-sm text-slate-400">
          Analiza el rendimiento de tu lavandería con indicadores clave, tendencias y servicios más solicitados.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-slate-900/60 py-20 text-slate-400">
          <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Cargando estadísticas…
        </div>
      ) : !data ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-16 text-center text-sm text-slate-400">
          No encontramos datos suficientes para mostrar las estadísticas.
        </div>
      ) : (
        <div className="space-y-8">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Pedidos Completados"
              value={data.pedidosCompletados.total}
              subtitle="Total histórico"
              badge="Pedidos completados"
            />
            <MetricCard
              title="Ingresos Totales"
              value={currencyFormatter.format(data.ingresosTotales)}
              subtitle="Pedidos entregados"
              badge="Ingresos"
            />
            <MetricCard
              title="Valor Promedio"
              value={currencyFormatter.format(data.valorPromedio || 0)}
              subtitle="Por pedido completado"
              badge="Ticket promedio"
            />
            <MetricCard
              title="Clientes Recurrentes"
              value={data.clientesRecurrentes}
              subtitle="Han pedido ≥ 2 veces"
              badge="Fidelización"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <Card className="border-white/10 bg-slate-900/70">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">Pedidos completados</CardTitle>
                  <p className="text-sm text-slate-400">Compara por semana, mes y año</p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                <StatBlock label="Última semana" value={data.pedidosCompletados.semana} />
                <StatBlock label="Este mes" value={data.pedidosCompletados.mes} />
                <StatBlock label="Este año" value={data.pedidosCompletados.anio} />
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/70">
              <CardHeader>
                <CardTitle className="text-slate-100">Métricas clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <KeyMetric
                  label="Pedidos por semana"
                  value={data.pedidosPorSemana.actual}
                  variation={data.pedidosPorSemana.variacion}
                />
                <KeyMetric
                  label="Clientes nuevos"
                  value={data.clientesNuevos.actual}
                  variation={data.clientesNuevos.variacion}
                />
              </CardContent>
            </Card>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="border-white/10 bg-slate-900/70">
              <CardHeader>
                <CardTitle className="text-slate-100">Estado de pedidos</CardTitle>
                <p className="text-sm text-slate-400">Distribución actual de pedidos por estado</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(data.estadoPedidos).map(([estado, value]) => {
                  const status = estado as PedidoEstado;
                  const percentage = totalEstado > 0 ? Math.round((value / totalEstado) * 100) : 0;
                  return (
                    <div key={estado} className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>{estadoLabels[status]}</span>
                        <span>
                          {value} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-800">
                        <div
                          className={cn('h-2.5 rounded-full', estadoColors[status])}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-900/70">
              <CardHeader>
                <CardTitle className="text-slate-100">Ingresos estimados</CardTitle>
                <p className="text-sm text-slate-400">Últimos 6 meses</p>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.ingresosMensuales}>
                    <defs>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ stroke: '#38bdf8', strokeWidth: 1 }}
                      contentStyle={{ background: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b', color: '#e2e8f0' }}
                      formatter={(value: number) => currencyFormatter.format(value)}
                    />
                    <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="url(#colorIngresos)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <Card className="border-white/10 bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-slate-100">Servicios más solicitados</CardTitle>
              <p className="text-sm text-slate-400">Top 5 según cantidad vendida (últimos pedidos)</p>
            </CardHeader>
            <CardContent className="h-80">
              {data.serviciosFrecuentes.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Aún no hay información suficiente de servicios.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.serviciosFrecuentes}>
                    <CartesianGrid vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="nombre" stroke="#94a3b8" tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }}
                      contentStyle={{ background: '#0f172a', borderRadius: '0.75rem', border: '1px solid #1e293b', color: '#e2e8f0' }}
                      formatter={(value: number) => [`${value} ventas`, 'Cantidad']}
                    />
                    <Bar dataKey="cantidad" radius={[10, 10, 4, 4]} fill="#38bdf8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
}

type MetricCardProps = {
  title: string;
  value: number | string;
  subtitle: string;
  badge: string;
};

function MetricCard({ title, value, subtitle, badge }: MetricCardProps) {
  return (
    <Card className="border-white/10 bg-slate-900/70">
      <CardHeader className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-50">{value}</p>
          </div>
          <Badge className="bg-sky-500/15 text-sky-200">{badge}</Badge>
        </div>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </CardHeader>
    </Card>
  );
}

type StatBlockProps = {
  label: string;
  value: number;
};

function StatBlock({ label, value }: StatBlockProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-5">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-50">{value}</p>
    </div>
  );
}

type KeyMetricProps = {
  label: string;
  value: number;
  variation: number;
};

function KeyMetric({ label, value, variation }: KeyMetricProps) {
  const positive = variation >= 0;
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-5">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-3xl font-semibold text-slate-50">{value}</p>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
            positive ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'
          )}
        >
          {positive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
          {percentageFormatter(variation)}
        </span>
      </div>
    </div>
  );
}
