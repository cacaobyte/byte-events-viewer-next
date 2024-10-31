"use client"

import * as React from "react"
import {
  ChevronsUpDown,
  CreditCard,
  LogOut,
  MonitorCog,
  MoonStar,
  RefreshCw,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useI18n } from "@/hooks/use-i18n"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

interface User {
  name: string
  email: string
  avatar: string
  companyName: string
  companyLogo: string
  companyType: string
}

interface Company {
  logo: string
  name: string
  type: string
}

export function NavUser({
  user,
  companies,
}: {
  user: User
  companies: Company[]
}) {
  const [toggleCompany, setToggleCompany] = React.useState(false)
  const [selectedCompany, setSelectedCompany] = React.useState<Company>(
    companies[0]
  )
  const { isMobile } = useSidebar()

  const handleSwitchCompany = (company: Company) => {
    setSelectedCompany(company)
  }

  const handleToggleCompany = () => {
    setToggleCompany(!toggleCompany)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={user.companyLogo} alt={user.companyName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.companyName}
                </span>
                <span className="truncate text-xs">{user.companyType}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[275px] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "top"}
            align="start"
            sideOffset={4}
          >
            {toggleCompany ? (
              <NavUserCompany
                companies={companies}
                selectedCompany={selectedCompany}
                handleSwitchCompany={handleSwitchCompany}
                handleToggleCompany={handleToggleCompany}
              />
            ) : (
              <NavUserMain
                user={user}
                handleToggleCompany={handleToggleCompany}
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function NavUserMain({
  user,
  handleToggleCompany,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  handleToggleCompany?: () => void
}) {
  const { setTheme, theme } = useTheme()
  const i18n = useI18n()
  return (
    <>
      <DropdownMenuLabel className="font-normal">
        <div className="flex h-8 items-center justify-between px-1 text-gray-500">
          <span className="text-[13px] font-medium leading-[16px]">
            marioarita502@gmail.com
          </span>
        </div>
        <div className="flex items-center gap-2 py-1.5 text-left text-sm">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="group h-8 w-full rounded-lg"
          onClick={handleToggleCompany}
        >
          <RefreshCw className="group-hover:animate-spin" />
          {i18n.t("nav-user.switch-company")}
        </Button>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuItem className="mx-2">
          <CreditCard />
          {i18n.t("nav-user.billing")}
        </DropdownMenuItem>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuLabel>{i18n.t("nav-user.preferences")}</DropdownMenuLabel>
        <DropdownMenuLabel className="py-0 font-normal">
          <div className="flex items-center justify-between gap-2 px-1 py-1.5 text-left text-sm">
            <span className="text-sm font-normal">
              {i18n.t("nav-user.theme")}
            </span>
            <ToggleGroup
              type="single"
              value={theme}
              onValueChange={(value) => {
                if (value) setTheme(value)
              }}
              className="flex items-center gap-0.5 rounded-full border"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="system"
                    className={cn(
                      "size-6 rounded-full p-0 hover:scale-105",
                      theme === "system" && "bg-accent border shadow-sm"
                    )}
                    aria-label="System theme"
                  >
                    <MonitorCog className="size-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{i18n.t("nav-user.system")}</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="light"
                    className={cn(
                      "size-6 rounded-full p-0 hover:scale-105",
                      theme === "light" && "bg-accent border shadow-sm"
                    )}
                    aria-label="Light theme"
                  >
                    <Sun className="size-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{i18n.t("nav-user.light")}</span>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="dark"
                    className={cn(
                      "size-6 rounded-full p-0 hover:scale-105",
                      theme === "dark" && "bg-accent border shadow-sm"
                    )}
                    aria-label="Dark theme"
                  >
                    <MoonStar className="size-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{i18n.t("nav-user.dark")}</span>
                </TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel className="py-0 font-normal">
          <div className="flex items-center justify-between gap-2 px-1 py-1.5 text-left text-sm">
            <span className="text-sm font-normal">
              {i18n.t("nav-user.language")}
            </span>
            <Select
              defaultValue={i18n.locale}
              onValueChange={(value) => {
                if (value) i18n.setLocale(value)
              }}
            >
              <SelectTrigger className="h-7 max-w-[5.5rem] p-2 text-sm [&>svg]:w-3 [&>svg]:shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="es">
                    {i18n.t("nav-user.spanish")}
                  </SelectItem>
                  <SelectItem value="en">
                    {i18n.t("nav-user.english")}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuLabel asChild>
        <Button className="h-8 w-full rounded-lg">
          <LogOut />
          {i18n.t("nav-user.logout")}
        </Button>
      </DropdownMenuLabel>
    </>
  )
}

function NavUserCompany({
  companies,
  selectedCompany,
  handleSwitchCompany,
  handleToggleCompany,
}: {
  companies: Company[]
  selectedCompany: Company
  handleSwitchCompany: (company: Company) => void
  handleToggleCompany: () => void
}) {
  const i18n = useI18n()

  return (
    <>
      <DropdownMenuLabel className="py-0 font-medium" asChild>
        <Button
          variant="link"
          onClick={handleToggleCompany}
          className="text-muted-foreground flex h-10 w-full items-center justify-start text-[13px]"
        >
          <Icons.back />
          {i18n.t("common.back")}
        </Button>
      </DropdownMenuLabel>

      <DropdownMenuLabel className="py-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage
              src={selectedCompany.logo}
              alt={selectedCompany.name}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {selectedCompany.name}
            </span>
            <span className="truncate text-xs">{selectedCompany.type}</span>
          </div>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuGroup className="flex h-56 w-full flex-col overflow-y-auto">
        <DropdownMenuLabel className="text-muted-foreground text-[13px] font-medium">
          {i18n.t("nav-user.other-company")}
        </DropdownMenuLabel>
        {companies
          .filter((company) => company.name !== selectedCompany.name)
          .map((company) => (
            <DropdownMenuLabel
              key={company.name}
              className="hover:bg-accent cursor-pointer rounded-lg py-0 font-normal"
              onClick={() => handleSwitchCompany(company)}
            >
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={company.logo} alt={company.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{company.name}</span>
                  <span className="truncate text-xs">{company.type}</span>
                </div>
              </div>
            </DropdownMenuLabel>
          ))}
      </DropdownMenuGroup>
    </>
  )
}
