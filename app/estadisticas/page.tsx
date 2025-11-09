"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"
import {
  analyticsKpiTiles,
  analyticsAdoptionByRegion,
  analyticsRetentionMetrics,
  analyticsInfrastructureStats,
  analyticsFeatureUsage,
} from "@/lib/data/admin-analytics"
import { HeartPulse, Globe } from "lucide-react"

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  const headers = Object.keys(rows[0] ?? {})
  if (!headers.length) {
    return
  }
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function EstadisticasPage() {
  const [timeframe, setTimeframe] = useState("QTD")
  const [segment, setSegment] = useState("global")

  const kpiRows = analyticsKpiTiles.map(({ label, value, helper, key }) => ({
    metric: label,
    valor: value,
    comentario: helper,
    clave: key,
    periodo: timeframe,
    segmento: segment,
  }))

  const regionRows = analyticsAdoptionByRegion.map((item) => ({ ...item, periodo: timeframe, segmento: segment }))

  return (
    <MainLayout title="Estadísticas Globales">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panorama Analítico</h1>
            <p className="text-muted-foreground">
              Métricas agregadas del ecosistema LaundryPro para el monitoreo ejecutivo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MTD">Mes a la fecha</SelectItem>
                <SelectItem value="QTD">Trimestre a la fecha</SelectItem>
                <SelectItem value="YTD">Año a la fecha</SelectItem>
              </SelectContent>
            </Select>
            <Select value={segment} onValueChange={setSegment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Segmento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="smb">SMB</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={() => downloadCSV(`kpi-${timeframe}-${segment}.csv`, kpiRows)}>
              <Download className="h-4 w-4" />
              Exportar KPI
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => downloadCSV(`regiones-${timeframe}-${segment}.csv`, regionRows)}
            >
              <Download className="h-4 w-4" />
              Exportar regiones
            </Button>
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {analyticsKpiTiles.map((tile) => (
            <Card key={tile.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline">{timeframe}</Badge>
                      <Badge variant="outline">{segment}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{tile.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{tile.value}</p>
                    <p className="text-xs text-muted-foreground">{tile.helper}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${tile.accent}`}>
                    <tile.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Adopción por región</CardTitle>
              <CardDescription>Comparativa de crecimiento {timeframe}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsAdoptionByRegion.map((item) => (
                <div key={item.region} className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.region}</p>
                    <p className="text-xs text-muted-foreground">Lavanderías activas</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{item.laundries}</p>
                    <p className="text-xs font-medium text-emerald-600">{item.growth}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retención y fidelidad</CardTitle>
              <CardDescription>Seguimiento de usuarios y clientes corporativos.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {analyticsRetentionMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <HeartPulse className="h-4 w-4 text-rose-500" />
                  <span>Satisfacción promedio</span>
                </div>
                <span className="text-lg font-semibold text-foreground">8.6 / 10</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Uso de funcionalidades</CardTitle>
              <CardDescription>Características más utilizadas por las lavanderías activas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsFeatureUsage.map((feature) => (
                <div key={feature.feature} className="rounded-lg border border-border bg-muted/30 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">{feature.feature}</p>
                    <Badge variant="secondary">{feature.state}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Adopción</span>
                    <span className="text-lg font-semibold text-foreground">{feature.usage}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ecosistema y plataforma</CardTitle>
              <CardDescription>Visibilidad de la infraestructura global.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsInfrastructureStats.map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs uppercase text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.helper}</p>
                </div>
              ))}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <span>Estado del clúster global</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs text-muted-foreground">
                    Réplicas activas en Norteamérica y expansión planificada para LATAM sur.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Latencia promedio</CardTitle>
              <CardDescription>Promedio global de respuesta API.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">182 ms</p>
              <p className="mt-2 text-xs text-muted-foreground">SLA objetivo: 200 ms</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Resiliencia</CardTitle>
              <CardDescription>Disponibilidad en los últimos 30 días.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">99.92%</p>
              <p className="mt-2 text-xs text-muted-foreground">Incidentes críticos: 0</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Modelo de datos</CardTitle>
              <CardDescription>Tamaño agregado por colección.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center justify-between">
                <span>Pedidos</span>
                <span className="font-semibold text-foreground">312 GB</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Usuarios</span>
                <span className="font-semibold text-foreground">198 GB</span>
              </p>
              <p className="flex items-center justify-between">
                <span>Histórico de tickets</span>
                <span className="font-semibold text-foreground">142 GB</span>
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </MainLayout>
  )
}
