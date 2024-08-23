import Link from "next/link"

import { useSidebarStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "@/components/admin-panel/menu"
import { SidebarToggle } from "@/components/admin-panel/sidebar-toggle"

import { Icons } from "../icons"

export function Sidebar() {
  const sidebar = {
    isOpen: useSidebarStore((state) => state.isOpen),
    toggle: useSidebarStore((state) => state.toggle),
  }

  if (!sidebar) return null

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} toggle={sidebar?.toggle} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button
          className={cn(
            "text-foreground mb-1 w-full border-none px-2 transition-transform duration-300 ease-in-out"
          )}
          variant="link"
          size="icon"
          asChild
        >
          <Link href="/dashboard" className="items-center gap-2">
            <span
              className={cn(
                "text-primary-foreground bg-primary flex size-full items-center justify-center rounded-md",
                sidebar?.isOpen === false ? "size-full" : "h-full w-fit px-2"
              )}
            >
              <Icons.logo className="size-6" />
            </span>
            <h1
              className={cn(
                "whitespace-nowrap text-lg font-bold transition-[transform,opacity,display] duration-300 ease-in-out",
                sidebar?.isOpen === false
                  ? "hidden -translate-x-96 opacity-0"
                  : "ml-1 translate-x-0 opacity-100"
              )}
            >
              Events Viewer
            </h1>
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  )
}
