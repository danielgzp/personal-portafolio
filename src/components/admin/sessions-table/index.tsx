"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { DeleteSessionDialog } from "../delete-session-dialog"
import { SessionDetail } from "../session-detail"
import { Calendar, Search } from "lucide-react"

import { Session } from "../types"
import { getColumns } from "./columns"
import { SessionsTableToolbar } from "./toolbar"
import { SessionsTablePagination } from "./pagination"
import { useSessions } from "./use-sessions"

interface SessionsTableProps {
  sessions: Session[]
}

export function SessionsTable({ sessions: initialSessions }: SessionsTableProps) {
  const { sessions, isLoading, deleteSession, isDeleting } = useSessions(initialSessions)
  
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
    try {
      await deleteSession(sessionToDelete)
      if (activeSession?.id === sessionToDelete) setIsSheetOpen(false)
      setRowSelection({})
    } catch (error: any) {
      console.error("Error deleting session:", error)
      alert(`Error al eliminar la sesión de chat: ${error.message}`)
    } finally {
      setIsDeleteDialogOpen(false)
      setSessionToDelete(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const allUniqueModels = useMemo(() => {
    const modelsSet = new Set<string>()
    // Extract models safely, avoiding crashes if data is missing or loading
    if (sessions) {
      sessions.forEach((s) => s.models?.forEach((m) => modelsSet.add(m)))
    }
    return Array.from(modelsSet)
  }, [sessions])

  const columns = useMemo(() => getColumns({
    onViewSession: handleViewSession,
    onDeleteClick: handleDeleteClick,
    onCopyId: copyToClipboard
  }), [])

  const table = useReactTable({
    data: sessions || [],
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
      <Card className="border-border/50 bg-card/50 backdrop-blur-xs rounded-3xl overflow-hidden shadow-xl gap-0 py-0">
        <SessionsTableToolbar 
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          allUniqueModels={allUniqueModels}
        />

        <div className="overflow-x-auto min-h-[300px]">
          <Table className="w-full border-collapse">
            <TableHeader className="border-b border-border/50 bg-muted/20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-5 py-2 text-[10px] uppercase font-bold tracking-wider text-muted-foreground align-middle">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                      <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full mb-2" />
                      <span className="font-medium">Cargando sesiones...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow 
                    key={row.id} 
                    data-state={row.getIsSelected() && "selected"} 
                    onClick={() => handleViewSession(row.original)}
                    className="group border-b border-border/30 last:border-0 hover:bg-muted/30 cursor-pointer transition-all duration-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2.5 px-5 align-middle">
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

        <SessionsTablePagination table={table} />
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
