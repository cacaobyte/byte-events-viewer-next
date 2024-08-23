"use client"

import React, { useState } from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ContentLayout } from "@/components/admin-panel/content-layout"

import { AddFieldForm } from "./components/add-field-form"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import FormPreview from "./components/form-preview"

interface FormField {
  id: string
  title: string
  type: string
  obligatory: string
}

export default function FormPage() {
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "name", title: "Nombre", type: "text", obligatory: "y" },
    { id: "email", title: "Email", type: "email", obligatory: "y" },
    { id: "phone", title: "Teléfono", type: "tel", obligatory: "n" },
    { id: "message", title: "Mensaje", type: "textarea", obligatory: "n" },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRowsReorder = (newOrder: FormField[]) => {
    console.log("New order:", newOrder)
    setFormFields(newOrder)
  }

  const handleAddField = (newField: FormField) => {
    setFormFields([...formFields, newField])
    setIsDialogOpen(false)
  }

  const handleNewRow = () => {
    setIsDialogOpen(true)
  }

  return (
    <ContentLayout title="Generación de Formularios">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/home">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Generación de Formularios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Campo</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when youre done.
                </DialogDescription>
              </DialogHeader>
              <AddFieldForm onAddField={handleAddField} />
            </DialogContent>
          </Dialog>
          <DataTable
            data={formFields}
            columns={columns}
            onNewRow={handleNewRow}
            onRowsReorder={handleRowsReorder}
          />
        </div>
        <FormPreview fields={formFields} />
      </div>
    </ContentLayout>
  )
}
