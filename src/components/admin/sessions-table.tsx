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
  VisibilityState,
} from "@tanstack/react-table"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
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
import { Card } from "@/components/ui/card"
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
  DropdownMenuCheckboxItem,
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
  SlidersHorizontal,
  Filter,
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

const COLUMN_LABELS: Record<string, string> = {
  id: "ID Sesión",
  created_at: "Fecha Creación",
  status: "Estado",
  message_count: "Mensajes",
  last_user_query: "Último Mensaje",
  models: "Modelos",
}

export function SessionsTable({ sessions: initialSessions }: SessionsTableProps) {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  
  // TanStack Table State
  const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

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
            className="size-4 cursor-pointer rounded border border-neutral-300 dark:border-neutral-700 bg-background/50 text-primary focus:ring-primary/50 transition-all checked:bg-primary checked:border-primary"
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
            className="size-4 cursor-pointer rounded border border-neutral-300 dark:border-neutral-700 bg-background/50 text-primary focus:ring-primary/50 transition-all checked:bg-primary checked:border-primary"
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
        const isRecent = (new Date().getTime() - new Date(row.last_activity).getTime()) < 24 * 60 * 60 * 1000
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
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
      columnVisibility,
    },
    initialState: {
      pagination: { pageSize: 8 },
    },
  })

  return (
    <div className="space-y-6">
      <Card className="border border-border/40 bg-card/60 shadow-xl backdrop-blur-md rounded-3xl overflow-hidden">
        {/* Top Bar: Search and Filters */}
        <div className="p-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/10 bg-card/15">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
            <Input
              placeholder="Buscar por ID o contenido..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-11 pr-9 bg-background/50 rounded-xl h-10 border-border/40 focus-visible:ring-primary/20"
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
              <SelectTrigger className="w-[130px] rounded-xl h-10 bg-background/40 border-border/50 text-sm flex items-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors">
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
              <SelectTrigger className="w-[160px] rounded-xl h-10 bg-background/40 border-border/50 text-sm flex items-center gap-2 cursor-pointer hover:bg-muted/40 transition-colors">
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
                <Button variant="outline" size="sm" className="h-10 rounded-xl border border-border/50 bg-background/40 text-sm flex items-center gap-2 hover:bg-muted/40 cursor-pointer transition-colors px-3">
                  <Eye className="size-3.5 text-muted-foreground" />
                  Vista
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] rounded-2xl border border-border/50 bg-popover/95 backdrop-blur-md p-1">
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
                    className="rounded-xl h-10 whitespace-nowrap shadow-lg shadow-destructive/20 cursor-pointer"
                    onClick={() => alert("Función de eliminación masiva pendiente de API")}
                  >
                    <Trash2 className="size-4 mr-2" />
                    Eliminar ({Object.keys(rowSelection).length})
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="overflow-x-auto">
          <Table className="w-full border-collapse">
            <TableHeader className="border-b border-border/10 bg-muted/5">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-5 py-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 align-middle">
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
                    className="group border-b border-border/10 last:border-0 hover:bg-muted/20 cursor-pointer transition-all duration-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3.5 px-5 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-40 text-center">
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
        </div>

        {/* Pagination Section */}
        {table.getPageCount() > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-border/10 bg-card/10">
            {/* Left side: Rows per page */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Filas por página</span>
              <Select 
                value={`${table.getState().pagination.pageSize}`} 
                onValueChange={(val) => table.setPageSize(Number(val))}
              >
                <SelectTrigger className="h-8 w-16 rounded-xl bg-background/50 border border-border/40 text-xs hover:bg-muted/40 cursor-pointer transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-md min-w-16">
                  {[8, 15, 25, 50].map(size => (
                    <SelectItem key={size} value={`${size}`} className="text-xs rounded-lg cursor-pointer">{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Right side: Page range of total and navigation buttons */}
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground font-medium">
                {`${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-${Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )} de ${table.getFilteredRowModel().rows.length}`}
              </span>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="size-8 rounded-full border border-border/40 bg-background/50 hover:bg-muted/40 cursor-pointer disabled:opacity-50 transition-all" 
                  onClick={() => table.setPageIndex(0)} 
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="size-8 rounded-full border border-border/40 bg-background/50 hover:bg-muted/40 cursor-pointer disabled:opacity-50 transition-all" 
                  onClick={() => table.previousPage()} 
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="size-8 rounded-full border border-border/40 bg-background/50 hover:bg-muted/40 cursor-pointer disabled:opacity-50 transition-all" 
                  onClick={() => table.nextPage()} 
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="size-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="size-8 rounded-full border border-border/40 bg-background/50 hover:bg-muted/40 cursor-pointer disabled:opacity-50 transition-all" 
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)} 
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full data-[side=right]:sm:max-w-2xl data-[side=right]:md:max-w-3xl data-[side=right]:lg:max-w-4xl data-[side=right]:xl:max-w-[50vw] border-l border-border bg-background/95 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full">
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
