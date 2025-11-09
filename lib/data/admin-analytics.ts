import { Store, Users, TrendingUp, Activity } from "lucide-react"

export interface AnalyticsKpi {
  label: string
  value: string
  helper: string
  key: string
  accent: string
  icon: typeof Store
}

export interface RegionAdoption {
  region: string
  laundries: number
  growth: string
}

export interface RetentionMetric {
  label: string
  value: string
}

export interface InfrastructureStat {
  label: string
  value: string
  helper: string
}

export interface FeatureUsageMetric {
  feature: string
  usage: string
  state: string
}

export const analyticsKpiTiles: AnalyticsKpi[] = [
  {
    label: "Lavanderías registradas",
    value: "58",
    helper: "+12 vs. último trimestre",
    icon: Store,
    accent: "bg-blue-100 text-blue-600",
    key: "laundries",
  },
  {
    label: "Usuarios totales",
    value: "7,820",
    helper: "+640 en el mes",
    icon: Users,
    accent: "bg-purple-100 text-purple-600",
    key: "users",
  },
  {
    label: "Ticket promedio",
    value: "$42.80",
    helper: "Promedio global",
    icon: TrendingUp,
    accent: "bg-emerald-100 text-emerald-600",
    key: "ticket",
  },
  {
    label: "Pedidos procesados",
    value: "92,413",
    helper: "Acumulado histórico",
    icon: Activity,
    accent: "bg-orange-100 text-orange-600",
    key: "orders",
  },
]

export const analyticsAdoptionByRegion: RegionAdoption[] = [
  { region: "CDMX", laundries: 21, growth: "+18%" },
  { region: "Guadalajara", laundries: 12, growth: "+11%" },
  { region: "Monterrey", laundries: 9, growth: "+7%" },
  { region: "Querétaro", laundries: 6, growth: "+10%" },
]

export const analyticsRetentionMetrics: RetentionMetric[] = [
  { label: "Retención 30 días", value: "88%" },
  { label: "Retención 90 días", value: "81%" },
  { label: "Churn mensual", value: "5.4%" },
]

export const analyticsInfrastructureStats: InfrastructureStat[] = [
  { label: "Transacciones diarias", value: "4,280", helper: "Promedio últimos 7 días" },
  { label: "Eventos en tiempo real", value: "250k", helper: "Alertas y webhooks" },
  { label: "Integraciones activas", value: "34", helper: "Servicios externos" },
]

export const analyticsFeatureUsage: FeatureUsageMetric[] = [
  { feature: "Pedidos automatizados", usage: "72%", state: "Mayor adopción" },
  { feature: "Generación de tickets", usage: "65%", state: "Crecimiento" },
  { feature: "Planificación de rutas", usage: "41%", state: "Potencial" },
]
