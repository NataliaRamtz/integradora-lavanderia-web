import { LaundryLayout } from "@/components/layouts/laundry-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function EstadisticasPage() {
  return (
    <LaundryLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Estadísticas</h1>
          <p className="text-muted-foreground">Monitorea el rendimiento de tu lavandería</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Completados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <div className="mt-2 rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">Pedidos Completados</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingresos Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$0.00</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Valor Promedio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$0.00</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Recurrentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Reports */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pedidos Completados */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pedidos Completados</CardTitle>
                <Select defaultValue="ultima-semana">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ultima-semana">Última Semana</SelectItem>
                    <SelectItem value="ultimo-mes">Último Mes</SelectItem>
                    <SelectItem value="ultimo-ano">Último Año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="mb-2 text-sm text-muted-foreground">Pedidos por Semana</div>
                <div className="text-4xl font-bold">120</div>
                <div className="text-sm text-muted-foreground">Últimas 4 semanas</div>
              </div>

              {/* Simple Bar Chart */}
              <div className="flex h-48 items-end justify-between gap-2">
                <div className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-primary" style={{ height: "60%" }} />
                  <span className="text-xs text-muted-foreground">Semana 1</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-primary" style={{ height: "80%" }} />
                  <span className="text-xs text-muted-foreground">Semana 2</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-primary" style={{ height: "70%" }} />
                  <span className="text-xs text-muted-foreground">Semana 3</span>
                </div>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-primary" style={{ height: "90%" }} />
                  <span className="text-xs text-muted-foreground">Semana 4</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas Clave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Pedidos por Semana</span>
                  <span className="text-2xl font-bold">45</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>+10% vs mes anterior</span>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Clientes Nuevos</span>
                  <span className="text-2xl font-bold">12</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <TrendingDown className="h-4 w-4" />
                  <span>-5% vs mes anterior</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado de Pedidos and Ingresos */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Pedidos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pendientes</span>
                  <span className="font-medium">1 (0.0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-[1%] rounded-full bg-yellow-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">En Proceso</span>
                  <span className="font-medium">1 (50.0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-1/2 rounded-full bg-blue-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Listos</span>
                  <span className="font-medium">1 (50.0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-1/2 rounded-full bg-green-500" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completados</span>
                  <span className="font-medium">0 (0.0%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-2 w-0 rounded-full bg-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ingresos Estimados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="mb-2 text-sm text-muted-foreground">Ingresos por Mes</div>
                <div className="text-4xl font-bold">$5,500</div>
                <div className="text-sm text-muted-foreground">Últimos 6 meses</div>
              </div>

              {/* Line Chart Simulation */}
              <div className="relative h-48">
                <svg className="h-full w-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <path
                    d="M 0 80 Q 100 40, 100 60 T 200 100 T 300 70 T 400 30 T 500 90 T 600 60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-primary"
                  />
                  <path
                    d="M 0 80 Q 100 40, 100 60 T 200 100 T 300 70 T 400 30 T 500 90 T 600 60 L 600 200 L 0 200 Z"
                    fill="currentColor"
                    className="text-primary opacity-10"
                  />
                </svg>
                <div className="absolute bottom-0 flex w-full justify-between px-2 text-xs text-muted-foreground">
                  <span>Ene</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Abr</span>
                  <span>May</span>
                  <span>Jun</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Servicios Más Solicitados */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Más Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="mb-2 text-4xl">📊</div>
                <p>Gráfico de servicios más solicitados</p>
                <p className="text-sm">Información disponible próximamente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LaundryLayout>
  )
}
