"use client"

import { Table as ReactTable } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Session } from "../types"
import { TableFooter, TableRow, TableCell } from "@/components/ui/table"

interface SessionsTablePaginationProps {
  table: ReactTable<Session>
}

export function SessionsTablePagination({ table }: SessionsTablePaginationProps) {
  if (table.getPageCount() === 0) return null

  return (
    <TableFooter className="bg-muted/30 border-t border-border/50">
      <TableRow className="hover:bg-transparent border-0">
        <TableCell colSpan={table.getAllColumns().length} className="px-5 py-3">
          <div className="flex items-center justify-between w-full">
            {/* Left side: Rows per page */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Filas por página</span>
              <Select 
                value={`${table.getState().pagination.pageSize}`} 
                onValueChange={(val) => table.setPageSize(Number(val))}
              >
                <SelectTrigger className="h-8 w-16 rounded-xl bg-background/50 border border-border/50 text-xs hover:bg-muted/40 cursor-pointer transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50 bg-popover/95 backdrop-blur-md min-w-16">
                  {[10, 20, 50].map(size => (
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
                  className="size-8 rounded-full border border-border/50 bg-background/50 hover:bg-muted/40 cursor-pointer disabled:opacity-50 transition-all" 
                  onClick={() => table.setPageIndex(0)} 
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronsLeft className="size-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="size-8 rounded-full border border-border/50 bg-background/50 hover:bg-muted/40 cursor-pointer disabled:opacity-50 transition-all" 
                  onClick={() => table.previousPage()} 
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="size-8 rounded-full border border-border/50 bg-background/50 hover:bg-muted/40 cursor-pointer disabled:opacity-50 transition-all" 
                  onClick={() => table.nextPage()} 
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="size-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="size-8 rounded-full border border-border/50 bg-background/50 hover:bg-muted/40 cursor-pointer disabled:opacity-50 transition-all" 
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)} 
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronsRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  )
}
