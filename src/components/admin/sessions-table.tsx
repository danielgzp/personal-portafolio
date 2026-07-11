"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { motion, AnimatePresence } from "framer-motion"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { DeleteSessionDialog } from "./delete-session-dialog"
import { SessionDetail } from "./session-detail"
import {
  Search,
  Trash2,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  XCircle,
  MoreHorizontal,
  Copy,
} from "lucide-react"

type Message = {
  id: number
  model: string | null
  created_at: string
  user_query: string | null
  ai_response: string | null
  rag_context_used: boolean | null
  prompt_tokens: number | null
  completion_tokens: number | null
  generation_time_ms: number | null
  error_message: string | null
}

type Session = {
  id: string
  created_at: string
  updated_at: string
  message_count: number
  last_activity: string
  last_user_query: string
  models: string[]
  chat_messages?: Message[]
}

interface SessionsTableProps {
  sessions: Session[]
}

const SPRING_SOFT = { stiffness: 280, damping: 22 }

export function SessionsTable({ sessions: initialSessions }: SessionsTableProps) {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  
  // TanStack Table State
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  // UI State
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatModelBadge = (modelId: string) => {
    if (!modelId) return ""
    const parts = modelId.split("/")
    return parts[parts.length - 1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const handleViewSession = (session: Session) => {
    setActiveSession(session)
    setIsSheetOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setSessionToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/sessions/${sessionToDelete}`, { method: "DELETE" })
      if (response.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionToDelete))
        if (activeSession?.id === sessionToDelete) setIsSheetOpen(false)
        setRowSelection({})
        router.refresh()
      } else {
        const err = await response.json()
        alert(`Error al eliminar: ${err.error || "Error desconocido"}`)
      }
    } catch (error) {
      console.error("Error deleting session:", error)
      alert("Error al eliminar la sesión de chat.")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setSessionToDelete(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const allUniqueModels = useMemo(() => {
    const modelsSet = new Set<string>()
    initialSessions.forEach((s) => s.models.forEach((m) => modelsSet.add(m)))
    return Array.from(modelsSet)
  }, [initialSessions])

  const columns = useMemo<ColumnDef<Session>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="px-1 flex items-center justify-center">
          <input
            type="checkbox"
            className="size-4 cursor-pointer rounded border-border bg-background/50 text-primary focus:ring-primary/50"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            className="size-4 cursor-pointer rounded border-border bg-background/50 text-primary focus:ring-primary/50"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
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
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:bg-muted/50 -ml-2">
            Fecha Creación
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-sm font-medium">{formatDate(row.getValue("created_at"))}</div>,
    },
    {
      id: "status",
      header: "Estado",
      accessorFn: (row) => {
        const hasError = row.chat_messages?.some(m => m.error_message)
        const isRecent = (new Date().getTime() - new Date(row.last_activity).getTime()) < 24 * 60 * 60 * 1000
        return hasError ? "Error" : (isRecent ? "Activa" : "Inactiva")
      },
      filterFn: "equalsString",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        if (status === "Error") return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 font-semibold">Error</Badge>
        if (status === "Activa") return <Badge variant="secondary" className="bg-foreground text-background font-bold border-transparent">Activa</Badge>
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border/50 font-medium">Inactiva</Badge>
      }
    },
    {
      accessorKey: "message_count",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:bg-muted/50 -ml-2">
            Mensajes
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
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
        const models = row.getValue(columnId) as string[]
        return filterValue === "all" ? true : models.includes(filterValue)
      },
      cell: ({ row }) => {
        const models = row.getValue("models") as string[]
        return (
          <div className="flex flex-wrap gap-1">
             {models.map((m, i) => <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 border-border/60">{formatModelBadge(m)}</Badge>)}
          </div>
        )
      }
    },
    {
      id: "actions",
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
              <DropdownMenuItem onClick={() => handleViewSession(row.original)} className="cursor-pointer rounded-lg text-sm">
                <Eye className="mr-2 size-4" /> Ver Detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => copyToClipboard(row.original.id)} className="cursor-pointer rounded-lg text-sm">
                <Copy className="mr-2 size-4" /> Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/40" />
              <DropdownMenuItem onClick={() => handleDeleteClick(row.original.id)} className="cursor-pointer rounded-lg text-sm text-destructive focus:bg-destructive/10 focus:text-destructive">
                <Trash2 className="mr-2 size-4" /> Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  ], [])

  const table = useReactTable({
    data: sessions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: 8 },
    },
  })

  return (
    <div className="space-y-6">
      {/* Top Bar: Search and Filters */}
      <Card className="border border-border/50 bg-card/60 shadow-xl backdrop-blur-md rounded-3xl overflow-hidden">
        <CardContent className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID o contenido..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-11 pr-9 bg-background/50 rounded-full h-10 border-border/40 focus-visible:ring-primary/20"
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
            <Select 
              value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"} 
              onValueChange={(val) => table.getColumn("status")?.setFilterValue(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-[130px] rounded-full h-10 bg-background/40 border-border/50 text-sm">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 bg-popover/95 backdrop-blur-md">
                <SelectItem value="all" className="rounded-xl">Todos</SelectItem>
                <SelectItem value="Activa" className="rounded-xl text-foreground font-medium">Activa</SelectItem>
                <SelectItem value="Inactiva" className="rounded-xl text-muted-foreground">Inactiva</SelectItem>
                <SelectItem value="Error" className="rounded-xl text-destructive">Error</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={(table.getColumn("models")?.getFilterValue() as string) ?? "all"} 
              onValueChange={(val) => table.getColumn("models")?.setFilterValue(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-[160px] rounded-full h-10 bg-background/40 border-border/50 text-sm">
                <SelectValue placeholder="Modelos" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/50 bg-popover/95 backdrop-blur-md">
                <SelectItem value="all" className="rounded-xl">Todos los modelos</SelectItem>
                {allUniqueModels.map((m) => (
                  <SelectItem key={m} value={m} className="rounded-xl">{formatModelBadge(m)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AnimatePresence>
              {Object.keys(rowSelection).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: "auto" }}
                  exit={{ opacity: 0, scale: 0.95, width: 0 }}
                  transition={SPRING_SOFT}
                  className="overflow-hidden"
                >
                  <Button 
                    variant="destructive" 
                    className="rounded-full h-10 whitespace-nowrap shadow-lg shadow-destructive/20"
                    onClick={() => alert("Función de eliminación masiva pendiente de API")}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Eliminar ({Object.keys(rowSelection).length})
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Main Table */}
      <div className="rounded-3xl border border-border/50 bg-card/40 p-2 shadow-sm backdrop-blur-xs overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 align-middle">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  data-state={row.getIsSelected() && "selected"} 
                  onClick={() => handleViewSession(row.original)}
                  className="group border-b border-border/20 last:border-0 hover:bg-muted/30 cursor-pointer transition-all duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4 px-4 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                    <Search className="size-8 opacity-20 mb-2" />
                    <span className="font-medium">No se encontraron sesiones.</span>
                    <span className="text-xs opacity-70">Ajusta los filtros o la búsqueda para encontrar resultados.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Section */}
        {table.getPageCount() > 0 && (
          <div className="flex items-center justify-between px-4 py-4 mt-2 border-t border-border/30">
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Filas por página</span>
              <Select 
                value={`${table.getState().pagination.pageSize}`} 
                onValueChange={(val) => table.setPageSize(Number(val))}
              >
                <SelectTrigger className="h-8 w-16 rounded-xl bg-background/50 border-border/40 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-md min-w-16">
                  {[8, 15, 25, 50].map(size => (
                    <SelectItem key={size} value={`${size}`} className="text-xs rounded-lg">{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground font-medium">
                Pág. {table.getState().pagination.pageIndex + 1} de {table.getPageCount()} <span className="hidden sm:inline">({table.getFilteredRowModel().rows.length} total)</span>
              </span>
              
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="icon" className="size-8 rounded-full border-border/40" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button variant="outline" size="icon" className="size-8 rounded-full border-border/40" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="outline" size="icon" className="size-8 rounded-full border-border/40" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <ChevronRight className="size-4" />
                </Button>
                <Button variant="outline" size="icon" className="size-8 rounded-full border-border/40" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-[85vw] border-l border-border bg-background/95 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full">
          {activeSession && (
            <div className="flex flex-col h-full overflow-hidden">
              <SheetHeader className="border-b border-border/50 p-6 bg-muted/20">
                <div className="space-y-2">
                  <SheetTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-muted text-muted-foreground">
                      <Calendar className="size-4" />
                    </span>
                    Detalle del Chat
                  </SheetTitle>
                  <SheetDescription className="text-xs font-mono text-muted-foreground break-all select-all">
                    ID Sesión: {activeSession.id}
                  </SheetDescription>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <SessionDetail session={activeSession} hideHeader={true} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <DeleteSessionDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        sessionId={sessionToDelete}
      />
    </div>
  )
}
