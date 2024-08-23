"use client"

import { useSidebarStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/admin-panel/sidebar"

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const sidebar = {
    isOpen: useSidebarStore((state) => state.isOpen),
  }

  if (!sidebar) return null

  return (
    <>
      <Sidebar />
      <div
        className={cn(
          "relative flex min-h-screen flex-col bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
        )}
      >
        {children}
      </div>
    </>
  )
}
