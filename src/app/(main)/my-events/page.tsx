"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import EventCard from "@/components/event-card"
import EventFilters from "@/components/event-filters"
import useFetch from "@/hooks/use-fetch"
import { getDecryptedToken } from "@/lib/utils"
import { ProtectedRoute } from "@/components/protected-route"

interface Event {
  id_event: number
  event_name: string
  start_time: Date // Puedes usar Date si prefieres manejar fechas como objetos de Date
  location: { position: string, address: string }[]
  is_public: boolean
  is_free: boolean
  status_event: string
  hosts: {
    host_name: string,
    host_picture: string
  }
  event_categories: {
    id_event_category: number
    name_category: string
  }
  img_url: { principal: string }[]
  _count: {
    event_suscriptions: number
  }
  has_active_subscription: boolean
}


export default function PrincipalPage() {
  const [isOpen, setIsOpen] = React.useState(false)
  // const [ events, loading, error ] = useFetch<Event[]>("/manager/tickets/events/feed")
  const [, , error, fetchData] = useFetch<Event>("/manager/tickets/events/myEvents", "POST");
  const [events, setEvents] = React.useState<Event[]>([])

  const validateRoute = async () => {
    try {
      const eventsInfo = await fetchData({
        headers: {
          Authorization: `Bearer ${getDecryptedToken()}`,
        },
      });

    } catch (error) {
      console.log("error:", error)
    }
    
  }

  const handleFilterChange = async () => {
    // Aquí puedes manejar los datos de los filtros
    // Por ejemplo, hacer una llamada a una API para obtener los eventos filtrados
    try {
      const eventsInfo = await fetchData({
        headers: {
          Authorization: `Bearer ${getDecryptedToken()}`,
        }
      });

      setEvents(eventsInfo)

    } catch (error) {
      console.log("error:", error)
    }
  }

    // Function to refresh events
    const refreshEvents = () => {
      handleFilterChange();
    };

  React.useEffect(() => {
    handleFilterChange()
  }, [])

  return (
    <ProtectedRoute>
      {/* Header with search - always visible */}
      <div className="bg-muted/95 supports-[backdrop-filter]:bg-muted/50 sticky top-0 z-[1] rounded-t-lg backdrop-blur">
        <div className="container mx-auto p-2 lg:p-4">
          <div className="flex items-center gap-2">
            <div className="relative grow">
              <Input
                type="search"
                placeholder="Buscar eventos..."
                className="w-full pl-10 pr-4"
              />
              <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            </div>
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  Filtros
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[90svh] overflow-hidden">
                <DrawerHeader>
                  <DrawerTitle>Filtros de eventos</DrawerTitle>
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto">
                  <EventFilters />
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline" className="w-full">
                      Cerrar
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto p-2 pt-0 lg:p-4 lg:pt-0 xl:grid xl:grid-cols-2">
        <div className="flex flex-col lg:flex-row lg:gap-4">
          {/* Events section - now full width on mobile and left on desktop */}
          <section className="order-1 grow lg:order-1">
            <div className="space-y-4">
              {events && events.map((event, index) => (
                <EventCard
                  key={index}
                  id={event.id_event.toString()}
                  title={event.event_name}
                  date={event.start_time}
                  location={event.location[0].address}
                  imageUrl={event.img_url[0].principal}
                  attendees={event._count.event_suscriptions}
                  isFavorite={event.has_active_subscription}
                  isFree={event.is_free}
                  organizerName={event.hosts.host_name}
                  organizerAvatar={event.hosts.host_picture}
                  category={event.event_categories.name_category}
                  onRefresh={refreshEvents}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </ProtectedRoute>
  )
}
