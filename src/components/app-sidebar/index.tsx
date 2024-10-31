"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Bell,
  Frame,
  Heart,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Tickets,
} from "lucide-react"

import useAuth from "@/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { Icons } from "../icons"
import { NavLogin } from "./components/nav-login"
import { NavMain } from "./components/nav-main"
import { NavUser } from "./components/nav-user"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
    companyName: "CacaoByte",
    companyLogo: "/logos.svg",
    companyType: "public",
  },
  navMain: [
    {
      title: "Inicio",
      i18n: "sidebar.home",
      url: "/",
      icon: Home,
    },
    {
      title: "Favoritos",
      i18n: "sidebar.favorites",
      url: "/favorites",
      icon: Heart,
    },
    {
      title: "Mis Eventos",
      i18n: "sidebar.my-events",
      url: "/my-events",
      icon: Tickets,
    },
    {
      title: "Notificaciones",
      i18n: "sidebar.notifications",
      url: "/notifications",
      icon: Bell,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      i18n: "sidebar.support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      i18n: "sidebar.feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  companies: [
    {
      name: "CacaoByte",
      logo: "/logos.svg",
      type: "public",
    },
    {
      name: "Design Engineering",
      logo: "/logos.svg",
      type: "private",
    },
    {
      name: "Sales & Marketing",
      logo: "/logos.svg",
      type: "private",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { open } = useSidebar()
  const { user } = useAuth()
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => router.push("/")}>
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Icons.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Events Viewer</span>
                <span className="truncate text-xs">CacaoByte</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* <form>
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <SidebarInput
                id="search"
                placeholder="Search the docs..."
                className="pl-8"
              />
              <Icons.search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {!user && open && <NavLogin />}
        <NavUser user={data.user} companies={data.companies} />
      </SidebarFooter>
      {/* <SidebarRail /> */}
    </Sidebar>
  )
}
