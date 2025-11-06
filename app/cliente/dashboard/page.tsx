"use client"

import { Package, Clock, CheckCircle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ClientDashboardPage() {
  const recentOrders = [
    {
      id: "12346",
      status: "En Proceso",
      date: "2024-01-16",
      total: 50,
      items: 2,
    },
    {
      id: "12342",
      status: "Entregado",
      date: "2024-01-10",
      total: 30,
      items: 1,
    },
    {
      id: "12338",
      status: "En Proceso",
      date: "2024-01-08",
      total: 75,
      items: 3,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                </svg>
              </div>
              <span className="text-xl font-bold">LaundryPro</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/cliente/dashboard" className="text-sm font-medium text-blue-600">
                Inicio
              </Link>
              <Link href="/cliente/pedidos" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Mis Pedidos
              </Link>
              <Link href="/cliente/nuevo-pedido" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Nuevo Pedido
              </Link>
              <Link href="/cliente/perfil" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Mi Perfil
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Cerrar Sesión
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido de vuelta</h1>
          <p className="text-gray-600 mt-1">Aquí está el resumen de tus pedidos</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pedidos Totales</CardTitle>
              <Package className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-600 mt-1">Todos los tiempos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <p className="text-xs text-gray-600 mt-1">Pedidos activos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">10</div>
              <p className="text-xs text-gray-600 mt-1">Este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Gastado</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$450</div>
              <p className="text-xs text-gray-600 mt-1">Este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardHeader>
              <CardTitle>¿Necesitas lavar tu ropa?</CardTitle>
              <CardDescription className="text-blue-100">Crea un nuevo pedido en minutos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/cliente/nuevo-pedido">
                <Button className="bg-white text-blue-600 hover:bg-blue-50">Crear Nuevo Pedido</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rastrea tus pedidos</CardTitle>
              <CardDescription>Mantente al tanto del estado de tus pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/cliente/pedidos">
                <Button variant="outline">Ver Mis Pedidos</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Recientes</CardTitle>
            <CardDescription>Tus últimos pedidos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">${order.total}</p>
                      <p className="text-sm text-gray-600">{order.items} artículos</p>
                    </div>
                    <Badge
                      variant={order.status === "Entregado" ? "default" : "secondary"}
                      className={
                        order.status === "Entregado"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      }
                    >
                      {order.status}
                    </Badge>
                    <Link href={`/cliente/pedidos/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
