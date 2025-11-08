"use client"

import { useRouter } from "next/navigation"
import { LaundryLayout } from "@/components/layouts/laundry-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"

export default function LavanderiaConfiguracionPage() {
  const router = useRouter()

  return (
    <LaundryLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/lavanderia/dashboard")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground">Administra la configuración de tu lavandería.</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Lavandería</CardTitle>
              <CardDescription>Actualiza los detalles de tu negocio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="laundry-name">Nombre de la Lavandería</Label>
                <Input id="laundry-name" defaultValue="Clean & Fresh Laundry" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laundry-email">Email de Contacto</Label>
                <Input id="laundry-email" type="email" defaultValue="lavanderia@cleanfresh.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laundry-phone">Teléfono</Label>
                <Input id="laundry-phone" type="tel" defaultValue="+1234567890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laundry-address">Dirección</Label>
                <Input id="laundry-address" defaultValue="123 Main St, City" />
              </div>
              <Button>Guardar Cambios</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
              <CardDescription>Configura tus preferencias de notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificaciones de Nuevos Pedidos</Label>
                  <p className="text-sm text-muted-foreground">Recibe alertas cuando lleguen nuevos pedidos.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Recordatorios de Entrega</Label>
                  <p className="text-sm text-muted-foreground">Alertas para pedidos próximos a entregar.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Cambia tu contraseña de acceso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contraseña Actual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Cambiar Contraseña</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </LaundryLayout>
  )
}
