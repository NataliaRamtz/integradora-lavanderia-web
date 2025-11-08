"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import Link from "next/link"

export default function PedidosPage() {
  const router = useRouter()

  const [orders, setOrders] = useState([
    {
      id: "FL001",
      client: "Andrea Garcia",
      phone: "+1234567890",
      email: "andrea@email.com",
      estimatedDate: "30/09/2025 07:30 pm",
      services: [
        { name: "Lavado Regular", quantity: "x2", price: "$30" },
        { name: "Planchado", quantity: "x1", price: "$20" },
      ],
      total: "$50",
      status: "En Proceso",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      id: "FL002",
      client: "Andrea Garcia",
      phone: "+1234567890",
      email: "andrea@email.com",
      estimatedDate: "30/09/2025 07:30 pm",
      services: [{ name: "Lavado Regular", quantity: "x2", price: "$30" }],
      total: "$50",
      status: "Listo",
      statusColor: "bg-green-100 text-green-700",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const handleStatusChange = (index: number, newStatus: string) => {
    const statusColors: Record<string, string> = {
      "En Proceso": "bg-blue-100 text-blue-700",
      Listo: "bg-green-100 text-green-700",
      Entregado: "bg-purple-100 text-purple-700",
      Retrasado: "bg-red-100 text-red-700",
    }

    setOrders(
      orders.map((order, i) =>
        i === index ? { ...order, status: newStatus, statusColor: statusColors[newStatus] } : order,
      ),
    )
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <MainLayout title="Gestión de Pedidos" subtitle="Administra todos los pedidos de la lavandería">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente, teléfono o código..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/pedidos/nuevo">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Pedido
            </Button>
          </Link>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{order.client}</h3>
                    <p className="text-sm text-muted-foreground">#{order.id}</p>
                  </div>
                  <Badge className={order.statusColor}>{order.status}</Badge>
                </div>

                <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span className="text-foreground">📞</span>
                    {order.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-foreground">✉️</span>
                    {order.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-foreground">📅</span>
                    Estimado: {order.estimatedDate}
                  </p>
                </div>

                <div className="mb-4 border-t border-border pt-4">
                  <p className="mb-2 text-sm font-medium">Servicios:</p>
                  {order.services.map((service, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {service.name} {service.quantity}
                      </span>
                      <span className="font-medium">{service.price}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-lg font-bold">{order.total}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={order.status} onValueChange={(value) => handleStatusChange(index, value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En Proceso">En Proceso</SelectItem>
                      <SelectItem value="Listo">Listo</SelectItem>
                      <SelectItem value="Entregado">Entregado</SelectItem>
                      <SelectItem value="Retrasado">Retrasado</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/pedidos/${order.id}`)}>
                    Ver Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
