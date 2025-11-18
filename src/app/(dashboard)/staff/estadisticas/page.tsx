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
      <header className="space-y-2 mb-2">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#F2F5FA] via-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">
          Estadísticas y métricas
        </h1>
        <p className="text-sm text-[#BFC7D3] font-medium">
          Analiza el rendimiento de tu lavandería con indicadores clave, tendencias y servicios más solicitados.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 py-20 text-[#BFC7D3] backdrop-blur-md">
          <Loader2 className="mr-3 h-5 w-5 animate-spin text-[#4C89D9]" /> Cargando estadísticas…
        </div>
      ) : !data ? (
        <div className="rounded-3xl border-2 border-dashed border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 px-6 py-16 text-center text-sm text-[#BFC7D3] backdrop-blur-md">
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
            <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-[#F2F5FA] text-xl">Pedidos completados</CardTitle>
                  <p className="text-sm text-[#BFC7D3]">Compara por semana, mes y año</p>
                </div>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                <StatBlock label="Última semana" value={data.pedidosCompletados.semana} />
                <StatBlock label="Este mes" value={data.pedidosCompletados.mes} />
                <StatBlock label="Este año" value={data.pedidosCompletados.anio} />
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader>
                <CardTitle className="text-[#F2F5FA] text-xl">Métricas clave</CardTitle>
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
            <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duración-300 group-hover:opacity-100" />
              <CardHeader>
                <CardTitle className="text-[#F2F5FA] text-xl">Estado de pedidos</CardTitle>
                <p className="text-sm text-[#BFC7D3]">Distribución actual de pedidos por estado</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(data.estadoPedidos).map(([estado, value]) => {
                  const status = estado as PedidoEstado;
                  const percentage = totalEstado > 0 ? Math.round((value / totalEstado) * 100) : 0;
                  return (
                    <div key={estado} className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-[#BFC7D3]">
                        <span className="flex items-center gap-2">
                          <span className={cn('h-2 w-2 rounded-full', estadoColors[status])} />
                          {estadoLabels[status]}
                        </span>
                        <span className="font-semibold text-[#F2F5FA]">{value}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-[#0E1624]">
                        <div
                          className={cn('h-2.5 rounded-full transition-all duration-500', estadoColors[status])}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duración-300 group-hover:opacity-100" />
              <CardHeader>
                <CardTitle className="text-[#F2F5FA] text-xl">Ingresos estimados</CardTitle>
                <p className="text-sm text-[#BFC7D3]">Últimos 6 meses</p>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.ingresosMensuales}>
                    <defs>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4C89D9" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#4C89D9" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#25354B" />
                    <XAxis dataKey="month" stroke="#8FA1B7" tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ stroke: '#4C89D9', strokeWidth: 1 }}
                      contentStyle={{ background: '#1B2A40', borderRadius: '0.75rem', border: '1px solid #25354B', color: '#F2F5FA' }}
                      formatter={(value: number) => currencyFormatter.format(value)}
                    />
                    <Area type="monotone" dataKey="value" stroke="#4C89D9" fill="url(#colorIngresos)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity duración-300 group-hover:opacity-100" />
            <CardHeader>
              <CardTitle className="text-[#F2F5FA] text-xl">Servicios más solicitados</CardTitle>
              <p className="text-sm text-[#BFC7D3]">Top 5 según cantidad vendida (últimos pedidos)</p>
            </CardHeader>
            <CardContent className="h-80">
              {data.serviciosFrecuentes.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-[#8FA1B7]">
                  Aún no hay información suficiente de servicios.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.serviciosFrecuentes}>
                    <CartesianGrid vertical={false} stroke="#25354B" />
                    <XAxis dataKey="nombre" stroke="#8FA1B7" tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(76, 137, 217, 0.1)' }}
                      contentStyle={{ background: '#1B2A40', borderRadius: '0.75rem', border: '1px solid #25354B', color: '#F2F5FA' }}
                      formatter={(value: number) => [`${value} ventas`, 'Cantidad']}
                    />
                    <Bar dataKey="cantidad" radius={[10, 10, 4, 4]} fill="#4C89D9" />
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
    <Card className="group relative overflow-hidden border-2 border-[#25354B]/50 bg-gradient-to-br from-[#1B2A40]/80 via-[#25354B]/50 to-[#1B2A40]/80 shadow-lg shadow-black/20 backdrop-blur-md transition-all duration-300 hover:border-[#4C89D9]/50">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4C89D9]/5 via-transparent to-[#60C2D8]/5 opacity-0 transition-opacity	duration-300 group-hover:opacity-100" />
      <CardHeader className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8FA1B7]">{title}</p>
            <p className="mt-2 text-3xl font-extrabold text-[#F2F5FA]">{value}</p>
          </div>
          <Badge className="bg-[#4C89D9]/20 text-[#4C89D9] border border-[#4C89D9]/30">{badge}</Badge>
        </div>
        <p className="text-xs text-[#BFC7D3]">{subtitle}</p>
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
    <div className="rounded-2xl border border-[#25354B]/40 bg-gradient-to-br from-[#1B2A40]/70 to-[#25354B]/40 px-4 py-5 text-[#F2F5FA] shadow-inner shadow-black/20">
      <p className="text-xs uppercase tracking-widest text-[#8FA1B7]">{label}</p>
      <p className="mt-3 text-3xl font-extrabold">{value}</p>
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
    <div className="space-y-3 rounded-2xl border border-[#25354B]/40 bg-gradient-to-br from-[#1B2A40]/70 to-[#25354B]/40 px-4 py-5 shadow-inner shadow-black/20">
      <p className="text-xs uppercase tracking-widest text-[#8FA1B7]">{label}</p>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-extrabold text-[#F2F5FA]">{value}</p>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border',
            positive
              ? 'bg-[#6DF2A4]/15 text-[#6DF2A4] border-[#6DF2A4]/30'
              : 'bg-[#FF8B6B]/15 text-[#FF8B6B] border-[#FF8B6B]/30'
          )}
        >
          {positive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
          {percentageFormatter(variation)}
        </span>
      </div>
    </div>
  );
}
