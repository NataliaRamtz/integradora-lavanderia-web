"use client"

import { useState } from "react"
import LaundryLayout from "@/components/layouts/laundry-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Clock, CheckCircle, DollarSign } from "lucide-react"
import Link from "next/link"

export default function LaundryDashboardPage() {
  const [orders] = useState([
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
      id: "12342",
      cliente: "Diego Silva",
      telefono: "+1234567892",
      entrega: "2024-01-10",
      estado: "Entregado",
      servicios: ["Lavado Regular x2"],
      total: 30,
    },
  ])

  const stats = {
    pendientes: orders.filter((o) => o.estado === "En Espera").length,
    enProceso: orders.filter((o) => o.estado === "En Proceso").length,
    completados: orders.filter((o) => o.estado === "Entregado").length,
    ingresosHoy: 150,
  }

  return (
    <LaundryLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Clean & Fresh Laundry</h1>
          <p className="text-muted-foreground">Panel de control de tu lavandería</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendientes}</div>
              <p className="text-xs text-muted-foreground">Esperando procesamiento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enProceso}</div>
              <p className="text-xs text-muted-foreground">Siendo procesados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completados}</div>
              <p className="text-xs text-muted-foreground">Listos para entrega</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.ingresosHoy}</div>
              <p className="text-xs text-muted-foreground">+12% vs ayer</p>
            </CardContent>
          </Card>
        </div>

        {/* Pedidos Pendientes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pedidos Pendientes</CardTitle>
                <CardDescription>Pedidos que requieren tu atención</CardDescription>
              </div>
              <Link href="/lavanderia/pedidos">
                <Button variant="outline">Ver Todos</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders
                .filter((order) => order.estado === "En Espera")
                .map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">#{order.id}</p>
                        <Badge variant="secondary">{order.estado}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Cliente: {order.cliente}</p>
                      <p className="text-sm text-muted-foreground">Recepción: {order.recepcion}</p>
                      <p className="text-sm">Servicios: {order.servicios.join(", ")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-lg font-bold">${order.total}</p>
                      <Link href={`/lavanderia/pedidos/${order.id}`}>
                        <Button size="sm">Procesar</Button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Pedidos en Proceso */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos en Proceso</CardTitle>
            <CardDescription>Pedidos que están siendo procesados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders
                .filter((order) => order.estado === "En Proceso")
                .map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">#{order.id}</p>
                        <Badge className="bg-yellow-500">{order.estado}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Cliente: {order.cliente}</p>
                      <p className="text-sm text-muted-foreground">Recepción: {order.recepcion}</p>
                      <p className="text-sm">Servicios: {order.servicios.join(", ")}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-lg font-bold">${order.total}</p>
                      <Link href={`/lavanderia/pedidos/${order.id}`}>
                        <Button size="sm" variant="outline">
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </LaundryLayout>
  )
}
