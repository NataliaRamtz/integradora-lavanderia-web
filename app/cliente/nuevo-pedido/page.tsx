"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewClientOrderPage() {
  const router = useRouter()
  const [selectedLaundry, setSelectedLaundry] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [services, setServices] = useState([
    { id: 1, name: "Lavado Regular", price: 15, quantity: 0 },
    { id: 2, name: "Lavado Premium", price: 25, quantity: 0 },
    { id: 3, name: "Lavado en Seco", price: 20, quantity: 0 },
    { id: 4, name: "Planchado", price: 10, quantity: 0 },
  ])

  const updateQuantity = (id: number, delta: number) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, quantity: Math.max(0, service.quantity + delta) } : service,
      ),
    )
  }

  const total = services.reduce((sum, service) => sum + service.price * service.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] New order created:", { selectedLaundry, pickupDate, deliveryDate, address, services, total })
    alert("Pedido creado exitosamente!")
    router.push("/cliente/pedidos")
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
              <Link href="/cliente/pedidos" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Mis Pedidos
              </Link>
              <Link href="/cliente/nuevo-pedido" className="text-sm font-medium text-blue-600">
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cliente/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Pedido</h1>
          <p className="text-gray-600 mt-1">Completa los detalles de tu pedido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Laundry Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Selecciona una Lavandería</CardTitle>
              <CardDescription>Elige la lavandería de tu preferencia</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedLaundry} onValueChange={setSelectedLaundry} required>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar lavandería" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="central">Lavandería Central</SelectItem>
                  <SelectItem value="quick">Quick Wash</SelectItem>
                  <SelectItem value="eco">EcoClean</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Fechas</CardTitle>
              <CardDescription>Selecciona las fechas de recolección y entrega</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup">Fecha de Recolección</Label>
                  <Input
                    id="pickup"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery">Fecha de Entrega</Label>
                  <Input
                    id="delivery"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle>Dirección</CardTitle>
              <CardDescription>Dirección de recolección y entrega</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ingresa tu dirección completa..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle>Servicios</CardTitle>
              <CardDescription>Selecciona los servicios que necesitas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">${service.price} por unidad</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(service.id, -1)}
                        disabled={service.quantity === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{service.quantity}</span>
                      <Button type="button" variant="outline" size="icon" onClick={() => updateQuantity(service.id, 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notas Adicionales</CardTitle>
              <CardDescription>Instrucciones especiales para tu pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ej: Cuidado especial con prendas delicadas..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Total */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total a Pagar</p>
                  <p className="text-3xl font-bold text-blue-600">${total}</p>
                </div>
                <Button type="submit" size="lg" disabled={total === 0}>
                  Crear Pedido
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
}
