import * as React from "react"
import {
  closestCenter,
  DndContext,
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
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  CheckIcon,
  CloudOffIcon,
  FilterIcon,
  GripVerticalIcon,
  PlusIcon,
  SearchIcon,
  SlidersVerticalIcon,
  XIcon,
} from "lucide-react"

// import { useScroll } from "@/hooks/useScroll"
import { cn } from "@/lib/utils"

import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Separator } from "./ui/separator"

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"

interface OptionsProps<TData, TValue> {
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
    defaultSelected?: boolean
    disabled?: boolean
    group?: string
  }[]
  variant?: ButtonVariant
  showSelectedValues?: boolean
  onSavedViewChange?: (selectedValues: string[]) => void
  onSelectedValuesChange?: (selectedValues: Set<string>) => void
  enableDrag?: boolean
}

/** ----------------------------------------------------------------------------------------------
 * SortableItem
 * ----------------------------------------------------------------------------------------------- */
const SortableItem = ({
  id,
  children,
  handleSelect,
  enableDrag,
  disabled,
}: {
  id: string
  children: React.ReactNode
  handleSelect: (id: string) => void
  enableDrag: boolean
  disabled?: boolean
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const isDraggingRef = React.useRef(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  const handlePointerDown = (event: React.PointerEvent) => {
    if (disabled) return
    if (enableDrag) {
      timerRef.current = setTimeout(() => {
        isDraggingRef.current = true
      }, 200)
      listeners?.onPointerDown(event)
    }
  }

  const handlePointerUp = (event: React.PointerEvent) => {
    if (disabled) return
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!isDraggingRef.current) {
      handleSelect(id)
    }
    isDraggingRef.current = false
  }

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return
    if (isDraggingRef.current) {
      event.preventDefault()
      isDraggingRef.current = false
    }
  }

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={style}
      tabIndex={-1}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      className={cn(
        "hover:bg-accent group relative flex w-full items-center border-b px-2.5 py-2 last:border-none",
        {
          "cursor-not-allowed select-none opacity-75": disabled,
        }
      )}
    >
      {enableDrag && (
        <div
          className={cn(
            "flex cursor-move items-center justify-center opacity-0 group-hover:opacity-100",
            disabled && "opacity-0 group-hover:opacity-0"
          )}
        >
          <GripVerticalIcon className="text-muted-foreground -ml-1 text-sm" />
        </div>
      )}
      {children}
    </div>
  )
}

/** ----------------------------------------------------------------------------------------------
 * SortableGroup
 * ----------------------------------------------------------------------------------------------- */
const SortableGroup = ({
  group,
  items,
  selectedValues,
  handleSelect,
  onItemsChange,
  enableDrag,
}: {
  group?: string
  items: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  selectedValues: Set<string>
  handleSelect: (id: string) => void
  onItemsChange: (
    newItems: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  ) => void
  enableDrag: boolean
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    if (!enableDrag) return
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.value === active.id)
      const newIndex = items.findIndex((item) => item.value === over?.id)
      onItemsChange(arrayMove(items, oldIndex, newIndex))
    }
  }

  if (items.length === 0) return null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((item) => item.value)}>
        {group && (
          <div className="command-group p-0">
            <div className="command-group-heading mb-2 font-bold">{group}</div>
            {items.map((item) => renderCommandItem(item))}
          </div>
        )}
        {!group && items.map((item) => renderCommandItem(item))}
      </SortableContext>
    </DndContext>
  )

  function renderCommandItem(item: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
    disabled?: boolean
  }) {
    return (
      <SortableItem
        key={item.value}
        id={item.value}
        handleSelect={handleSelect}
        enableDrag={enableDrag}
        disabled={item.disabled}
      >
        <div className="flex items-center">
          <div
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                if (!item.disabled) {
                  handleSelect(item.value)
                }
              }
            }}
            className={cn(
              "border-primary focus:ring-primary/50 mr-2 flex size-4 items-center justify-center rounded-sm border focus:outline-none focus:ring",
              selectedValues.has(item.value)
                ? "bg-primary text-primary-foreground"
                : "opacity-50 [&_svg]:invisible"
            )}
          >
            <CheckIcon className={cn("size-4")} />
          </div>
          {item.icon && (
            <item.icon className="text-muted-foreground mr-2 size-4" />
          )}
          <span>{item.label}</span>
        </div>
      </SortableItem>
    )
  }
}

/** ----------------------------------------------------------------------------------------------
 * OptionsSelector
 * ----------------------------------------------------------------------------------------------- */
/**
 *
 * @param param0
 * @returns
 *
 * @example
 *
 * ```tsx
 * <OptionsSelector
 *  title="Options"
 * options={[
 *  { label: "Option 1", value: "option1" },
 *  { label: "Option 2", value: "option2" },
 *  { label: "Option 3", value: "option3" },
 * ]}
 * onSelectedValuesChange={(selectedValues) => console.log(selectedValues)}
 * />
 */
export function OptionsSelector<TData, TValue>({
  title,
  options,
  showSelectedValues = true,
  onSelectedValuesChange,
  onSavedViewChange,
  variant = "outline",
  enableDrag = false,
}: OptionsProps<TData, TValue>) {
  const initialSelectedValues = new Set(
    options
      .filter((option) => option.defaultSelected)
      .map((option) => option.value)
  )
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(
    initialSelectedValues
  )
  const [groupedItems, setGroupedItems] = React.useState(
    options.reduce(
      (groups, option) => {
        const group = option.group || ""
        if (!groups[group]) {
          groups[group] = []
        }
        groups[group].push(option)
        return groups
      },
      {} as Record<
        string,
        {
          label: string
          value: string
          icon?: React.ComponentType<{ className?: string }>
        }[]
      >
    )
  )

  // const [scrollState, scrollTo] = useScroll("options-scroll")

  const handleSelect = (value: string) => {
    setSelectedValues((prevSelectedValues) => {
      const newSelectedValues = new Set(prevSelectedValues)
      if (prevSelectedValues.has(value)) {
        newSelectedValues.delete(value)
      } else {
        newSelectedValues.add(value)
      }
      return newSelectedValues
    })
  }

  const handleSelectAll = () => {
    const selectableOptions = options.filter((option) => !option.disabled)
    const selectableValues = new Set(
      selectableOptions.map((option) => option.value)
    )

    const allSelected = Array.from(selectableValues).every((value) =>
      selectedValues.has(value)
    )

    const newSelectedValues = allSelected
      ? new Set(
          Array.from(selectedValues).filter(
            (value) =>
              !selectableValues.has(value) ||
              options.some(
                (option) => option.value === value && option.disabled
              )
          )
        )
      : new Set([
          ...Array.from(selectedValues),
          ...Array.from(selectableValues),
        ])

    setSelectedValues(newSelectedValues)
  }

  const handleSavedViewChange = (none = false) => {
    // Convert Set to Array

    const valuesArray = Array.from(selectedValues)

    // const csvValues = valuesArray.join(",")

    if (onSavedViewChange) {
      if (none) {
        onSavedViewChange([])
      } else {
        onSavedViewChange(valuesArray)
      }
      setIsOpen(false)
    }
  }

  const handleSelectNone = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedValues.size > 0) {
      setSelectedValues(new Set())
      handleSavedViewChange(true)
    } else {
      setIsOpen(!isOpen)
    }
  }

  React.useEffect(() => {
    if (onSelectedValuesChange) {
      onSelectedValuesChange(selectedValues)
    }
  }, [selectedValues])

  const updateItems = (
    group: string,
    newItems: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  ) => {
    setGroupedItems((prev) => ({
      ...prev,
      [group]: newItems,
    }))
  }

  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return groupedItems
    const newGroupedItems: Record<string, (typeof groupedItems)[string]> = {}
    for (const group in groupedItems) {
      newGroupedItems[group] = groupedItems[group].filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return newGroupedItems
  }, [searchQuery, groupedItems])

  const allFilteredItems = React.useMemo(() => {
    return Object.values(filteredItems).flat()
  }, [filteredItems])

  return (
    <Popover
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen)
        if (isOpen) {
          handleSavedViewChange()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant={variant} size="icon">
          {showSelectedValues ? (
            <FilterIcon
              onClick={handleSelectNone}
              className={cn(
                "size-4",
                selectedValues.size > 0
                  ? "rotate-45 text-red-700 hover:text-red-500"
                  : "text-foreground"
              )}
            />
          ) : (
            <SlidersVerticalIcon className="mr-1.5 size-4" />
          )}
          {title}

          {showSelectedValues && selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}

          {!showSelectedValues && selectedValues.size > 0 && (
            <Badge
              variant="destructive"
              className="ml-1.5 rounded-full px-1.5 font-normal"
            >
              {selectedValues.size}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="max-w-[300px] rounded-lg p-3 shadow-lg"
        align="end"
      >
        <div className="command">
          {/* <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => handleSavedViewChange()}
            >
              Guardar vista
            </Button>
          </div> */}
          <div className="flex h-8 items-center justify-between rounded-md border px-2 py-1.5">
            <input
              type="text"
              className="command-input placeholder:text-muted-foreground flex w-full bg-transparent text-sm focus:outline-none"
              placeholder={`Buscar ${title?.toLowerCase()}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery ? (
              <button
                className="ml-2 flex items-center justify-center rounded-full bg-gray-100 p-1"
                onClick={() => setSearchQuery("")}
              >
                <XIcon className="text-muted-foreground size-4" />
              </button>
            ) : (
              <SearchIcon className="text-muted-foreground size-4" />
            )}
          </div>
          <div
            // id="options-scroll"
            className="command-body mt-2 max-h-[275px] select-none overflow-y-auto overflow-x-hidden"
          >
            {searchQuery === "" && (
              <div
                className={cn(
                  "hover:bg-accent bg-card flex cursor-pointer items-center px-1 py-2"
                )}
                onClick={handleSelectAll}
              >
                <div
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      handleSelectAll()
                    }
                  }}
                  className={cn(
                    "border-primary focus:ring-primary/50 mr-2 flex size-4 items-center justify-center rounded-sm border focus:outline-none focus:ring",
                    selectedValues.size === options.length
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <input
                    tabIndex={1}
                    type="checkbox"
                    checked={Array.from(
                      options
                        .filter((option) => !option.disabled)
                        .map((option) => option.value)
                    ).every((value) => selectedValues.has(value))}
                    // onChange={handleSelectAll}
                    className="absolute opacity-0"
                  />
                  <CheckIcon className="size-4" />
                </div>
                <span className="font-semibold">Select All</span>
                {selectedValues.size > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-auto rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} Selected
                  </Badge>
                )}
              </div>
            )}
            <Separator />
            {allFilteredItems.length > 0 ? (
              Object.keys(filteredItems).map(
                (group) =>
                  filteredItems[group].length > 0 && (
                    <React.Fragment key={group}>
                      <SortableGroup
                        group={group}
                        items={filteredItems[group]}
                        selectedValues={selectedValues}
                        handleSelect={handleSelect}
                        onItemsChange={(newItems) =>
                          updateItems(group, newItems)
                        }
                        enableDrag={enableDrag}
                      />
                      <Separator />
                    </React.Fragment>
                  )
              )
            ) : (
              <div className="text-muted-foreground flex h-full flex-col items-center justify-center text-center">
                <CloudOffIcon className="mb-4 size-12" />
                <p>No se encontraron resultados</p>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
