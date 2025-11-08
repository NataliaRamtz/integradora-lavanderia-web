"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import MainLayout from "@/components/layouts/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react"

const tickets = [
  {
    id: "TKT-001",
    title: "Problema con el pago",
    description: "El cliente reporta que no puede completar el pago con tarjeta.",
    status: "Abierto",
    priority: "Alta",
    laundry: "Lavandería Central",
    createdAt: "2024-01-15",
    assignedTo: "Carlos Mendoza",
  },
  {
    id: "TKT-002",
    title: "Pedido no entregado",
    description: "El pedido #12345 no fue entregado en la fecha prometida.",
    status: "En Proceso",
    priority: "Media",
    laundry: "Lavado Rápido",
    createdAt: "2024-01-14",
    assignedTo: "Elena Ramirez",
  },
  {
    id: "TKT-003",
    title: "Consulta sobre servicios",
    description: "Cliente pregunta sobre disponibilidad de servicio express.",
    status: "Resuelto",
    priority: "Baja",
    laundry: "EcoClean",
    createdAt: "2024-01-13",
    assignedTo: "Diego Silva",
  },
  {
    id: "TKT-004",
    title: "Error en la factura",
    description: "La factura muestra un monto incorrecto.",
    status: "Abierto",
    priority: "Alta",
    laundry: "Quick Wash",
    createdAt: "2024-01-15",
    assignedTo: "Sofia Vargas",
  },
]

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tickets</h1>
            <p className="text-muted-foreground">Gestiona los tickets de soporte de la plataforma.</p>
          </div>
          <Button onClick={() => router.push("/tickets/nuevo")}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Ticket
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar ticket por ID, título..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6">
          {tickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{ticket.title}</CardTitle>
                      <Badge variant="outline" className="font-mono text-xs">
                        {ticket.id}
                      </Badge>
                    </div>
                    <CardDescription>{ticket.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        ticket.status === "Resuelto"
                          ? "default"
                          : ticket.status === "En Proceso"
                            ? "secondary"
                            : "outline"
                      }
                      className={
                        ticket.status === "Resuelto"
                          ? "bg-green-100 text-green-700"
                          : ticket.status === "En Proceso"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                      }
                    >
                      {ticket.status === "Resuelto" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {ticket.status === "En Proceso" && <Clock className="mr-1 h-3 w-3" />}
                      {ticket.status === "Abierto" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {ticket.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        ticket.priority === "Alta"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : ticket.priority === "Media"
                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                            : "border-gray-200 bg-gray-50 text-gray-700"
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Lavandería:</span> {ticket.laundry}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Asignado a:</span> {ticket.assignedTo}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Creado:</span> {ticket.createdAt}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                    Ver Detalles
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
