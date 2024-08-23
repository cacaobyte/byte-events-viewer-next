"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { GripVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onNewRow?: () => void
  onRowsReorder?: (newOrder: TData[]) => void
}

function SortableRow<TData extends { id: string }>({
  row,
  children,
  isOverlay = false,
}: {
  row: TData
  children: React.ReactNode
  isOverlay?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isOverlay ? 0.95 : isDragging ? 0.6 : 1,
    backgroundColor: isDragging || isOverlay ? "#e5e7eb" : "transparent",
    borderRadius: isOverlay ? "0.375rem" : "none",
    boxShadow: isOverlay ? "0 8px 16px rgba(0, 0, 0, 0.1)" : "none",
    border: isOverlay ? "1px solid #d1d5db" : "none",
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "scale-95 transition-transform" : ""}
      {...attributes}
    >
      <TableCell className="w-12">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-grab touch-none hover:bg-gray-200"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-gray-500" />
          <span className="sr-only">Reordenar</span>
        </Button>
      </TableCell>
      {children}
    </TableRow>
  )
}

export function DataTable<TData extends { id: string }, TValue>({
  columns,
  data,
  onNewRow,
  onRowsReorder,
}: DataTableProps<TData, TValue>) {
  const [rows, setRows] = React.useState(data)
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => setRows(data), [data])

  const sensors = useSensors(useSensor(PointerSensor))

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleDragStart = ({ active }: { active: { id: string | number } }) =>
    setActiveId(String(active.id))

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveId(null)
    if (active.id !== over?.id) {
      setRows((prevRows) => {
        const oldIndex = prevRows.findIndex(
          (row) => row.id === String(active.id)
        )
        const newIndex = prevRows.findIndex(
          (row) => row.id === String(over?.id)
        )
        const newOrder = arrayMove(prevRows, oldIndex, newIndex)
        if (onRowsReorder) onRowsReorder(newOrder)
        return newOrder
      })
    }
  }

  const activeRow = rows.find((row) => row.id === activeId)

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} onNewRow={onNewRow} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={rows.map((row) => row.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-gray-50">
                    <TableHead className="w-10 h-8" />
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="text-gray-700 p-2"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <SortableRow key={row.id} row={row.original}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="p-2 align-middle">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </SortableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-500"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SortableContext>
        <DragOverlay>
          {activeRow && (
            <SortableRow row={activeRow} isOverlay>
              {table
                .getRowModel()
                .rows.find((row) => row.original.id === activeRow.id)
                ?.getVisibleCells()
                .map((cell) => (
                  <TableCell key={cell.id} className="p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
            </SortableRow>
          )}
        </DragOverlay>
      </DndContext>
      <DataTablePagination table={table} />
    </div>
  )
}
