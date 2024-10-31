"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import LocationSearch from "./location-search"
import { ScrollArea } from "./ui/scroll-area"

const filterSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  timeOfDay: z.string().optional(),
})

type FilterValues = z.infer<typeof filterSchema>

interface FilterProps {
  onFilterChange?: (filters: FilterValues) => void
}

export default function EventFilters({
  onFilterChange = (filters: FilterValues) => {
    console.log("Filter changed", filters)
  },
}: FilterProps) {
  const [showStartDateCalendar, setShowStartDateCalendar] = useState(false)
  const [showEndDateCalendar, setShowEndDateCalendar] = useState(false)

  const { control, handleSubmit } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      category: "",
      location: "",
      timeOfDay: "",
    },
  })

  const onSubmit = (data: FilterValues) => {
    onFilterChange(data)
  }

  return (
    <ScrollArea className="w-full rounded-lg lg:h-[calc(65svh)] xl:h-[calc(70svh)] 2xl:h-[calc(75svh)]">
      <Card className="border-none lg:border-solid">
        <CardHeader className="hidden lg:block">
          <CardTitle>Filtros de Eventos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pb-0 lg:p-6 lg:pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Rango de fechas</Label>
              <div className="flex space-x-2">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Popover
                      open={showStartDateCalendar}
                      onOpenChange={setShowStartDateCalendar}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          onClick={() => setShowStartDateCalendar(true)}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Fecha inicio</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="z-50 w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setShowStartDateCalendar(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Popover
                      open={showEndDateCalendar}
                      onOpenChange={setShowEndDateCalendar}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          onClick={() => setShowEndDateCalendar(true)}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Fecha fin</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setShowEndDateCalendar(false)
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="music">Música</SelectItem>
                      <SelectItem value="sports">Deportes</SelectItem>
                      <SelectItem value="arts">Arte y Cultura</SelectItem>
                      <SelectItem value="technology">Tecnología</SelectItem>
                      <SelectItem value="education">Educación</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <LocationSearch onChange={(value) => field.onChange(value)} />
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="timeOfDay">Hora del día</Label>
              <Controller
                name="timeOfDay"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="timeOfDay">
                      <SelectValue placeholder="Seleccionar hora del día" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">
                        Mañana (6:00 - 12:00)
                      </SelectItem>
                      <SelectItem value="afternoon">
                        Tarde (12:00 - 18:00)
                      </SelectItem>
                      <SelectItem value="evening">
                        Noche (18:00 - 24:00)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Button className="w-full" type="submit">
              Aplicar Filtros
            </Button>
          </form>
        </CardContent>
      </Card>
    </ScrollArea>
  )
}
