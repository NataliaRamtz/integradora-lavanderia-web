"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Mail, Phone, Users as UsersIcon, ShieldCheck, Activity, Eye, PieChart } from "lucide-react"
import MainLayout from "@/components/layouts/main-layout"

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
    lastAccess: "2024-11-10 09:34",
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
    lastAccess: "2024-11-09 19:20",
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
    lastAccess: "2024-10-28 14:02",
  },
  {
    id: 4,
    name: "Sofia Vargas",
    email: "sofia@example.com",
    phone: "+1234567893",
    role: "Supervisor",
    laundry: "Quick Wash",
    status: "Activo",
    avatar: "/abstract-geometric-shapes.png",
    lastAccess: "2024-11-10 07:51",
  },
  {
    id: 5,
    name: "Andrea Torres",
    email: "andrea@example.com",
    phone: "+1234567894",
    role: "Operador",
    laundry: "Clean & Fresh",
    status: "Pendiente",
    avatar: "/abstract-geometric-shapes.png",
    lastAccess: "—",
  },
]

const monitoringHighlights = [
  {
    label: "Usuarios totales",
    value: users.length,
    helper: "+12% vs. mes pasado",
    icon: UsersIcon,
    accent: "bg-blue-100 text-blue-600",
  },
  {
    label: "Administradores",
    value: users.filter((u) => u.role === "Administrador").length,
    helper: "Control de cuentas privilegiadas",
    icon: ShieldCheck,
    accent: "bg-emerald-100 text-emerald-600",
  },
  {
    label: "Activos hoy",
    value: users.filter((u) => u.status === "Activo").length,
    helper: "Usuarios con sesión en las últimas 24 h",
    icon: Activity,
    accent: "bg-purple-100 text-purple-600",
  },
  {
    label: "Pendientes",
    value: users.filter((u) => u.status === "Pendiente").length,
    helper: "Invitaciones sin validar",
    icon: Eye,
    accent: "bg-amber-100 text-amber-600",
  },
]

const roleLabels = ["Administrador", "Supervisor", "Operador"]

export default function UsuariosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return users
    }
    const query = searchQuery.toLowerCase()
    return users.filter((user) =>
      [user.name, user.email, user.phone, user.role].some((value) => value.toLowerCase().includes(query)),
    )
  }, [searchQuery])

  const roleDistribution = useMemo(() => {
    const total = users.length
    return roleLabels.map((role) => {
      const count = users.filter((user) => user.role === role).length
      return {
        role,
        count,
        percentage: total ? Math.round((count / total) * 100) : 0,
      }
    })
  }, [])

  const statusDistribution = useMemo(() => {
    const totals = users.reduce(
      (acc, user) => {
        acc[user.status] = (acc[user.status] ?? 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    const total = users.length
    return Object.entries(totals).map(([status, count]) => ({
      status,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
    }))
  }, [])

  return (
    <MainLayout title="Usuarios" subtitle="Monitorea actividad, roles y estado de las cuentas registradas.">
      <div className="space-y-8">
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {monitoringHighlights.map((item) => (
            <Card key={item.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.helper}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${item.accent}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Distribución por rol</CardTitle>
              <CardDescription>Usuarios agrupados según su nivel de acceso.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {roleDistribution.map((role) => (
                <div key={role.role} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{role.role}</span>
                    <span className="font-medium text-foreground">
                      {role.count} usuarios • {role.percentage}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${role.percentage}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estado de cuentas</CardTitle>
              <CardDescription>Seguimiento rápido de activas / inactivas / pendientes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusDistribution.map((item) => (
                <div key={item.status} className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{item.status}</span>
                    <span className="font-medium text-foreground">
                      {item.count} usuarios ({item.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <PieChart className="h-4 w-4" />
                <span>Los usuarios pendientes requieren completar invitación o asignación de permisos.</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="flex items-center justify-between">
          <div className="max-w-xl space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Gestión de usuarios</h2>
            <p className="text-muted-foreground">
              Filtra y supervisa la actividad reciente para actuar sobre altas, bajas y solicitudes de acceso.
            </p>
          </div>
          <Button onClick={() => router.push("/usuarios/nuevo")} className="gap-2">
            <Plus className="h-4 w-4" />
            Añadir usuario
          </Button>
        </section>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email, rol..."
            className="pl-10"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="border-border/70">
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
                      <CardTitle className="text-lg text-foreground">{user.name}</CardTitle>
                      <CardDescription>{user.role}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={user.status === "Activo" ? "default" : user.status === "Pendiente" ? "secondary" : "outline"}>
                    {user.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t pt-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Lavandería</p>
                    <p className="text-sm font-medium text-foreground">{user.laundry}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Último acceso</p>
                    <p className="text-sm font-medium text-foreground">{user.lastAccess}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push(`/usuarios/${user.id}`)}
                >
                  Gestionar usuario
                </Button>
              </CardContent>
            </Card>
          ))}
          {filteredUsers.length === 0 && (
            <Card className="col-span-full border-dashed">
              <CardContent className="py-10 text-center text-muted-foreground">
                No se encontraron usuarios con el criterio seleccionado.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
