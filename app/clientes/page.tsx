"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layouts/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Mail, Phone } from "lucide-react"

export default function ClientesPage() {
  const router = useRouter()

  const [clients, setClients] = useState([
    {
      id: 1,
      name: "Carlos Mendoza",
      email: "carlos@email.com",
      phone: "+1234567890",
      orders: 15,
      totalSpent: "$750",
    },
    {
      id: 2,
      name: "Elena Ramirez",
      email: "elena@email.com",
      phone: "+1234567891",
      orders: 8,
      totalSpent: "$400",
    },
    {
      id: 3,
      name: "Diego Silva",
      email: "diego@email.com",
      phone: "+1234567892",
      orders: 22,
      totalSpent: "$1,100",
    },
    {
      id: 4,
      name: "Isabella Torres",
      email: "isabella@email.com",
      phone: "+1234567893",
      orders: 12,
      totalSpent: "$600",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm),
  )

  return (
    <MainLayout title="Clientes" subtitle="Gestiona la información de tus clientes">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente por nombre, email o teléfono..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Clients Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <span className="text-lg font-semibold">{client.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.orders} pedidos</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{client.phone}</span>
                  </div>
                </div>

                <div className="mb-4 rounded-lg bg-muted p-3">
                  <p className="text-sm text-muted-foreground">Total gastado</p>
                  <p className="text-xl font-bold text-foreground">{client.totalSpent}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.push(`/clientes/${client.id}`)}
                  >
                    Ver Historial
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
