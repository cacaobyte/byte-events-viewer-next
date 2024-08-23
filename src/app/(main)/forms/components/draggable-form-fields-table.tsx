"use client"

import React, { useState } from "react"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ChevronDown,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type FormField = {
  id: string
  title: string
  type: string
  required: boolean
}

const SortableTableRow = ({
  field,
  isSelected,
  onCheckboxChange,
}: {
  field: FormField
  isSelected: boolean
  onCheckboxChange: (id: string) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 1 : "auto",
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onCheckboxChange(field.id)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
            <span className="sr-only">Reordenar</span>
          </Button>
          <div className="ml-2">
            <div className="font-medium">{field.title}</div>
            <div className="text-sm text-muted-foreground">{field.type}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={field.required ? "default" : "secondary"}>
          {field.required ? "Obligatorio" : "Opcional"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Trash className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Más opciones</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export default function Component() {
  const [formFields, setFormFields] = useState<FormField[]>([
    { id: "1", title: "Nombre", type: "text", required: true },
    { id: "2", title: "Email", type: "email", required: true },
    { id: "3", title: "Teléfono", type: "tel", required: false },
    { id: "4", title: "Mensaje", type: "textarea", required: false },
  ])

  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<keyof FormField | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterValue, setFilterValue] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setFormFields((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSort = (column: keyof FormField) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleCheckboxChange = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    )
  }

  const filteredAndSortedFields = formFields
    .filter(
      (field) =>
        field.title.toLowerCase().includes(filterValue.toLowerCase()) ||
        field.type.toLowerCase().includes(filterValue.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortColumn) return 0
      if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1
      return 0
    })

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Filtrar campos..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columnas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(formFields[0]).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={true}
                onCheckedChange={() => {}}
              >
                {key}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === formFields.length}
                  onCheckedChange={(checked) => {
                    setSelectedRows(checked ? formFields.map((f) => f.id) : [])
                  }}
                />
              </TableHead>
              <TableHead className="w-[40%]">
                <Button variant="ghost" onClick={() => handleSort("title")}>
                  Campo{" "}
                  {sortColumn === "title" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
              </TableHead>
              <TableHead className="w-[30%]">
                <Button variant="ghost" onClick={() => handleSort("required")}>
                  Obligatorio{" "}
                  {sortColumn === "required" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
              </TableHead>
              <TableHead className="w-[30%]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext
              items={filteredAndSortedFields}
              strategy={verticalListSortingStrategy}
            >
              {filteredAndSortedFields.map((field) => (
                <SortableTableRow
                  key={field.id}
                  field={field}
                  isSelected={selectedRows.includes(field.id)}
                  onCheckboxChange={handleCheckboxChange}
                />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </div>
  )
}
