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

export default function PrincipalPage() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <>
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
      <div className="container mx-auto p-2 pt-0 lg:p-4 lg:pt-0">
        <div className="flex flex-col lg:flex-row lg:gap-4">
          {/* Events section - now full width on mobile and left on desktop */}
          <section className="order-1 grow lg:order-1">
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <EventCard key={index} />
              ))}
            </div>
          </section>

          {/* Sidebar - now on the right for desktop */}
          <div className="order-2 lg:order-2 lg:w-2/5">
            <div className="sticky top-[71px] hidden lg:block">
              <EventFilters />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
