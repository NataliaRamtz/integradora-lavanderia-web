"use client"

import type React from "react"

import { useState } from "react"
import LaundryLayout from "@/components/layouts/laundry-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Mail, Phone, MapPin, Building, User } from "lucide-react"

export default function LaundryProfilePage() {
  const [formData, setFormData] = useState({
    name: "Laura García",
    email: "encargado@cleanfresh.com",
    phone: "+52 123 456 7890",
    laundry: "Clean & Fresh Laundry",
    address: "Av. Principal 456, Ciudad",
  })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log("[v0] Laundry profile update:", formData)
  }

  return (
    <LaundryLayout headerTitle="Mi Perfil" headerSubtitle="Gestiona tu información como encargado">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>Actualiza tu foto de perfil para que el resto del equipo pueda reconocerte.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="text-2xl">LG</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Camera className="w-4 h-4" />
                  Cambiar Foto
                </Button>
                <p className="text-sm text-muted-foreground">Formatos permitidos: JPG, PNG o GIF. Máximo 2MB.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Estos datos se utilizan dentro del panel de la lavandería.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nombre Completo
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Teléfono de Contacto
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laundry" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Lavandería
                  </Label>
                  <Input id="laundry" value={formData.laundry} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Dirección
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <Card>
          <CardHeader>
            <CardTitle>Actualizar Contraseña</CardTitle>
            <CardDescription>Utiliza una contraseña segura para proteger el acceso a la lavandería.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button>Actualizar Contraseña</Button>
          </CardContent>
        </Card>
      </div>
    </LaundryLayout>
  )
}

