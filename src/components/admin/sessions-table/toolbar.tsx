"use client"

import { Table } from "@tanstack/react-table"
import { Search, XCircle, Filter, SlidersHorizontal, Eye, Trash2 } from "lucide-react"
import { m, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Session } from "../types"
import { COLUMN_LABELS, formatModelBadge } from "./columns"

const SPRING_SOFT = { stiffness: 280, damping: 22 }

interface SessionsTableToolbarProps {
  table: Table<Session>
  globalFilter: string
  setGlobalFilter: (value: string) => void
  allUniqueModels: string[]
}

export function SessionsTableToolbar({
  table,
  globalFilter,
  setGlobalFilter,
  allUniqueModels,
}: SessionsTableToolbarProps) {
  const rowSelectionCount = Object.keys(table.getState().rowSelection).length

  return (
    <div className="flex flex-col gap-4 px-5 py-3.5 md:flex-row md:items-center md:justify-between">
      <div className="relative max-w-lg flex-1">
        <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          placeholder="Buscar por ID o contenido..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pr-9 pl-11"
        />
        {globalFilter && (
          <button
            type="button"
            onClick={() => setGlobalFilter("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            <XCircle className="size-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Filter by Status */}
        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(val) => table.getColumn("status")?.setFilterValue(val === "all" ? "" : val)}
        >
          <SelectTrigger>
            <Filter className="size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Active">Activa</SelectItem>
            <SelectItem value="Inactive">Inactiva</SelectItem>
            <SelectItem value="Error">Error</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by Models */}
        <Select
          value={(table.getColumn("models")?.getFilterValue() as string) ?? "all"}
          onValueChange={(val) => table.getColumn("models")?.setFilterValue(val === "all" ? "" : val)}
        >
          <SelectTrigger>
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Modelos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los modelos</SelectItem>
            {allUniqueModels.map((m) => (
              <SelectItem key={m} value={m}>
                {formatModelBadge(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Eye className="size-3.5 text-muted-foreground" />
              Vista
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="cursor-pointer rounded-xl text-xs capitalize"
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {COLUMN_LABELS[col.id] || col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Selection actions */}
        <AnimatePresence>
          {rowSelectionCount > 0 && (
            <m.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={SPRING_SOFT}
            >
              <Button variant="destructive" onClick={() => alert("Funcón de eliminación masiva pendiente de API")}>
                <Trash2 className="mr-2 size-4" />
                Eliminar ({rowSelectionCount})
              </Button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
