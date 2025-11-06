"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Store, Users, TrendingUp } from "lucide-react"

const initialLaundromats = [
  {
    name: "Lavandería Central",
    address: "Calle Principal, 123, Ciudad",
    plan: "Suscripción",
    planColor: "bg-blue-100 text-blue-700",
    status: "Activa",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    name: "Lavandería Norte",
    address: "Avenida del Norte, 456, Ciudad",
    plan: "Freemium",
    planColor: "bg-purple-100 text-purple-700",
    status: "Inactiva",
    statusColor: "bg-red-100 text-red-700",
  },
  {
    name: "Lavandería Sur",
    address: "Calle del Sur, 789, Ciudad",
    plan: "Comisiones",
    planColor: "bg-green-100 text-green-700",
    status: "Activa",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    name: "Lavandería Este",
    address: "Avenida del Este, 101, Ciudad",
    plan: "Suscripción",
    planColor: "bg-blue-100 text-blue-700",
    status: "Activa",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    name: "Lavandería Oeste",
    address: "Calle del Oeste, 202, Ciudad",
    plan: "Freemium",
    planColor: "bg-purple-100 text-purple-700",
    status: "Inactiva",
    statusColor: "bg-red-100 text-red-700",
  },
]

const laundromatCards = [
  {
    id: 1,
    name: "Clean & Fresh Laundry",
    email: "info@cleanfresh.com",
    address: "123 Main St, City",
    phone: "+1234567890",
    plan: "premium",
    planColor: "bg-purple-100 text-purple-700",
    operators: 3,
    ordersPerMonth: 245,
    status: "Activa",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    name: "Quick Wash",
    email: "contact@quickwash.com",
    address: "456 Oak Ave, City",
    phone: "+1234567891",
    plan: "freemium",
    planColor: "bg-blue-100 text-blue-700",
    operators: 1,
    ordersPerMonth: 89,
    status: "Activa",
    statusColor: "bg-green-100 text-green-700",
  },
]

export default function LavanderiasPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLaundromats = initialLaundromats.filter(
    (laundromat) =>
      laundromat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laundromat.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredCards = laundromatCards.filter(
    (laundromat) =>
      laundromat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laundromat.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <MainLayout title="Lavanderías" subtitle="Administra todas las lavanderías registradas en la plataforma">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar lavandería por nombre, dirección..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="gap-2" onClick={() => router.push("/lavanderias/nueva")}>
            <Plus className="h-4 w-4" />
            Añadir lavandería
          </Button>
        </div>

        {/* Table View */}
        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLaundromats.map((laundromat, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{laundromat.name}</TableCell>
                    <TableCell className="text-muted-foreground">{laundromat.address}</TableCell>
                    <TableCell>
                      <Badge className={laundromat.planColor}>{laundromat.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${laundromat.status === "Activa" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span className="text-sm">{laundromat.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="link"
                        className="text-primary"
                        onClick={() => router.push(`/lavanderias/${index + 1}`)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card View */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Gestión de Lavanderías</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Administra todas las lavanderías registradas en la plataforma
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredCards.map((laundromat) => (
              <Card key={laundromat.id}>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                        <Store className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{laundromat.name}</h3>
                        <p className="text-sm text-muted-foreground">{laundromat.email}</p>
                      </div>
                    </div>
                    <Badge className={laundromat.planColor}>{laundromat.plan}</Badge>
                  </div>

                  <div className="mb-4 space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Dirección:</span> {laundromat.address}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Teléfono:</span> {laundromat.phone}
                    </p>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-muted p-3">
                      <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-xs">Operadores</span>
                      </div>
                      <p className="text-xl font-bold">{laundromat.operators}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <div className="mb-1 flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-xs">Pedidos/mes</span>
                      </div>
                      <p className="text-xl font-bold">{laundromat.ordersPerMonth}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={laundromat.statusColor}>{laundromat.status}</Badge>
                    <Button
                      variant="link"
                      className="text-primary"
                      onClick={() => router.push(`/lavanderias/${laundromat.id}`)}
                    >
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
