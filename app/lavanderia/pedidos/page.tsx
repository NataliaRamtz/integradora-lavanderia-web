"use client"

import { useState } from "react"
import LaundryLayout from "@/components/laundry-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import Link from "next/link"

export default function LaundryOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")

  const [orders, setOrders] = useState([
    {
      id: "12346",
      cliente: "Carlos Mendoza",
      telefono: "+1234567890",
      recepcion: "2024-01-16",
      estado: "En Espera",
      servicios: ["Lavado Regular x2", "Planchado x1"],
      total: 50,
    },
    {
      id: "12345",
      cliente: "Elena Ramirez",
      telefono: "+1234567891",
      recepcion: "2024-01-15",
      estado: "En Proceso",
      servicios: ["Lavado Regular x2"],
      total: 30,
    },
    {
      id: "12344",
      cliente: "María González",
      telefono: "+1234567893",
      recepcion: "2024-01-14",
      estado: "Listo",
      servicios: ["Lavado Premium x1"],
      total: 80,
    },
    {
      id: "12343",
      cliente: "Isabella Torres",
      telefono: "+1234567894",
      entrega: "2024-01-11",
      estado: "Entregado",
      servicios: ["Lavado Regular x2"],
      total: 30,
    },
    {
      id: "12342",
      cliente: "Diego Silva",
      telefono: "+1234567892",
      entrega: "2024-01-10",
      estado: "Entregado",
      servicios: ["Lavado Regular x2"],
      total: 30,
    },
  ])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "todos" || order.estado === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Espera":
        return "bg-blue-500"
      case "En Proceso":
        return "bg-yellow-500"
      case "Listo":
        return "bg-green-500"
      case "Entregado":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <LaundryLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra todos los pedidos de tu lavandería</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número de pedido o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="En Espera">En Espera</SelectItem>
              <SelectItem value="En Proceso">En Proceso</SelectItem>
              <SelectItem value="Listo">Listo</SelectItem>
              <SelectItem value="Entregado">Entregado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                      <Badge className={getStatusColor(order.estado)}>{order.estado}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium">Cliente:</span> {order.cliente}
                      </p>
                      <p>
                        <span className="font-medium">Teléfono:</span> {order.telefono}
                      </p>
                      <p>
                        <span className="font-medium">{order.estado === "Entregado" ? "Entrega:" : "Recepción:"}</span>{" "}
                        {order.entrega || order.recepcion}
                      </p>
                      <p>
                        <span className="font-medium">Total:</span> ${order.total}
                      </p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Servicios:</span> {order.servicios.join(", ")}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Link href={`/lavanderia/pedidos/${order.id}`}>
                      <Button size="sm" className="w-full">
                        Ver Detalles
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No se encontraron pedidos con los filtros seleccionados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </LaundryLayout>
  )
}
