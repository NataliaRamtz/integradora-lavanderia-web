"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, Package } from "lucide-react"
import MainLayout from "@/components/layouts/main-layout"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Mock data - in real app, fetch based on params.id
  const order = {
    id: params.id,
    status: "En Proceso",
    statusColor: "bg-yellow-100 text-yellow-800",
    client: {
      name: "Carlos Mendoza",
      phone: "+1234567890",
      email: "carlos@email.com",
      address: "Calle Principal 123, Ciudad",
    },
    dates: {
      received: "2024-01-16",
      estimated: "2024-01-18",
    },
    services: [
      { name: "Lavado Regular", quantity: "2 kg", price: 30 },
      { name: "Planchado", quantity: "3 piezas", price: 20 },
    ],
    payment: {
      subtotal: 50,
      tax: 2.5,
      total: 52.5,
      method: "Efectivo",
      status: "Pendiente",
    },
    notes: "Cliente solicita entrega antes de las 5 PM",
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Pedido #{order.id}</h1>
              <p className="text-muted-foreground">Detalles completos del pedido</p>
            </div>
          </div>
          <Badge className={order.statusColor}>{order.status}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">{order.client.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{order.client.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{order.client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{order.client.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Servicios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.services.map((service, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-muted-foreground">{service.quantity}</p>
                        </div>
                        <p className="font-medium">${service.price.toFixed(2)}</p>
                      </div>
                      {index < order.services.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Fechas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recepción</p>
                  <p className="font-medium">{order.dates.received}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Entrega Estimada</p>
                  <p className="font-medium">{order.dates.estimated}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.payment.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IVA (5%)</span>
                    <span>${order.payment.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">${order.payment.total.toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Método de Pago</span>
                    <span className="font-medium">{order.payment.method}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estado</span>
                    <Badge variant="outline" className="text-yellow-600">
                      {order.payment.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button className="w-full">Actualizar Estado</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Imprimir Ticket
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 bg-transparent">
                  Cancelar Pedido
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
