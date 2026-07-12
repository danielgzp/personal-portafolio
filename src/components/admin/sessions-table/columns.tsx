"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Eye, Copy, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Session } from "../types"

export const COLUMN_LABELS: Record<string, string> = {
  id: "ID Sesión",
  created_at: "Fecha Creación",
  status: "Estado",
  message_count: "Mensajes",
  last_user_query: "Último Mensaje",
  models: "Modelos",
}

export const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const formatModelBadge = (modelId: string) => {
  if (!modelId) return ""
  const parts = modelId.split("/")
  return parts[parts.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

interface ColumnActions {
  onViewSession: (session: Session) => void
  onDeleteClick: (id: string) => void
  onCopyId: (id: string) => void
}

export const getColumns = (actions: ColumnActions): ColumnDef<Session>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-1 flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID Sesión",
    cell: ({ row }) => (
      <div className="font-mono text-xs font-semibold text-foreground/80 hover:text-primary transition-colors">
        <span className="md:hidden">{String(row.getValue("id")).slice(0, 8)}</span>
        <span className="hidden md:inline">{row.getValue("id")}</span>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <div 
          onClick={() => column.toggleSorting(isSorted === "asc")} 
          className="flex items-center gap-1.5 cursor-pointer hover:text-foreground select-none transition-colors"
        >
          <span>Fecha Creación</span>
          <ArrowUpDown className={cn("size-3 transition-colors", isSorted ? "text-foreground" : "text-muted-foreground/30")} />
        </div>
      )
    },
    cell: ({ row }) => <div className="text-sm font-medium">{formatDate(row.getValue("created_at"))}</div>,
  },
  {
    id: "status",
    header: "Estado",
    accessorFn: (row) => {
      const hasError = row.chat_messages?.some(m => m.error_message)
      const isRecent = row.last_activity ? (new Date().getTime() - new Date(row.last_activity).getTime()) < 24 * 60 * 60 * 1000 : false
      return hasError ? "Error" : (isRecent ? "Activa" : "Inactiva")
    },
    filterFn: "equalsString",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      if (status === "Error") return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-semibold rounded-full px-2.5 py-0.5 text-xs">Error</Badge>
      if (status === "Activa") return <Badge variant="secondary" className="bg-foreground text-background dark:bg-neutral-100 dark:text-neutral-900 border-none font-bold rounded-full px-3 py-1 text-xs">Activa</Badge>
      return <Badge variant="outline" className="bg-muted text-muted-foreground border-border/50 font-medium rounded-full px-2.5 py-0.5 text-xs">Inactiva</Badge>
    }
  },
  {
    accessorKey: "message_count",
    header: ({ column }) => {
      const isSorted = column.getIsSorted()
      return (
        <div 
          onClick={() => column.toggleSorting(isSorted === "asc")} 
          className="flex items-center gap-1.5 cursor-pointer hover:text-foreground select-none transition-colors"
        >
          <span>Mensajes</span>
          <ArrowUpDown className={cn("size-3 transition-colors", isSorted ? "text-foreground" : "text-muted-foreground/30")} />
        </div>
      )
    },
    cell: ({ row }) => <Badge variant="secondary" className="px-2.5 rounded-full font-semibold">{row.getValue("message_count")}</Badge>,
  },
  {
    accessorKey: "last_user_query",
    header: "Último Mensaje",
    cell: ({ row }) => {
      const val = row.getValue("last_user_query") as string
      return (
        <div className="max-w-[200px] truncate text-xs text-muted-foreground group-hover:text-foreground/90 transition-colors">
          {val || <span className="italic opacity-50">Sin mensajes</span>}
        </div>
      )
    }
  },
  {
    accessorKey: "models",
    header: "Modelos",
    filterFn: (row, columnId, filterValue) => {
      const models = row.getValue(columnId) as string[] | undefined
      return filterValue === "all" ? true : (models?.includes(filterValue) ?? false)
    },
    cell: ({ row }) => {
      const models = row.getValue("models") as string[] | undefined
      return (
        <div className="flex flex-wrap gap-1">
           {models?.map((m, i) => <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 border-border/60">{formatModelBadge(m)}</Badge>)}
        </div>
      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0 hover:bg-muted rounded-full">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] rounded-xl border-border/50 bg-popover/95 backdrop-blur-md">
            <DropdownMenuItem onClick={() => actions.onViewSession(row.original)} className="cursor-pointer rounded-lg text-sm">
              <Eye className="mr-2 size-4" /> Ver Detalles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => actions.onCopyId(row.original.id)} className="cursor-pointer rounded-lg text-sm">
              <Copy className="mr-2 size-4" /> Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem variant="destructive" onClick={() => actions.onDeleteClick(row.original.id)} className="cursor-pointer rounded-lg text-sm">
              <Trash2 className="mr-2 size-4" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
]
