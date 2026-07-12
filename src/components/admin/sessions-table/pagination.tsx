"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table as ReactTable } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Session } from "../types"

interface SessionsTablePaginationProps {
  table: ReactTable<Session>
}

export function SessionsTablePagination({ table }: SessionsTablePaginationProps) {
  if (table.getPageCount() === 0) return null

  return (
    <div className="px-5 py-3">
      <div className="flex w-full items-center justify-between">
        {/* Left side: Rows per page */}
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-muted-foreground sm:inline">Filas por página</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(val) => table.setPageSize(Number(val))}
          >
            <SelectTrigger className="w-16 border border-border/50 bg-background/50 text-xs hover:bg-muted/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="min-w-16 rounded-xl border-border/50 bg-popover/95 backdrop-blur-md">
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={`${size}`} className="cursor-pointer rounded-lg text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right side: Page range of total and navigation buttons */}
        <div className="flex items-center gap-6">
          <span className="text-xs font-medium text-muted-foreground">
            {`${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-${Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )} de ${table.getFilteredRowModel().rows.length}`}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer rounded-full border border-border/50 bg-background/50 transition-all hover:bg-muted/40 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer rounded-full border border-border/50 bg-background/50 transition-all hover:bg-muted/40 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer rounded-full border border-border/50 bg-background/50 transition-all hover:bg-muted/40 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer rounded-full border border-border/50 bg-background/50 transition-all hover:bg-muted/40 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
