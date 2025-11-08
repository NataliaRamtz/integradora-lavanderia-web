"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import LaundryLayout from "@/components/layouts/laundry-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function LaundryOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState({
    id: orderId,
    cliente: "Carlos Mendoza",
    telefono: "+1234567890",
    email: "carlos@email.com",
    direccion: "Calle Principal 123, Ciudad",
    recepcion: "2024-01-16",
    entregaEstimada: "2024-01-18",
    estado: "En Espera",
    servicios: [
      { nombre: "Lavado Regular", cantidad: 2, precio: 15, total: 30 },
      { nombre: "Planchado", cantidad: 1, precio: 20, total: 20 },
    ],
    subtotal: 50,
    iva: 2.5,
    total: 52.5,
    notas: "Cliente prefiere detergente sin fragancia",
  })

  const handleStatusChange = (newStatus: string) => {
    setOrder({ ...order, estado: newStatus })
  }

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
        <div className="flex items-center gap-4">
          <Link href="/lavanderia/pedidos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Pedido #{order.id}</h1>
            <p className="text-muted-foreground">Detalles completos del pedido</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Status */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Estado del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(order.estado)}>{order.estado}</Badge>
                <Select value={order.estado} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En Espera">En Espera</SelectItem>
                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                    <SelectItem value="Listo">Listo</SelectItem>
                    <SelectItem value="Entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Recepción</p>
                  <p className="font-medium">{order.recepcion}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entrega Estimada</p>
                  <p className="font-medium">{order.entregaEstimada}</p>
                </div>
              </div>

              {order.notas && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Notas del Cliente</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{order.notas}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold text-lg">{order.cliente}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{order.direccion}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Servicio</th>
                    <th className="text-center py-2">Cantidad</th>
                    <th className="text-right py-2">Precio</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.servicios.map((servicio, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{servicio.nombre}</td>
                      <td className="text-center py-3">{servicio.cantidad}</td>
                      <td className="text-right py-3">${servicio.precio}</td>
                      <td className="text-right py-3">${servicio.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (5%)</span>
                  <span>${order.iva}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-blue-600">${order.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button className="flex-1" onClick={() => handleStatusChange("En Proceso")}>
            Iniciar Proceso
          </Button>
          <Button className="flex-1 bg-transparent" variant="outline" onClick={() => handleStatusChange("Listo")}>
            Marcar como Listo
          </Button>
          <Button className="flex-1 bg-transparent" variant="outline" onClick={() => handleStatusChange("Entregado")}>
            Marcar como Entregado
          </Button>
        </div>
      </div>
    </LaundryLayout>
  )
}
