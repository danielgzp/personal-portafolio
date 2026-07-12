"use client"

import { useState, useMemo, useCallback } from "react"
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { DeleteSessionDialog } from "../delete-session-dialog"
import { ChevronDownIcon, ChevronUpIcon, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { SessionDetailSheet } from "../session-detail"

import { Session } from "../types"
import { getColumns } from "./columns"
import { SessionsTableToolbar } from "./toolbar"
import { SessionsTablePagination } from "./pagination"
import { useSessions } from "./use-sessions"
import { cn } from "@/lib/utils"

interface SessionsTableProps {
  sessions: Session[]
}

export function SessionsTable({ sessions: initialSessions }: SessionsTableProps) {
  const router = useRouter()
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

  const handleViewSession = useCallback(
    (session: Session) => {
      router.push(`/d4sh-ctrl/sessions/${session.id}`)
    },
    [router]
  )

  const handleRowClick = useCallback((session: Session) => {
    setActiveSession(session)
    setIsSheetOpen(true)
  }, [])

  const handleDeleteClick = useCallback((id: string) => {
    setSessionToDelete(id)
    setIsDeleteDialogOpen(true)
  }, [])

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

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  const allUniqueModels = useMemo(() => {
    const modelsSet = new Set<string>()
    // Extract models safely, avoiding crashes if data is missing or loading
    if (sessions) {
      sessions.forEach((s) => s.models?.forEach((m) => modelsSet.add(m)))
    }
    return Array.from(modelsSet)
  }, [sessions])

  const columns = useMemo(
    () =>
      getColumns({
        onViewSession: handleViewSession,
        onDeleteClick: handleDeleteClick,
        onCopyId: copyToClipboard,
      }),
    [handleViewSession, handleDeleteClick, copyToClipboard]
  )

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
      pagination: { pageSize: 10 },
    },
  })

  return (
    <>
      <Card className="gap-0 divide-y bg-background py-0">
        <SessionsTableToolbar
          table={table}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          allUniqueModels={allUniqueModels}
        />
        <div className="min-h-[300px] w-full border-collapse overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-border/50 bg-muted/25">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="h-11 px-5 text-[11px] font-bold text-muted-foreground uppercase"
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <ChevronUpIcon aria-hidden="true" className="shrink-0" size={16} />,
                            desc: <ChevronDownIcon aria-hidden="true" className="shrink-0" size={16} />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-background">
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <div className="mb-2 size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="font-medium">Cargando sesiones...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleRowClick(row.original)}
                    className="group cursor-pointer border-b border-border/30 transition-all duration-200 last:border-0 hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-5 py-2.5 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-40 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <Search className="mb-2 size-8 opacity-20" />
                      <span className="font-medium">No se encontraron sesiones.</span>
                      <span className="text-xs opacity-70">
                        Ajusta los filtros o la búsqueda para encontrar resultados.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <SessionsTablePagination table={table} />
      </Card>

      <SessionDetailSheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} session={activeSession} />

      <DeleteSessionDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        sessionId={sessionToDelete}
      />
    </>
  )
}
