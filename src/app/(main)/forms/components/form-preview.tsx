"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type FormField = {
  id: string
  title: string
  type: string
  obligatory: string
}

type FormPreviewProps = {
  fields: FormField[]
}

const countryData = {
  GT: { name: "Guatemala", code: "+502", digits: 8 },
  MX: { name: "México", code: "+52", digits: 10 },
  HN: { name: "Honduras", code: "+504", digits: 8 },
}

const FormPreview: React.FC<FormPreviewProps> = ({ fields }) => {
  const [selectedCountries, setSelectedCountries] = useState<
    Record<string, keyof typeof countryData>
  >(
    fields
      .filter((field) => field.type === "tel")
      .reduce(
        (acc, field) => {
          acc[field.id] = "GT"
          return acc
        },
        {} as Record<string, keyof typeof countryData>
      )
  )
  const [isFieldTouched, setIsFieldTouched] = useState(false)

  const formSchema = z.object(
    fields.reduce((acc, field) => {
      let fieldSchema: z.ZodType<any, any> = z.string()

      if (field.type === "tel") {
        fieldSchema = z
          .string()
          .optional()
          .refine(
            (value) => {
              const countryKey = selectedCountries[field.id] || "GT"
              const digits = countryData[countryKey]?.digits
              return (
                !value || (value.length === digits && /^[0-9]+$/.test(value))
              )
            },
            {
              message: () => {
                const countryKey = selectedCountries[field.id] || "GT"
                const country = countryData[countryKey]
                return `El número de teléfono debe tener ${country.digits} dígitos y contener solo números para ${country.name}`
              },
            }
          )
      }

      if (field.obligatory === "y") {
        fieldSchema = z.string().min(1, {
          message: `${field.title} es obligatorio`,
        })
      }

      acc[field.id] = fieldSchema
      return acc
    }, {} as z.ZodRawShape)
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: fields.reduce(
      (acc, field) => ({ ...acc, [field.id]: "" }),
      {}
    ),
  })

  useEffect(() => {
    form.clearErrors()
  }, [selectedCountries])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const isValid = await form.trigger()
    if (!isValid) {
      setIsFieldTouched(true)
      return
    }

    console.log("Form submitted with data:", data)
  }

  const clearPhoneNumber = (fieldId: string) => {
    form.setValue(fieldId, "")
    setIsFieldTouched(false)
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Vista Previa del Formulario</CardTitle>
        <CardDescription>
          Esta es una vista previa interactiva de tu formulario
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.id}
                control={form.control}
                name={field.id}
                render={({ field: formField, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {field.title}
                      {field.obligatory === "y" && (
                        <span className="text-destructive">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      {field.type === "tel" ? (
                        <div className="relative flex items-center space-x-2">
                          <select
                            value={selectedCountries[field.id] || "GT"}
                            onChange={(e) =>
                              setSelectedCountries((prev) => ({
                                ...prev,
                                [field.id]: e.target
                                  .value as keyof typeof countryData,
                              }))
                            }
                            className="w-fit max-w-fit rounded-md border bg-gray-100 px-3 py-2"
                          >
                            <option value="GT">🇬🇹 Guatemala</option>
                            <option value="MX">🇲🇽 México</option>
                            <option value="HN">🇭🇳 Honduras</option>
                          </select>
                          <div className="rounded-md border bg-gray-100 p-2">
                            {
                              countryData[selectedCountries[field.id] || "GT"]
                                ?.code
                            }
                          </div>
                          <Input
                            type="tel"
                            placeholder={`Número de teléfono (${countryData[selectedCountries[field.id] || "GT"]?.digits} dígitos)`}
                            {...formField}
                            value={(formField.value || "").replace(
                              countryData[selectedCountries[field.id] || "GT"]
                                ?.code || "",
                              ""
                            )}
                            onChange={formField.onChange}
                            onBlur={() => {
                              setIsFieldTouched(true)
                              formField.onBlur()
                            }}
                            onFocus={() => setIsFieldTouched(false)}
                          />
                          {formField.value && (
                            <button
                              type="button"
                              onClick={() => clearPhoneNumber(field.id)}
                              className="absolute right-2 mr-10 text-gray-500 hover:text-red-600"
                            >
                              <XCircle className="size-5" />
                            </button>
                          )}
                        </div>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          placeholder={`Enter ${field.title.toLowerCase()}`}
                          {...formField}
                        />
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={`Enter ${field.title.toLowerCase()}`}
                          {...formField}
                        />
                      )}
                    </FormControl>
                    {(isFieldTouched || fieldState.error) && <FormMessage />}
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

export default FormPreview
