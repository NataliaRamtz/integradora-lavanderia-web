import type React from "react"
import { LaundrySidebar } from "./laundry-sidebar"
import { Header } from "./header"

interface LaundryLayoutProps {
  children: React.ReactNode
  headerTitle?: string
  headerSubtitle?: string
}

export function LaundryLayout({ children, headerTitle, headerSubtitle }: LaundryLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <LaundrySidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          profileHref="/lavanderia/perfil"
          settingsHref="/lavanderia/configuracion"
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

export default LaundryLayout
