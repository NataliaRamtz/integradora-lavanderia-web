"use client"

import { useState } from "react"
import { Package, Search, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function ClientOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const orders = [
    {
      id: "12346",
      status: "En Proceso",
      date: "2024-01-16",
      deliveryDate: "2024-01-18",
      total: 50,
      items: ["Lavado Regular x2"],
      lavanderia: "Lavandería Central",
    },
    {
      id: "12342",
      status: "Entregado",
      date: "2024-01-10",
      deliveryDate: "2024-01-12",
      total: 30,
      items: ["Lavado Regular x1"],
      lavanderia: "Quick Wash",
    },
    {
      id: "12338",
      status: "En Proceso",
      date: "2024-01-08",
      deliveryDate: "2024-01-10",
      total: 75,
      items: ["Lavado Premium x2", "Planchado x1"],
      lavanderia: "Lavandería Central",
    },
    {
      id: "12334",
      status: "Entregado",
      date: "2024-01-05",
      deliveryDate: "2024-01-07",
      total: 45,
      items: ["Lavado en Seco x1"],
      lavanderia: "EcoClean",
    },
  ]

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.includes(searchTerm) || order.lavanderia.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
              <Link href="/cliente/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Inicio
              </Link>
              <Link href="/cliente/pedidos" className="text-sm font-medium text-blue-600">
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
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="text-gray-600 mt-1">Gestiona y rastrea todos tus pedidos</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número de pedido o lavandería..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="En Proceso">En Proceso</SelectItem>
                  <SelectItem value="Entregado">Entregado</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                      <CardDescription>{order.lavanderia}</CardDescription>
                    </div>
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Pedido</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Entrega</p>
                    <p className="font-medium">{order.deliveryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-medium text-lg">${order.total}</p>
                  </div>
                  <div className="flex items-end">
                    <Link href={`/cliente/pedidos/${order.id}`} className="w-full">
                      <Button variant="outline" className="w-full bg-transparent">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Servicios:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item, index) => (
                      <Badge key={index} variant="outline">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron pedidos</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
