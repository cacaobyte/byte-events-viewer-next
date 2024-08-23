"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.string().min(1, { message: "Type is required" }),
  obligatory: z.enum(["y", "n"]),
})

type FormValues = z.infer<typeof formSchema>

interface AddFieldFormProps {
  onAddField: (newField: FormField) => void
}

interface FormField {
  id: string
  title: string
  type: string
  obligatory: string
}

const fieldTypes = [
  { label: "Text", value: "text" },
  { label: "Email", value: "email" },
  { label: "Teléfono", value: "tel" },
  { label: "Textarea", value: "textarea" },
]

export function AddFieldForm({ onAddField }: AddFieldFormProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      obligatory: "n",
    },
  })

  const onSubmit = (data: FormValues) => {
    const newField: FormField = {
      id: data.title.toLowerCase().replace(/\s/g, "-"),
      ...data,
    }
    onAddField(newField)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input placeholder="Enter field title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {field.value
                        ? fieldTypes.find((type) => type.value === field.value)
                            ?.label
                        : "Select field type"}
                      <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto min-w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search field type..." />
                    <CommandEmpty>No field type found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {fieldTypes.map((type) => (
                          <CommandItem
                            key={type.value}
                            value={type.value}
                            onSelect={() => {
                              form.setValue("type", type.value)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 size-4",
                                field.value === type.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {type.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="obligatory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Obligatorio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "",
                      field.value === "y" ? "bg-green-200" : "bg-rose-200"
                    )}
                  >
                    <SelectValue placeholder="Is this field obligatory?" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem
                    className="bg-green-100 focus:bg-green-300 focus:hover:bg-green-500"
                    value="y"
                  >
                    Si
                  </SelectItem>
                  <SelectItem
                    className="bg-rose-100 focus:bg-rose-300 focus:hover:bg-rose-500"
                    value="n"
                  >
                    No
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Guardar
        </Button>
      </form>
    </Form>
  )
}
