"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  BarChart2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  MenuSquare,
  Package2,
  Settings,
  Ticket,
  Tag,
} from "lucide-react";

const LaundryLogo = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="70" fill="#DFF3FF" stroke="#1C4E80" strokeWidth="4"/>
    <line x1="40" y1="70" x2="160" y2="70" stroke="#1C4E80" strokeWidth="4" strokeLinecap="round"/>
    <rect x="88" y="60" width="8" height="18" fill="#FCE5A7" stroke="#1C4E80" strokeWidth="3"/>
    <rect x="104" y="60" width="8" height="18" fill="#FCE5A7" stroke="#1C4E80" strokeWidth="3"/>
    <path d="M80 80 L120 80 L135 95 L135 140 L65 140 L65 95 Z"
          fill="#FFFFFF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
    <path d="M40 115 C30 110 28 95 42 90 C55 95 55 112 40 115 Z"
          fill="#DFF3FF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
    <path d="M160 115 C175 112 175 95 158 90 C145 95 147 110 160 115 Z"
          fill="#DFF3FF"
          stroke="#1C4E80"
          strokeWidth="4"
          strokeLinejoin="round"/>
  </svg>
);
import { ProtectedShell } from "@/features/auth/components/protected-shell";
import { useSession } from "@/features/auth/session-context";
import { useLavanderia } from "@/features/lavanderias/queries";

const navigation = [
  { label: "Dashboard", href: "/staff", icon: LayoutDashboard },
  { label: "Pedidos", href: "/staff/pedidos", icon: Package2 },
  { label: "Walk-In", href: "/staff/walk-in", icon: MenuSquare },
  { label: "Catálogos", href: "/staff/catalogo", icon: Tag },
  { label: "Tickets", href: "/staff/tickets", icon: Ticket },
  { label: "Estadísticas", href: "/staff/estadisticas", icon: BarChart2 },
  { label: "Configuración", href: "/staff/configuracion", icon: Settings },
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { perfil, user, activeRole, signOut } = useSession();

  const lavanderiaId = activeRole?.lavanderia_id ?? "";
  const { data: lavanderia } = useLavanderia(lavanderiaId);

  const perfilData = (perfil?.perfil as Record<string, unknown>) ?? {};
  const fullName = useMemo(() => {
    const nombre = (perfilData.nombre as string | undefined)?.trim();
    const apellido = (perfilData.apellido as string | undefined)?.trim();
    const result = [nombre, apellido].filter(Boolean).join(" ").trim();
    return result.length > 0 ? result : "Encargado LaundryPro";
  }, [perfilData.apellido, perfilData.nombre]);

  const initials = useMemo(() => {
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "LP";
  }, [fullName]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
    router.refresh();
  };

  const breadcrumbItems = useMemo(() => {
    const labelMap: Record<string, string> = {
      staff: "Dashboard",
      pedidos: "Pedidos",
      "walk-in": "Walk-In",
      catalogo: "Catálogos",
      tickets: "Tickets",
      estadisticas: "Estadísticas",
      configuracion: "Configuración",
    };

    const segments = pathname.split("/").filter(Boolean);
    const items: Array<{ label: string; href: string; isCurrent: boolean }> = [];
    let accumulator = "";

    segments.forEach((segment, index) => {
      accumulator += `/${segment}`;
      if (segment === "staff" && index === 0) {
        items.push({
          label: labelMap[segment],
          href: "/staff",
          isCurrent: index === segments.length - 1,
        });
        return;
      }

      let label = labelMap[segment];

      if (!label) {
        if (segments[index - 1] === "pedidos") {
          label = "Detalle";
        } else {
          label = segment
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
        }
      }

      items.push({
        label,
        href: accumulator,
        isCurrent: index === segments.length - 1,
      });
    });

    if (items.length === 0) {
      return [{ label: "Dashboard", href: "/staff", isCurrent: true }];
    }

    return items;
  }, [pathname]);

  const currentSectionTitle = breadcrumbItems[breadcrumbItems.length - 1]?.label ?? "Dashboard";

  return (
    <ProtectedShell requiredRoles={["encargado", "superadmin"]} fallbackRoute="/login">
      <div className="flex min-h-svh bg-[#0E1624] text-[#F2F5FA]">
        <aside className="flex w-64 flex-col h-screen border-r border-[#25354B]/50 bg-[#0E1624] backdrop-blur-xl fixed left-0 top-0 shadow-[4px_0_20px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Header del sidebar - fijo arriba */}
          <div className="flex-shrink-0 flex items-center gap-3 px-5 h-16 border-b border-[#25354B]/30">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-transparent flex-shrink-0">
              <LaundryLogo size={44} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent truncate">LaundryPro</p>
              <p className="text-xs text-[#8FA1B7] font-medium truncate">Encargado de Lavandería</p>
            </div>
          </div>

          {/* Navegación - área flexible con scroll si es necesario */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 px-4 py-4 min-h-0">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-[#4C89D9]/20 to-[#60C2D8]/20 text-[#4C89D9] shadow-lg shadow-[#4C89D9]/20 border border-[#4C89D9]/30"
                      : "text-[#BFC7D3] hover:bg-[#25354B]/50 hover:text-[#F2F5FA] hover:translate-x-1"
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#4C89D9] to-[#60C2D8] rounded-r-full" />
                  )}
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0 ${
                    active 
                      ? "bg-[#4C89D9]/30" 
                      : "bg-[#25354B]/30 group-hover:bg-[#4C89D9]/20"
                  }`}>
                    <Icon className={`h-3.5 w-3.5 transition-all duration-300 ${
                      active 
                        ? "text-[#4C89D9]" 
                        : "text-[#8FA1B7] group-hover:text-[#60C2D8] group-hover:scale-110"
                    }`} />
                  </div>
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer del sidebar - fijo abajo */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-[#25354B]/30">
            <button
              type="button"
              onClick={handleSignOut}
              className="group w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#FF8B6B] transition-all duration-300 hover:bg-gradient-to-r hover:from-[#FF8B6B]/10 hover:to-[#FF8B6B]/5 hover:border hover:border-[#FF8B6B]/30 hover:shadow-lg hover:shadow-[#FF8B6B]/20 hover:scale-105 active:scale-95"
            >
              <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 flex-shrink-0" />
              <span className="truncate">Cerrar sesión</span>
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col ml-64">
          <header className="border-b border-[#25354B]/50 bg-[#0E1624] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] h-16">
            <div className="flex items-center justify-between px-8 h-full">
              <div className="flex items-center gap-4">
                {lavanderia?.nombre && (
                  <div className="flex items-center gap-2 pr-4 border-r border-[#25354B]/30">
                    <p className="text-sm font-extrabold bg-gradient-to-r from-[#4C89D9] to-[#60C2D8] bg-clip-text text-transparent">
                      {lavanderia.nombre}
                    </p>
                  </div>
                )}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#BFC7D3]">
                  {breadcrumbItems.map((item, index) => (
                    <div key={`${item.href}-${item.label}`} className="flex items-center gap-1.5">
                      {index > 0 ? <ChevronRight className="h-3.5 w-3.5 text-[#8FA1B7]" /> : null}
                      {item.isCurrent ? (
                        <span className="font-bold text-[#F2F5FA] bg-[#4C89D9]/10 px-2 py-1 rounded-lg">{item.label}</span>
                      ) : (
                        <Link
                          href={item.href}
                          className="transition-all duration-200 hover:text-[#4C89D9] hover:underline"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-[#F2F5FA]">{fullName}</p>
                  <p className="text-xs text-[#8FA1B7] font-medium">{user?.email ?? 'correo@laundry.pro'}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4C89D9]/20 to-[#60C2D8]/20 border-2 border-[#4C89D9]/30 text-sm font-bold text-[#4C89D9] shadow-lg shadow-[#4C89D9]/20 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#4C89D9]/30">
                  {initials}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-[#0E1624] px-8 py-10 shadow-inner">
            {children}
          </main>
        </div>
      </div>
    </ProtectedShell>
  );
}

