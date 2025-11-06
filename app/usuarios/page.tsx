"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Mail, Phone } from "lucide-react"
import MainLayout from "@/components/main-layout"
import { useState } from "react"
import { useRouter } from "next/navigation"

const users = [
  {
    id: 1,
    name: "Carlos Mendoza",
    email: "carlos@example.com",
    phone: "+1234567890",
    role: "Operador",
    laundry: "Lavandería Central",
    status: "Activo",
    avatar: "/abstract-geometric-shapes.png",
  },
  {
    id: 2,
    name: "Elena Ramirez",
    email: "elena@example.com",
    phone: "+1234567891",
    role: "Administrador",
    laundry: "Lavado Rápido",
    status: "Activo",
    avatar: "/abstract-geometric-shapes.png",
  },
  {
    id: 3,
    name: "Diego Silva",
    email: "diego@example.com",
    phone: "+1234567892",
    role: "Operador",
    laundry: "EcoClean",
    status: "Inactivo",
    avatar: "/abstract-geometric-shapes.png",
  },
  {
    id: 4,
    name: "Sofia Vargas",
    email: "sofia@example.com",
    phone: "+1234567893",
    role: "Operador",
    laundry: "Quick Wash",
    status: "Activo",
    avatar: "/abstract-geometric-shapes.png",
  },
]

export default function UsuariosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
            <p className="text-muted-foreground">Gestiona los usuarios de la plataforma.</p>
          </div>
          <Button onClick={() => router.push("/usuarios/nuevo")}>
            <Plus className="mr-2 h-4 w-4" />
            Añadir Usuario
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar usuario por nombre, email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription>{user.role}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={user.status === "Activo" ? "default" : "secondary"}>{user.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground">Lavandería asignada:</p>
                  <p className="font-medium">{user.laundry}</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push(`/usuarios/${user.id}`)}
                >
                  Editar Usuario
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
