"use client"

import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
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
  Plus,
} from "lucide-react"

const overviewMetrics = [
  {
    label: "Lavanderías activas",
    value: "58",
    delta: "+5.4%",
    trend: "Crecimiento mensual",
    icon: Store,
    accent: "bg-blue-100 text-blue-600",
  },
  {
    label: "Ingresos acumulados",
    value: "$12,450",
    delta: "+8.1%",
    trend: "vs. mes anterior",
    icon: TrendingUp,
    accent: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Usuarios activos",
    value: "1,250",
    delta: "+15.0%",
    trend: "retención 30 días",
    icon: Users,
    accent: "bg-purple-100 text-purple-600",
  },
]

const engagementSignals = [
  { label: "Tasa de conversión", value: "4.2%", helper: "Landing → registro" },
  { label: "Uso de app móvil", value: "67%", helper: "Sesiones móviles sobre total" },
  { label: "NPS promedio", value: "8.6", helper: "Últimos 90 días" },
]

const planCatalog = [
  {
    name: "Freemium",
    slug: "freemium",
    status: "Activo",
    tagClass: "bg-blue-100 text-blue-700",
    adoption: "43%",
    arpu: "$0",
    churn: "12%",
    description: "Plan gratuito para primeras lavanderías",
  },
  {
    name: "Suscripción",
    slug: "suscripcion",
    status: "Activo",
    tagClass: "bg-emerald-100 text-emerald-700",
    adoption: "38%",
    arpu: "$49",
    churn: "5%",
    description: "Acceso completo con soporte prioritario",
  },
  {
    name: "Comisión",
    slug: "comision",
    status: "En pruebas",
    tagClass: "bg-amber-100 text-amber-700",
    adoption: "19%",
    arpu: "$3.4",
    churn: "9%",
    description: "Participación sobre cada transacción",
  },
]

const growthHighlights = [
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

const operationalFocus = [
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

export default function DashboardPage() {
  const router = useRouter()

  return (
    <MainLayout title="Panel de Control">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Indicadores estratégicos del ecosistema LaundryPro para seguimiento del superadmin.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {overviewMetrics.map((metric) => (
            <Card key={metric.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs font-medium text-emerald-600">{metric.delta}</p>
                    <p className="text-xs text-muted-foreground">{metric.trend}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${metric.accent}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Indicadores de Crecimiento</CardTitle>
              <CardDescription>Comportamiento agregado de las métricas principales del marketplace.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {growthHighlights.map((item) => (
                <div key={item.title} className="space-y-3 rounded-lg border border-border bg-muted/40 p-4">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-primary" />
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.helper}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement y salud del producto</CardTitle>
              <CardDescription>Métricas clave de adopción y satisfacción.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {engagementSignals.map((signal) => (
                <div key={signal.label} className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs uppercase text-muted-foreground">{signal.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">{signal.value}</p>
                  <p className="text-xs text-muted-foreground">{signal.helper}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Rendimiento de Planes</h2>
              <p className="text-muted-foreground">
                Comparativa de adopción y monetización para cada modelo de negocio activo.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {planCatalog.map((plan) => (
              <Card key={plan.name} className="flex flex-col justify-between">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription className="mt-1">{plan.description}</CardDescription>
                    </div>
                    <Badge className={plan.tagClass}>{plan.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Adopción</span>
                      <span className="font-medium text-foreground">{plan.adoption}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ARPU</span>
                      <span className="font-medium text-foreground">{plan.arpu}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Churn</span>
                      <span className="font-medium text-foreground">{plan.churn}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => router.push(`/planes/configurar/${plan.slug}`)}
                  >
                    Configurar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {operationalFocus.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{item.title}</CardTitle>
                </div>
                <CardDescription>{item.helper}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-foreground">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </MainLayout>
  )
}
