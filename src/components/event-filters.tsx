"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

const categories = [
  { value: "music", label: "Música" },
  { value: "sports", label: "Deportes" },
  { value: "arts", label: "Arte y Cultura" },
  { value: "food", label: "Gastronomía" },
  { value: "technology", label: "Tecnología" },
]

const formSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  categories: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
  priceRange: z.tuple([z.number(), z.number()]),
  maxPrice: z.number().min(0, "El precio máximo debe ser mayor o igual a 0"),
  onlyFreeEvents: z.boolean(),
})

export default function EventFilters({ onFilterChange }) {
  const [previousMaxPrice, setPreviousMaxPrice] = useState(1000)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      categories: [],
      priceRange: [0, 1000],
      maxPrice: 1000,
      onlyFreeEvents: false,
    },
  })

  const { watch, setValue } = form

  const onlyFreeEvents = watch("onlyFreeEvents")
  const maxPrice = watch("maxPrice")

  useEffect(() => {
    if (onlyFreeEvents) {
      setPreviousMaxPrice(maxPrice)
      setValue("maxPrice", 0)
      setValue("priceRange", [0, 0])
    } else if (maxPrice === 0) {
      setValue("maxPrice", previousMaxPrice)
      setValue("priceRange", [0, previousMaxPrice])
    }
  }, [onlyFreeEvents, maxPrice, setValue, previousMaxPrice])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onFilterChange(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card space-y-4 rounded-lg p-4 shadow"
      >
        <h2 className="mb-4 text-2xl font-bold">Filtros de Eventos</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de fin</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Categorías</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length
                        ? `${field.value.length} categorías seleccionadas`
                        : "Seleccionar categorías"}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar categoría..." />
                    <CommandEmpty>No se encontraron categorías.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          value={category.value}
                          key={category.value}
                          onSelect={() => {
                            const newValue = field.value.includes(
                              category.value
                            )
                              ? field.value.filter(
                                  (item) => item !== category.value
                                )
                              : [...field.value, category.value]
                            field.onChange(newValue)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 size-4",
                              field.value.includes(category.value)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {category.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceRange"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Rango de precios</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={1}
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={onlyFreeEvents}
                />
              </FormControl>
              <div className="text-muted-foreground flex justify-between text-sm">
                <span>${field.value[0]}</span>
                <span>${field.value[1]}</span>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxPrice"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Precio máximo</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseInt(e.target.value, 10)
                    field.onChange(value)
                    setValue("onlyFreeEvents", value === 0)
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      field.onChange(0)
                      setValue("onlyFreeEvents", true)
                    }
                  }}
                  min={0}
                  step={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="onlyFreeEvents"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Solo eventos gratuitos
                </FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    if (checked) {
                      setValue("maxPrice", 0)
                      setValue("priceRange", [0, 0])
                    } else {
                      setValue("maxPrice", previousMaxPrice)
                      setValue("priceRange", [0, previousMaxPrice])
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Aplicar Filtros
        </Button>
      </form>
    </Form>
  )
}
