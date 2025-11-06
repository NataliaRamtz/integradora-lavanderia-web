"use client"

import { ArrowLeft, Package, MapPin, Calendar, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function ClientOrderDetailPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    status: "En Proceso",
    date: "2024-01-16",
    pickupDate: "2024-01-16",
    deliveryDate: "2024-01-18",
    total: 50,
    lavanderia: "Lavandería Central",
    address: "Calle Principal 123, Ciudad",
    services: [
      { name: "Lavado Regular", quantity: 2, price: 15, total: 30 },
      { name: "Planchado", quantity: 1, price: 20, total: 20 },
    ],
    timeline: [
      { status: "Pedido Creado", date: "2024-01-16 10:00 AM", completed: true },
      { status: "Recolectado", date: "2024-01-16 02:00 PM", completed: true },
      { status: "En Proceso", date: "2024-01-17 09:00 AM", completed: true },
      { status: "Listo para Entrega", date: "Pendiente", completed: false },
      { status: "Entregado", date: "Pendiente", completed: false },
    ],
  }

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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cliente/pedidos"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis pedidos
        </Link>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.id}</h1>
            <p className="text-gray-600 mt-1">{order.lavanderia}</p>
          </div>
          <Badge className={order.status === "Entregado" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}>
            {order.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Pedido</CardTitle>
                <CardDescription>Seguimiento en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.completed ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        {index < order.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 ${item.completed ? "bg-green-200" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className={`font-medium ${item.completed ? "text-gray-900" : "text-gray-400"}`}>
                          {item.status}
                        </p>
                        <p className="text-sm text-gray-600">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Servicios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">
                          {service.quantity} x ${service.price}
                        </p>
                      </div>
                      <p className="font-medium">${service.total}</p>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <p className="font-bold">Total</p>
                      <p className="text-2xl font-bold text-blue-600">${order.total}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fechas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Pedido</p>
                    <p className="font-medium">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Recolección</p>
                    <p className="font-medium">{order.pickupDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Entrega Estimada</p>
                    <p className="font-medium">{order.deliveryDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dirección</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                  <p className="text-sm">{order.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-4">¿Necesitas ayuda con tu pedido?</p>
                <Button className="w-full bg-transparent" variant="outline">
                  Contactar Soporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
