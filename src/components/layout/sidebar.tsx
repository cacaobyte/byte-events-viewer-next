"use client"

import React, { useState } from "react"
import Link from "next/link"
import { navItems } from "@/constants/data"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/hooks/useSidebar"
import { DashboardNav } from "@/components/dashboard-nav"

import { Icons } from "../icons"

type SidebarProps = {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar()

  const handleToggle = () => {
    toggle()
  }

  return (
    <aside
      className={cn(
        `bg-card  relative hidden h-screen flex-none border-r transition-[width] duration-500 md:block`,
        !isMinimized ? "w-72" : "w-[72px]",
        className
      )}
    >
      <div className="hidden p-5 pt-10 lg:block">
        <Link
          href={"https://github.com/cacaobyte/byte-ticket.git"}
          target="_blank"
          className="text-foreground flex items-center space-x-2"
        >
          <Icons.logo className="mr-2 size-6" />
          <span className={cn("text-lg font-bold", isMinimized && "hidden")}>
            Byte Ticket
          </span>
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          "bg-background text-foreground absolute -right-3  top-10 z-50 cursor-pointer rounded-full border text-3xl",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </aside>
  )
}
