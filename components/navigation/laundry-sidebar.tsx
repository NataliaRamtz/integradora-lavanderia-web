"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { LayoutDashboard, Package, BarChart3, Settings, LogOut, Ticket, Menu, Droplet, UserPlus, NotebookPen } from "lucide-react"

import { cn } from "@/lib/utils"
import { authService } from "@/src/modules/auth/application/auth.service"

export const laundryNavigation = [
  { name: "Dashboard", href: "/lavanderia/dashboard", icon: LayoutDashboard },
  { name: "Pedidos", href: "/lavanderia/pedidos", icon: Package },
  { name: "Walk-In", href: "/lavanderia/walk-in", icon: UserPlus },
  { name: "Catálogos", href: "/lavanderia/catalogos", icon: NotebookPen },
  { name: "Tickets", href: "/lavanderia/tickets", icon: Ticket },
  { name: "Estadísticas", href: "/lavanderia/estadisticas", icon: BarChart3 },
  { name: "Configuración", href: "/lavanderia/configuracion", icon: Settings },
]

export function LaundrySidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoggingOut, startLogout] = useTransition()

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    const stored = window.localStorage.getItem("laundry-sidebar-collapsed")
    if (stored === "true") {
      setIsCollapsed(true)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }
    window.localStorage.setItem("laundry-sidebar-collapsed", String(isCollapsed))
  }, [isCollapsed])

  const handleLogout = () => {
    startLogout(async () => {
      try {
        await authService.signOut()
        router.replace("/login")
      } catch (error) {
        console.error("Error al cerrar sesión", error)
      }
    })
  }

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
        {laundryNavigation.map((item) => {
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
            <p className="text-sm font-medium text-sidebar-foreground">Clean & Fresh Laundry</p>
            <p className="text-xs text-muted-foreground">lavanderia@cleanfresh.com</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent disabled:opacity-60"
          title={isCollapsed ? "Cerrar Sesión" : undefined}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && "Cerrar Sesión"}
        </button>
      </div>
    </div>
  )
}

