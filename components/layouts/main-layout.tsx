"use client"

import type React from "react"
import { useMemo } from "react"
import { usePathname } from "next/navigation"

import { Sidebar, adminNavigation } from "../navigation/sidebar"
import { AppHeader } from "../header"

interface MainLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

type BreadcrumbItem = {
  label: string
  href: string
}

const BASE_BREADCRUMB: BreadcrumbItem = {
  label: "Dashboard",
  href: "/dashboard",
}

function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    if (!pathname) {
      return [BASE_BREADCRUMB]
    }

    const segments = pathname.split("/").filter(Boolean)

    if (segments.length === 0 || segments[0] === "dashboard") {
      return [BASE_BREADCRUMB]
    }

    const items: BreadcrumbItem[] = [BASE_BREADCRUMB]
    let currentPath = ""

    for (let index = 0; index < segments.length; index++) {
      const segment = segments[index]
      currentPath += `/${segment}`

      if (currentPath === BASE_BREADCRUMB.href) {
        continue
      }

      const matchedNav = adminNavigation.find((item) => item.href === currentPath)
      const label = matchedNav?.name ?? formatSegment(segment)

      items.push({
        label,
        href: currentPath,
      })
    }

    return items
  }, [pathname])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default MainLayout

