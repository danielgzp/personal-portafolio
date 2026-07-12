"use client"

import { Table } from "@tanstack/react-table"
import { Search, XCircle, Filter, SlidersHorizontal, Eye, Trash2 } from "lucide-react"
import { m, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
    <div className="px-5 py-3.5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/50 bg-muted/30">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          placeholder="Buscar por ID o contenido..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-11 pr-9 bg-background/50 rounded-xl h-9 border-border/50 focus-visible:ring-primary/20"
        />
        {globalFilter && (
          <button
            type="button"
            onClick={() => setGlobalFilter("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
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
          <SelectTrigger className="w-[130px] rounded-xl h-9 bg-background/40 border-border/50 text-sm flex items-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors">
            <Filter className="size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/50 bg-popover/95 backdrop-blur-md">
            <SelectItem value="all" className="rounded-xl cursor-pointer">Todos</SelectItem>
            <SelectItem value="Activa" className="rounded-xl text-foreground font-medium cursor-pointer">Activa</SelectItem>
            <SelectItem value="Inactiva" className="rounded-xl text-muted-foreground cursor-pointer">Inactiva</SelectItem>
            <SelectItem value="Error" className="rounded-xl text-destructive cursor-pointer">Error</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by Models */}
        <Select 
          value={(table.getColumn("models")?.getFilterValue() as string) ?? "all"} 
          onValueChange={(val) => table.getColumn("models")?.setFilterValue(val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-[160px] rounded-xl h-9 bg-background/40 border-border/50 text-sm flex items-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Modelos" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-border/50 bg-popover/95 backdrop-blur-md">
            <SelectItem value="all" className="rounded-xl cursor-pointer">Todos los modelos</SelectItem>
            {allUniqueModels.map((m) => (
              <SelectItem key={m} value={m} className="rounded-xl cursor-pointer">{formatModelBadge(m)}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 rounded-xl border border-border/50 bg-background/40 text-sm flex items-center gap-2 hover:bg-muted/40 cursor-pointer transition-colors px-3">
              <Eye className="size-3.5 text-muted-foreground" />
              Vista
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] rounded-2xl border-border/50 bg-popover/95 backdrop-blur-md p-1">
            {table.getAllColumns().filter(col => col.getCanHide()).map(col => (
              <DropdownMenuCheckboxItem
                key={col.id}
                className="capitalize rounded-xl cursor-pointer text-xs"
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
              <Button 
                variant="destructive" 
                className="rounded-xl h-9 whitespace-nowrap shadow-lg shadow-destructive/20 cursor-pointer"
                onClick={() => alert("Función de eliminación masiva pendiente de API")}
              >
                <Trash2 className="size-4 mr-2" />
                Eliminar ({rowSelectionCount})
              </Button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
