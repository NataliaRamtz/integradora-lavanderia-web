import type { LucideIcon } from "lucide-react"
import {
  TrendingUp,
  Users,
  Store,
  BarChart3,
  PieChart,
  LineChart,
  Gauge,
  Target,
  Zap,
} from "lucide-react"

export interface OverviewMetric {
  label: string
  value: string
  delta: string
  trend: string
  icon: LucideIcon
  accent: string
  key: string
}

export interface GrowthHighlight {
  icon: LucideIcon
  title: string
  value: string
  helper: string
  detail: string
}

export interface EngagementSignal {
  label: string
  value: string
  helper: string
}

export interface PlanSummary {
  name: string
  slug: string
  status: string
  tagClass: string
  adoption: string
  arpu: string
  churn: string
  description: string
}

export interface OperationalIndicator {
  icon: LucideIcon
  title: string
  value: string
  helper: string
}

export const overviewMetrics: OverviewMetric[] = [
  {
    label: "Lavanderías activas",
    value: "58",
    delta: "+5.4%",
    trend: "Crecimiento mensual",
    icon: Store,
    accent: "bg-blue-100 text-blue-600",
    key: "laundries",
  },
  {
    label: "Ingresos acumulados",
    value: "$12,450",
    delta: "+8.1%",
    trend: "vs. mes anterior",
    icon: TrendingUp,
    accent: "bg-emerald-100 text-emerald-600",
    key: "revenue",
  },
  {
    label: "Usuarios activos",
    value: "1,250",
    delta: "+15.0%",
    trend: "retención 30 días",
    icon: Users,
    accent: "bg-purple-100 text-purple-600",
    key: "users",
  },
]

export const growthHighlights: GrowthHighlight[] = [
  {
    icon: BarChart3,
    title: "Ingresos recurrentes",
    value: "$8,120",
    helper: "MRR estimado",
    detail: "Contribución principal desde planes de suscripción",
  },
  {
    icon: PieChart,
    title: "Participación por plan",
    value: "38%",
    helper: "Suscripción",
    detail: "Objetivo Q4: llegar a 45% de adopción",
  },
  {
    icon: LineChart,
    title: "Retención 90 días",
    value: "88%",
    helper: "vs 84% trimestre anterior",
    detail: "Mejoras en onboarding y soporte",
  },
]

export const engagementSignals: EngagementSignal[] = [
  { label: "Tasa de conversión", value: "4.2%", helper: "Landing → registro" },
  { label: "Uso de app móvil", value: "67%", helper: "Sesiones móviles sobre total" },
  { label: "NPS promedio", value: "8.6", helper: "Últimos 90 días" },
]

export const planCatalog: PlanSummary[] = [
  {
    name: "Freemium",
    slug: "freemium",
    status: "Activo",
    tagClass: "bg-blue-100 text-blue-700",
    adoption: "43%",
    arpu: "$0",
    churn: "12%",
    description: "Plan básico con funciones limitadas.",
  },
  {
    name: "Suscripción",
    slug: "suscripcion",
    status: "Activo",
    tagClass: "bg-emerald-100 text-emerald-700",
    adoption: "38%",
    arpu: "$49",
    churn: "5%",
    description: "Acceso completo a todas las funciones.",
  },
  {
    name: "Comisión",
    slug: "comision",
    status: "En pruebas",
    tagClass: "bg-amber-100 text-amber-700",
    adoption: "19%",
    arpu: "$3.4",
    churn: "9%",
    description: "Modelo basado en % por transacción.",
  },
]

export const operationalFocus: OperationalIndicator[] = [
  {
    icon: Gauge,
    title: "SLA soporte",
    value: "92%",
    helper: "Tickets resueltos < 24h",
  },
  {
    icon: Zap,
    title: "Automatizaciones",
    value: "31",
    helper: "Flujos activos",
  },
  {
    icon: Target,
    title: "Objetivo Q4",
    value: "150",
    helper: "Nuevas lavanderías",
  },
]
