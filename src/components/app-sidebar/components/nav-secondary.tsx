import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TranslationKeyPaths } from "@/context/i18n-context"
import { type LucideIcon } from "lucide-react"

import { useI18n } from "@/hooks/use-i18n"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    i18n: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const i18n = useI18n()
  const pathname = usePathname()
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                size="sm"
                tooltip={
                  (item.i18n && i18n.t(item.i18n as TranslationKeyPaths)) ||
                  item.title
                }
                isActive={
                  item.url === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.url)
                }
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>
                    {(item.i18n && i18n.t(item.i18n as TranslationKeyPaths)) ||
                      item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
