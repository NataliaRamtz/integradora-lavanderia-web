"use client"

import { useState } from "react"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Store, Search } from "lucide-react"

const plans = [
  {
    id: "freemium",
    name: "Freemium",
    description: "Plan básico con funciones limitadas.",
    status: "Activo",
    laundries: 1,
    details: [{ label: "Límite de Órdenes", value: "50/mes" }],
  },
  {
    id: "subscription",
    name: "Suscripción",
    description: "Acceso completo a todas las funciones.",
    status: "Activo",
    popular: true,
    laundries: 2,
    details: [{ label: "Precio", value: "$49/mes" }],
  },
  {
    id: "commission",
    name: "Comisión",
    description: "Modelo basado en % por transacción.",
    status: "En Pruebas",
    laundries: 1,
    details: [{ label: "Comisión", value: "5%" }],
  },
]

const laundries = [
  { id: 1, name: "Lavandería Central", currentPlan: "Freemium", memberSince: "12/05/2023" },
  { id: 2, name: "Lavado Rápido", currentPlan: "Suscripción", memberSince: "01/03/2023" },
  { id: 3, name: "Tu Lavandería Online", currentPlan: "Suscripción", memberSince: "20/08/2023" },
  { id: 4, name: "EcoClean", currentPlan: "Comisión", memberSince: "15/07/2023" },
]

export default function PlanesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Planes</h1>
          <p className="text-muted-foreground">Visualiza, asigna y configura los planes de las lavanderías.</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">Vista General de Planes</TabsTrigger>
            <TabsTrigger value="assignment">Asignación de Planes</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.id} className={plan.popular ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className={plan.popular ? "text-primary" : ""}>{plan.name}</CardTitle>
                          {plan.popular && <Badge>POPULAR</Badge>}
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <Badge
                        variant={plan.status === "Activo" ? "default" : "secondary"}
                        className={
                          plan.status === "Activo" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {plan.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{plan.laundries}</span>
                        <span className="text-muted-foreground">
                          {plan.laundries === 1 ? "lavandería" : "lavanderías"}
                        </span>
                      </div>
                      {plan.id === "subscription" && (
                        <div className="space-y-2 border-t pt-3">
                          {laundries
                            .filter((l) => l.currentPlan === "Suscripción")
                            .map((laundry) => (
                              <div key={laundry.id} className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                                  <Store className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{laundry.name}</p>
                                  <p className="text-xs text-muted-foreground">Miembro desde: {laundry.memberSince}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                      {plan.id === "freemium" && (
                        <div className="space-y-2 border-t pt-3">
                          {laundries
                            .filter((l) => l.currentPlan === "Freemium")
                            .map((laundry) => (
                              <div key={laundry.id} className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                                  <Store className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{laundry.name}</p>
                                  <p className="text-xs text-muted-foreground">Miembro desde: {laundry.memberSince}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                      {plan.id === "commission" && (
                        <div className="space-y-2 border-t pt-3">
                          {laundries
                            .filter((l) => l.currentPlan === "Comisión")
                            .map((laundry) => (
                              <div key={laundry.id} className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                                  <Store className="h-4 w-4 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{laundry.name}</p>
                                  <p className="text-xs text-muted-foreground">Miembro desde: {laundry.memberSince}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                      Editar Detalles del Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assignment" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar lavandería..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Asignación de Planes</CardTitle>
                <CardDescription>Asigna lavanderías a planes y edita sus detalles.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 border-b pb-3 text-sm font-medium text-muted-foreground">
                    <div>LAVANDERÍA</div>
                    <div>PLAN ACTUAL</div>
                    <div>NUEVO PLAN</div>
                    <div>ACCIÓN</div>
                  </div>

                  {laundries.map((laundry) => (
                    <div key={laundry.id} className="grid grid-cols-4 items-center gap-4 border-b pb-4 last:border-0">
                      <div className="font-medium">{laundry.name}</div>
                      <div>
                        <Badge
                          variant="secondary"
                          className={
                            laundry.currentPlan === "Suscripción"
                              ? "bg-green-100 text-green-700"
                              : laundry.currentPlan === "Freemium"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {laundry.currentPlan}
                        </Badge>
                      </div>
                      <div>
                        <Select defaultValue={laundry.currentPlan.toLowerCase()}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="suscripción">Suscripción</SelectItem>
                            <SelectItem value="freemium">Freemium</SelectItem>
                            <SelectItem value="comisión">Comisión</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Button size="sm">Asignar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
