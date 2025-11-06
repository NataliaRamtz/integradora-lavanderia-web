"use client"

import { useState } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus } from "lucide-react"

export default function ServiciosPage() {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Lavado y Doblado",
      description: "Servicio estándar de lavado y doblado para la ropa de diario.",
      price: "1,50 $/lb",
      status: "Activo",
    },
    {
      id: 2,
      name: "Lavado en Seco",
      description: "Limpieza profesional en seco para prendas delicadas.",
      price: "15,00 $/artículo",
      status: "Activo",
    },
    {
      id: 3,
      name: "Planchado",
      description: "Servicio de planchado para camisas, pantalones y otras prendas.",
      price: "5,00 $/artículo",
      status: "Activo",
    },
    {
      id: 4,
      name: "Cuidado Especial",
      description: "Limpieza especializada para artículos como edredones y alfombras.",
      price: "25,00 $/artículo",
      status: "Activo",
    },
    {
      id: 5,
      name: "Servicio Exprés",
      description: "Servicio de entrega rápida para necesidades urgentes de lavandería.",
      price: "2,00 $/lb",
      status: "Activo",
    },
  ])

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
  })

  const handleAddService = () => {
    if (newService.name && newService.description && newService.price) {
      setServices([
        ...services,
        {
          id: services.length + 1,
          ...newService,
          status: "Activo",
        },
      ])
      setNewService({ name: "", description: "", price: "" })
    }
  }

  const handleDeleteService = (id: number) => {
    setServices(services.filter((service) => service.id !== id))
  }

  return (
    <MainLayout
      title="Catálogo de Servicios"
      subtitle="Gestione y actualice las ofertas de servicios de lavandería, incluidos los precios y las descripciones."
    >
      <div className="space-y-6">
        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios Actuales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">NOMBRE DEL SERVICIO</TableHead>
                  <TableHead>DESCRIPCIÓN</TableHead>
                  <TableHead className="w-[150px]">PRECIO</TableHead>
                  <TableHead className="w-[120px]">ACCIONES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="text-muted-foreground">{service.description}</TableCell>
                    <TableCell className="font-semibold">{service.price}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add New Service */}
        <Card>
          <CardHeader>
            <CardTitle>Añadir Nuevo Servicio</CardTitle>
            <p className="text-sm text-muted-foreground">Cree un nuevo servicio para ofrecer a sus clientes.</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Servicio</label>
                <Input
                  placeholder="p. ej., Lavado Premium"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Precio</label>
                <Input
                  placeholder="p. ej., 2,50 $/lb o 20,00 $/artículo"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Descripción</label>
                <Textarea
                  placeholder="Proporcione una breve descripción del servicio."
                  rows={4}
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="gap-2" onClick={handleAddService}>
                <Plus className="h-4 w-4" />
                Añadir Servicio
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Cards View */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Vista de Servicios</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-lg font-semibold">Lavado Regular</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">Lavado estándar con detergente básico</p>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precio:</span>
                  <span className="text-lg font-bold">$50</span>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tiempo estimado:</span>
                  <span className="font-medium">2h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <Badge className="bg-green-100 text-green-700">Activo</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-lg font-semibold">Lavado Premium</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Lavado estándar con detergente premium y suavizante.
                </p>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precio:</span>
                  <span className="text-lg font-bold">$80</span>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tiempo estimado:</span>
                  <span className="font-medium">3h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <Badge className="bg-green-100 text-green-700">Activo</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-lg font-semibold">Planchado</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">Servicio de planchado profesional</p>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Precio:</span>
                  <span className="text-lg font-bold">$20</span>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tiempo estimado:</span>
                  <span className="font-medium">1h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado:</span>
                  <Badge className="bg-green-100 text-green-700">Activo</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
