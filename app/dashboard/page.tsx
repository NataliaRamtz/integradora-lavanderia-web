"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Hourglass, CheckCircle2, AlertCircle, Package, Store, TrendingUp, Users, Plus } from "lucide-react"

const pendingOrders = [
  {
    id: "12346",
    client: "Carlos Mendoza",
    date: "2024-01-16",
    status: "En Espera",
    statusColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "12345",
    client: "Elena Ramirez",
    date: "2024-01-15",
    status: "En Proceso",
    statusColor: "bg-yellow-100 text-yellow-700",
  },
]

const completedOrders = [
  {
    id: "12342",
    client: "Diego Silva",
    date: "2024-01-10",
    status: "Entregado",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: "12343",
    client: "Isabella Torres",
    date: "2024-01-11",
    status: "Entregado",
    statusColor: "bg-green-100 text-green-700",
  },
]

const delayedOrders = [
  {
    id: "12341",
    client: "Lucia Fernandez",
    date: "2024-01-05",
    status: "Retrasado",
    statusColor: "bg-red-100 text-red-700",
  },
]

const recentOrders = [
  {
    id: "FL001",
    client: "Andrea Garcia",
    status: "En Proceso",
    amount: "$50",
    statusColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "FL001",
    client: "Andrea Garcia",
    status: "Listo",
    amount: "$50",
    statusColor: "bg-green-100 text-green-700",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [searchLaundry, setSearchLaundry] = useState("")

  return (
    <MainLayout title="Panel de Control">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Vista de alto nivel del rendimiento de la plataforma.</p>
        </div>

        {/* Enhanced stats cards with icons and percentage changes */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Lavanderías Registradas</p>
                  <p className="text-3xl font-bold">58</p>
                  <p className="text-sm text-green-600">↑ +5</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="text-3xl font-bold">$12,450</p>
                  <p className="text-sm text-green-600">↑ +8%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                  <p className="text-3xl font-bold">1,250</p>
                  <p className="text-sm text-green-600">↑ +15%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Recientes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Pedidos Recientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Proceso</CardTitle>
              <Hourglass className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Listos</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Retrasados</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
        </div>

        {/* Pedidos en Espera */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Hourglass className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Pedidos en Espera</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingOrders.map((order) => (
                <div key={order.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <span className="font-semibold text-foreground">#{order.id}</span>
                    <Badge className={order.statusColor}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Cliente: {order.client}</p>
                  <p className="text-sm text-muted-foreground">Recepción: {order.date}</p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pedidos Completados */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <CardTitle className="text-lg">Pedidos Completados</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedOrders.map((order) => (
                <div key={order.id + order.client} className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <span className="font-semibold text-foreground">#{order.id}</span>
                    <Badge className={order.statusColor}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Cliente: {order.client}</p>
                  <p className="text-sm text-muted-foreground">Entrega: {order.date}</p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pedidos Retrasados */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg">Pedidos Retrasados</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {delayedOrders.map((order) => (
                <div key={order.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <span className="font-semibold text-foreground">#{order.id}</span>
                    <Badge className={order.statusColor}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Cliente: {order.client}</p>
                  <p className="text-sm text-muted-foreground">Entrega Estimada: {order.date}</p>
                  <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                    Ver Detalles
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Summary */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <span className="text-sm font-medium">{order.client.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{order.client}</p>
                      <p className="text-sm text-muted-foreground">#{order.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={order.statusColor}>{order.status}</Badge>
                    <span className="font-semibold">{order.amount}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen del Día</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Ingresos Hoy</span>
                </div>
                <span className="font-semibold">$150</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Pedidos Hoy</span>
                </div>
                <span className="font-semibold">3</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plan Management section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gestión de Planes</h2>
              <p className="text-muted-foreground">Configura y monitorea los modelos de negocio.</p>
            </div>
            <Button onClick={() => router.push("/planes/nuevo")}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Plan
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Freemium Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Freemium</CardTitle>
                    <CardDescription className="mt-1">Plan básico con funciones limitadas.</CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">Activo</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lavanderías:</span>
                    <span className="font-medium">25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Límite de Órdenes:</span>
                    <span className="font-medium">50/mes</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/planes/configurar/freemium")}
                >
                  Configurar
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Plan */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-primary">Suscripción</CardTitle>
                      <Badge>POPULAR</Badge>
                    </div>
                    <CardDescription className="mt-1">Acceso completo a todas las funciones.</CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Activo</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lavanderías:</span>
                    <span className="font-medium">30</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="font-medium">$49/mes</span>
                  </div>
                </div>
                <Button className="w-full" onClick={() => router.push("/planes/configurar/suscripcion")}>
                  Configurar
                </Button>
              </CardContent>
            </Card>

            {/* Commission Plan */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Comisión</CardTitle>
                    <CardDescription className="mt-1">Modelo basado en % por transacción.</CardDescription>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">En Pruebas</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lavanderías:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Comisión:</span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push("/planes/configurar/comision")}
                >
                  Configurar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
