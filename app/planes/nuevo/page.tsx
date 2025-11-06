"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

export default function NuevoPlanPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    precio: "",
    limiteOrdenes: "",
    comision: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Creating new plan:", formData)
    alert("Plan creado exitosamente")
    router.push("/dashboard")
  }

  return (
    <MainLayout title="Crear Nuevo Plan">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Plan</CardTitle>
            <CardDescription>Completa los detalles del nuevo plan de suscripción</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre del Plan</Label>
                  <Input
                    id="nombre"
                    placeholder="ej. Premium, Básico"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Plan</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freemium">Freemium</SelectItem>
                      <SelectItem value="suscripcion">Suscripción</SelectItem>
                      <SelectItem value="comision">Comisión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe las características del plan"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio Mensual ($)</Label>
                  <Input
                    id="precio"
                    type="number"
                    placeholder="49.00"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="limiteOrdenes">Límite de Órdenes/Mes</Label>
                  <Input
                    id="limiteOrdenes"
                    type="number"
                    placeholder="100"
                    value={formData.limiteOrdenes}
                    onChange={(e) => setFormData({ ...formData, limiteOrdenes: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comision">Comisión (%)</Label>
                  <Input
                    id="comision"
                    type="number"
                    placeholder="5"
                    value={formData.comision}
                    onChange={(e) => setFormData({ ...formData, comision: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Crear Plan
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
