"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft } from "lucide-react"

export default function ConfigurarPlanPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id as string

  const [formData, setFormData] = useState({
    nombre: planId.charAt(0).toUpperCase() + planId.slice(1),
    descripcion: "",
    precio: "",
    limiteOrdenes: "",
    activo: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Configuring plan:", formData)
    alert("Plan configurado exitosamente")
    router.push("/dashboard")
  }

  return (
    <MainLayout title={`Configurar Plan ${formData.nombre}`}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración del Plan</CardTitle>
            <CardDescription>Ajusta los parámetros del plan {formData.nombre}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Plan</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe las características del plan"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
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
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Estado del Plan</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.activo ? "El plan está activo" : "El plan está inactivo"}
                  </p>
                </div>
                <Switch
                  checked={formData.activo}
                  onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Guardar Cambios
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
