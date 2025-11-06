"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, BarChart3, Settings } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/lavanderia/dashboard", icon: LayoutDashboard },
  { name: "Pedidos", href: "/lavanderia/pedidos", icon: Package },
  { name: "Estadísticas", href: "/lavanderia/estadisticas", icon: BarChart3 },
]

export function LaundrySidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary-foreground"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-sidebar-foreground">LaundryPro</span>
          <span className="text-xs text-muted-foreground">Clean & Fresh Laundry</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-4 px-3">
          <p className="text-xs text-muted-foreground mb-1">Lavandería</p>
          <p className="text-sm font-medium">Clean & Fresh Laundry</p>
          <p className="text-xs text-muted-foreground">lavanderia@cleanfresh.com</p>
        </div>
        <Link
          href="/"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Settings className="h-5 w-5" />
          Cerrar Sesión
        </Link>
      </div>
    </div>
  )
}
