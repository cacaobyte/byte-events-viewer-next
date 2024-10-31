"use client"

import * as React from "react"
import { useState } from "react"
import {
  AlertCircle,
  Bell,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  Filter,
  FilterIcon,
  Inbox,
  MapPin,
  MessageSquare,
  Search,
  Trash2,
  User,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { OptionsSelector } from "@/components/options-selector"

interface Notification {
  id: string
  type:
    | "new"
    | "reminder"
    | "update"
    | "message"
    | "registration"
    | "cancellation"
    | "log"
  title: string
  description: string
  date: string
  read: boolean
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "new",
    title: "Nuevo evento: Concierto de Jazz",
    description: "Se ha añadido un nuevo concierto de jazz a tu área.",
    date: "2024-11-15",
    read: false,
  },
  {
    id: "2",
    type: "reminder",
    title: "Recordatorio: Exposición de Arte",
    description: "La exposición de arte comienza mañana a las 10:00 AM.",
    date: "2024-11-01",
    read: false,
  },
  {
    id: "3",
    type: "update",
    title: "Cambio de horario: Taller de Cocina",
    description: "El taller de cocina se ha movido de 3:00 PM a 4:30 PM.",
    date: "2024-10-28",
    read: true,
  },
  {
    id: "4",
    type: "message",
    title: "Mensaje del organizador: Festival de Cine",
    description:
      "Gracias por registrarte. Aquí tienes información adicional sobre el evento.",
    date: "2024-10-25",
    read: false,
  },
  {
    id: "5",
    type: "registration",
    title: "Registro confirmado: Maratón de la Ciudad",
    description:
      "Tu registro para el maratón anual de la ciudad ha sido confirmado.",
    date: "2024-10-20",
    read: true,
  },
  {
    id: "6",
    type: "cancellation",
    title: "Evento cancelado: Clase de Yoga",
    description:
      "Lamentamos informarte que la clase de yoga del próximo martes ha sido cancelada.",
    date: "2024-10-18",
    read: false,
  },
  {
    id: "7",
    type: "log",
    title: "Cambio en la lista de espera: Taller de Fotografía",
    description:
      "Has avanzado en la lista de espera para el taller de fotografía.",
    date: "2024-10-15",
    read: false,
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all")
  const [notificationState, setNotificationState] = useState(notifications)
  const [filters, setFilters] = useState<Notification["type"][]>([
    "new",
    "reminder",
    "update",
    "message",
    "registration",
    "cancellation",
    "log",
  ])
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotifications = notificationState
    .filter((n) => activeTab === "all" || !n.read)
    .filter((n) => filters.includes(n.type))
    .filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const markAsRead = (id: string) => {
    setNotificationState(
      notificationState.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const deleteNotification = (id: string) => {
    setNotificationState(notificationState.filter((n) => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotificationState(notificationState.map((n) => ({ ...n, read: true })))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new":
        return <Calendar className="size-5 text-blue-500" />
      case "reminder":
        return <Clock className="size-5 text-yellow-500" />
      case "update":
        return <MapPin className="size-5 text-green-500" />
      case "message":
        return <MessageSquare className="size-5 text-purple-500" />
      case "registration":
        return <CheckCircle className="size-5 text-green-500" />
      case "cancellation":
        return <XCircle className="size-5 text-red-500" />
      case "log":
        return <AlertCircle className="size-5 text-orange-500" />
    }
  }

  const getBadgeVariant = (type: Notification["type"]) => {
    switch (type) {
      case "new":
        return "default"
      case "reminder":
        return "warning"
      case "update":
        return "secondary"
      case "message":
        return "outline"
      case "registration":
        return "success"
      case "cancellation":
        return "destructive"
      case "log":
        return "outline"
    }
  }

  const toggleFilter = (type: Notification["type"]) => {
    setFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const hadleSelectedValuesChange = (values: string[]) => {
    to
  }

  return (
    <>
      <>
        <div className="bg-muted/95 supports-[backdrop-filter]:bg-muted/80 sticky top-0 z-[1] rounded-t-lg backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Bell className="text-primary size-6" />
                <CardTitle className="text-2xl font-bold">
                  Notificaciones de Eventos
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      Marcar todas como leídas
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Marca todas las notificaciones como leídas</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <OptionsSelector
                      options={[
                        { label: "Option 1", value: "option1" },
                        { label: "Option 2", value: "option2" },
                        { label: "Option 3", value: "option3" },
                      ]}
                      onSelectedValuesChange={(values) => console.log(values)}
                    />
                    {/* <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <FilterIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuCheckboxItem
                          checked={filters.includes("new")}
                          onCheckedChange={() => toggleFilter("new")}
                        >
                          Nuevos eventos
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.includes("reminder")}
                          onCheckedChange={() => toggleFilter("reminder")}
                        >
                          Recordatorios
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.includes("update")}
                          onCheckedChange={() => toggleFilter("update")}
                        >
                          Actualizaciones
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.includes("message")}
                          onCheckedChange={() => toggleFilter("message")}
                        >
                          Mensajes
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.includes("registration")}
                          onCheckedChange={() => toggleFilter("registration")}
                        >
                          Registros
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.includes("cancellation")}
                          onCheckedChange={() => toggleFilter("cancellation")}
                        >
                          Cancelaciones
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={filters.includes("log")}
                          onCheckedChange={() => toggleFilter("log")}
                        >
                          Logs
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filtrar notificaciones</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <CardDescription>Mantente al día con tus eventos</CardDescription>
          </CardHeader>
          <div className="px-4 pb-4 sm:px-6">
            <Input
              type="text"
              placeholder="Buscar notificaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 w-full"
              icon={<Search className="text-muted-foreground size-4" />}
            />
            <Tabs
              defaultValue="all"
              className="w-full"
              onValueChange={(value) => setActiveTab(value as "all" | "unread")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="unread">No leídas</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="space-y-4 p-4 sm:px-6">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all duration-300 ${
                    notification.read ? "bg-secondary/20" : "bg-secondary/50"
                  }`}
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="mt-1 shrink-0 rounded-full p-2">
                          {getIcon(notification.type)}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate font-semibold">
                              {notification.title}
                            </h3>
                            <Badge
                              variant={getBadgeVariant(notification.type)}
                              className="shrink-0"
                            >
                              {notification.type}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm">
                            {notification.description}
                          </p>
                          <div className="text-muted-foreground flex items-center text-xs">
                            <User className="mr-1 size-3" />
                            <span>{notification.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:ml-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                              disabled={notification.read}
                              className={`size-8 ${
                                notification.read
                                  ? "text-blue-500"
                                  : "text-muted-foreground hover:text-green-600"
                              }`}
                            >
                              <CheckCheck className="size-4" />
                              <span className="sr-only">
                                {notification.read
                                  ? "Notificación leída"
                                  : "Marcar como leída"}
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {notification.read
                                ? "Notificación leída"
                                : "Marcar como leída"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="size-8 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="size-4" />
                              <span className="sr-only">
                                Eliminar notificación
                              </span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Eliminar notificación</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Inbox className="text-muted-foreground mb-4 size-16" />
                <p className="text-muted-foreground text-lg font-semibold">
                  No hay notificaciones que mostrar
                </p>
                <p className="text-muted-foreground text-sm">
                  Cuando recibas notificaciones, aparecerán aquí.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </>
    </>
  )
}
