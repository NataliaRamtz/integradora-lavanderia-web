"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type BreadcrumbEntry = {
  label: string
  href: string
}

interface AppHeaderProps {
  title?: string
  subtitle?: string
  profileHref?: string
  settingsHref?: string
  variant?: "default" | "laundry"
  breadcrumbs?: BreadcrumbEntry[]
}

export function AppHeader({ title, subtitle, variant = "default", breadcrumbs = [] }: AppHeaderProps) {
  const pathname = usePathname()

  if (variant === "laundry" || variant === "default") {
    return (
      <header className="flex h-16 items-center border-b border-border bg-card px-6">
        {breadcrumbs.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => {
                const isFirst = index === 0
                const isLast = index === breadcrumbs.length - 1
                const label = variant === "laundry" && isFirst ? "Dashboard" : crumb.label
                const key = `${index}-${crumb.href}-${label}`
                return (
                  <Fragment key={key}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={crumb.href}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <div>
            {title && <h1 className="text-2xl font-semibold text-foreground">{title}</h1>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
      </header>
    )
  }

  return null
}
