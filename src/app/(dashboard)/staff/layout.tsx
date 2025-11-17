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
  Shirt,
  Ticket,
  Tag,
} from "lucide-react";
import { ProtectedShell } from "@/features/auth/components/protected-shell";
import { useSession } from "@/features/auth/session-context";
import { useLavanderia } from "@/features/lavanderias/queries";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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
      <div className="flex min-h-svh bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <aside className="flex w-64 flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/95 fixed left-0 top-0 bottom-0">
          <div className="flex items-center gap-3 px-6 py-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-300">
              <Shirt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">LaundryPro</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Operaciones staff</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-sky-500/20 text-sky-700 dark:text-sky-200"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-sky-600 dark:text-sky-300" : "text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-6 mt-auto">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 transition hover:bg-slate-100 dark:hover:bg-slate-900/80 hover:text-rose-700 dark:hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col ml-64">
          <header className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
            <div className="flex items-center justify-between px-8 py-6">
              <div>
                <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                  {breadcrumbItems.map((item, index) => (
                    <div key={`${item.href}-${item.label}`} className="flex items-center gap-1">
                      {index > 0 ? <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" /> : null}
                      {item.isCurrent ? (
                        <span className="font-medium text-slate-900 dark:text-slate-200">{item.label}</span>
                      ) : (
                        <Link
                          href={item.href}
                          className="transition hover:text-slate-900 dark:hover:text-slate-200"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{currentSectionTitle}</h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{fullName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{user?.email ?? 'correo@laundry.pro'}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-700 dark:text-sky-200">
                  {initials}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-white dark:bg-slate-950 px-8 py-10">
            {children}
          </main>
        </div>
      </div>
    </ProtectedShell>
  );
}

