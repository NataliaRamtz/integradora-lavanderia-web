'use client'

import type React from 'react'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

import { AppHeader } from '../header'
import { LaundrySidebar, laundryNavigation } from '../navigation/laundry-sidebar'

interface LaundryLayoutProps {
  children: React.ReactNode
  headerTitle?: string
  headerSubtitle?: string
}

interface BreadcrumbItem {
  label: string
  href: string
}

function formatSegment(segment: string, previous?: string): string {
  if (previous === 'pedidos') {
    return `Pedido ${segment}`
  }

  if (previous === 'tickets') {
    return `Ticket ${segment}`
  }

  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function buildBreadcrumbs(pathname: string): { breadcrumbs: BreadcrumbItem[]; currentLabel: string } {
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Dashboard',
      href: '/lavanderia/dashboard',
    },
  ]
  let currentPath = '/lavanderia'

  for (let index = 1; index < segments.length; index++) {
    const segment = segments[index]
    currentPath += `/${segment}`

    if (currentPath === '/lavanderia/dashboard') {
      continue
    }

    const matchedNav = laundryNavigation.find((item) => item.href === currentPath)
    const label = matchedNav?.name ?? formatSegment(segment, segments[index - 1])

    breadcrumbs.push({
      label,
      href: currentPath,
    })
  }

  const currentLabel = segments.length <= 2 ? 'Dashboard' : breadcrumbs[breadcrumbs.length - 1]?.label ?? 'Dashboard'

  return { breadcrumbs, currentLabel }
}

export function LaundryLayout({ children, headerTitle, headerSubtitle }: LaundryLayoutProps) {
  const pathname = usePathname()

  const { breadcrumbs, currentLabel } = useMemo(() => buildBreadcrumbs(pathname ?? ''), [pathname])
  const title = headerTitle ?? currentLabel

  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      <LaundrySidebar />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <AppHeader
          variant='laundry'
          title={title}
          subtitle={headerSubtitle}
          breadcrumbs={breadcrumbs}
        />
        <main className='flex-1 overflow-y-auto p-6'>{children}</main>
      </div>
    </div>
  )
}

export default LaundryLayout

