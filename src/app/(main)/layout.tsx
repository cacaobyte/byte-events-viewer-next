"use client"

import Link from "next/link"

import { useDetectOS } from "@/hooks/use-detect-os"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { PathnameBreadcrumbs } from "@/components/pathname-breadcrumbs"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const os = useDetectOS()

  return (
    <SidebarProvider className="max-h-screen">
      <AppSidebar />

      <SidebarInset className="border-border border p-4 pt-0">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarTrigger className="-ml-1" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <span className="text-sm">Toggle Sidebar</span>

              <kbd className="flex items-center gap-1">
                <kbd className="bg-muted/10 pointer-events-none flex h-4 select-none items-center justify-center rounded-sm px-1 text-xs font-normal tabular-nums tracking-tight">
                  {os === "macOS" ? "⌘" : "Ctrl"}
                </kbd>
                <kbd className="bg-muted/10 pointer-events-none flex size-4 select-none items-center justify-center rounded-sm px-0 text-xs font-normal tabular-nums tracking-tight">
                  B
                </kbd>
              </kbd>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <PathnameBreadcrumbs />
        </header>
        <ScrollArea className="bg-muted flex size-full rounded-lg">
          <div className="flex size-full flex-col items-center p-4 pt-0">
            {children}
          </div>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
