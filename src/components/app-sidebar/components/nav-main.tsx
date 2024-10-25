"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TranslationKeyPaths } from "@/context/i18n-provider"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { useI18n } from "@/hooks/use-i18n"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    i18n: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      i18n: string
      url: string
    }[]
  }[]
}) {
  const i18n = useI18n()
  const pathname = usePathname()
  // const router = useRouter()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{i18n.t("sidebar.title")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={
                      (item.i18n && i18n.t(item.i18n as TranslationKeyPaths)) ||
                      item.title
                    }
                  >
                    {item.icon && <item.icon />}
                    <span>
                      {(item.i18n &&
                        i18n.t(item.i18n as TranslationKeyPaths)) ||
                        item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>
                              {(subItem.i18n &&
                                i18n.t(subItem.i18n as TranslationKeyPaths)) ||
                                subItem.title}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
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
                  {item.icon && <item.icon />}
                  <span>
                    {(item.i18n && i18n.t(item.i18n as TranslationKeyPaths)) ||
                      item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
