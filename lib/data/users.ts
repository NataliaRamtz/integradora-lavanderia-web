export interface AdminUserRecord {
  id: number
  name: string
  email: string
  phone: string
  role: "Administrador" | "Supervisor" | "Operador"
  laundry: string
  status: "Activo" | "Inactivo" | "Pendiente"
  avatar?: string
  lastAccess: string
}

export const adminUsers: AdminUserRecord[] = [
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
