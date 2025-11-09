"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LayoutDashboard, Users, Settings, Store, CreditCard, BarChart3, Menu, Droplet, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"

export const adminNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Lavanderías", href: "/lavanderias", icon: Store },
  { name: "Usuarios", href: "/usuarios", icon: Users },
  { name: "Gestión de Planes", href: "/planes", icon: CreditCard },
  { name: "Estadísticas", href: "/estadisticas", icon: BarChart3 },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const stored = window.localStorage.getItem("admin-sidebar-collapsed")
    if (stored === "true") {
      setIsCollapsed(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem("admin-sidebar-collapsed", String(isCollapsed))
  }, [isCollapsed])

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4 transition-all",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        <div className={cn("flex items-center gap-3", isCollapsed && "gap-0")}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground transition-colors focus:outline-none focus:ring-0"
            aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          >
            <Menu className="h-5 w-5" />
          </button>
          {!isCollapsed && (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Droplet className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">LaundryPro</span>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {adminNavigation.map((item) => {
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
                isCollapsed && "justify-center px-0",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        {!isCollapsed && (
          <div className="mb-4 px-3 space-y-1">
            <p className="text-sm font-medium text-sidebar-foreground">Superadmin</p>
            <p className="text-xs text-muted-foreground">superadmin@laundrypro.com</p>
          </div>
        )}
        <Link
          href="/login"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
          title={isCollapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && "Cerrar Sesión"}
        </Link>
      </div>
    </div>
  )
}

