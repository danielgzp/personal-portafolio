# TanStack Table Sessions Implementation Plan

    > **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps

use checkbox (`- [ ]`) syntax for tracking.

    **Goal:** Refactor the admin `SessionsTable` component to use `@tanstack/react-table` for client-side filtering, sorting, pagination, and bulk selection.

    **Architecture:** We will replace the manual filtering and sorting states in `SessionsTable` with a `useReactTable` instance. The design will be updated to match the radix-luma

aesthetic using existing Shadcn UI primitives, Framer Motion for interactivity, and OKLCH color tokens.

    **Tech Stack:** Next.js 16 (React 19), Tailwind CSS v4, `@tanstack/react-table`, Framer Motion, Radix UI.

    ## Global Constraints

    - Dimensions must always use `size-{n}` (NEVER `h-n w-n`).
    - Colors must use semantic tokens like `bg-background` and `text-primary` (zero hardcoded colors or `dark:` overrides).
    - Mobile-first responsive classes must be used.
    - Glassmorphism effects must use `bg-card/60 backdrop-blur-md border border-border/50`.
    - Package manager is `pnpm`.

    ---

    ### Task 1: Setup Dependencies

    **Files:**
    - Modify: `package.json`

    **Interfaces:**
    - Consumes: None
    - Produces: `@tanstack/react-table` available in `node_modules`

    - [ ] **Step 1: Install TanStack Table**

    ```bash
    pnpm add @tanstack/react-table

[ ] Step 2: Verify installation

    grep "@tanstack/react-table" package.json

Expected: PASS (shows dependency entry)
[ ] Step 3: Commit

    git add package.json pnpm-lock.yaml
    git commit -m "chore: add @tanstack/react-table dependency"
    ──────

### Task 2: Implement Table Logic and Columns

Files:
• Modify: src/components/admin/sessions-table.tsx
Interfaces:
• Consumes: Session[] from props
• Produces: Configured useReactTable instance with column definitions.
[ ] Step 1: Add TanStack Imports
Update imports in src/components/admin/sessions-table.tsx :

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

[ ] Step 2: Define Table State
Inside SessionsTable component, replace existing filter states with:
const [sorting, setSorting] = useState<SortingState>([{ id: "created_at", desc: true }])
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
const [rowSelection, setRowSelection] = useState({})
const [globalFilter, setGlobalFilter] = useState("")

[ ] Step 3: Define Columns
Add the columns array configuration:
const columns = useMemo<ColumnDef<Session>[]>(() => [
{
id: "select",
header: ({ table }) => (
<input
              type="checkbox"
              className="size-4 rounded border-border bg-background/50 cursor-pointer"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              aria-label="Select all"
            />
),
cell: ({ row }) => (
<input
type="checkbox"
className="size-4 rounded border-border bg-background/50 cursor-pointer"
checked={row.getIsSelected()}
onChange={row.getToggleSelectedHandler()}
aria-label="Select row"
onClick={(e) => e.stopPropagation()}
/>
),
enableSorting: false,
},
{
accessorKey: "id",
header: "ID Sesión",
cell: ({ row }) => (

<div className="font-mono text-xs font-semibold">
<span className="md:hidden">{String(row.getValue("id")).slice(0, 8)}</span>
<span className="hidden md:inline">{row.getValue("id")}</span>
</div>
),
},
{
accessorKey: "created_at",
header: "Fecha Creación",
cell: ({ row }) => <div className="text-sm">{formatDate(row.getValue("created_at"))}</div>,
},
{
id: "status",
header: "Estado",
accessorFn: (row) => {
const hasError = row.chat_messages?.some(m => m.error_message)
const isRecent = (new Date().getTime() - new Date(row.last_activity).getTime()) < 24 _ 60 _ 60 \* 1000
return hasError ? "Error" : (isRecent ? "Activa" : "Inactiva")
},
cell: ({ row }) => {
const status = row.getValue("status") as string
if (status === "Error") return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Error</Badge>
if (status === "Activa") return <Badge variant="secondary" className="bg-foreground text-background font-bold">Activa</Badge>
return <Badge variant="outline" className="bg-muted text-muted-foreground border-border/50">Inactiva</Badge>
}
},
{
accessorKey: "message_count",
header: "Mensajes",
cell: ({ row }) => <Badge variant="secondary" className="px-2.5 rounded-full">{row.getValue("message_count")}</Badge>,
},
{
accessorKey: "last_user_query",
header: "Último Mensaje",
cell: ({ row }) => (
<div className="max-w-[200px] truncate text-xs text-muted-foreground">
{row.getValue("last_user_query") || <span className="italic opacity-50">Sin mensajes</span>}
</div>
)
},
{
accessorKey: "models",
header: "Modelos",
cell: ({ row }) => {
const models = row.getValue("models") as string[]
return (
<div className="flex flex-wrap gap-1">
{models.map((m, i) => <Badge key={i} variant="outline" className="text-[10px]">{formatModelBadge(m)}</Badge>)}
</div>
)
}
},
{
id: "actions",
cell: ({ row }) => (
<div className="text-right" onClick={(e) => e.stopPropagation()}>
<Button variant="ghost" size="icon" className="size-8" onClick={() => handleViewSession(row.original)}>
<Eye className="size-4" />
</Button>
<Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => handleDeleteClick(row.original.id)}>
<Trash2 className="size-4" />
</Button>
</div>
)
}
], [])

[ ] Step 4: Create Table Instance

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
        state: { sorting, columnFilters, rowSelection, globalFilter },
        initialState: { pagination: { pageSize: 8 } },
      })

[ ] Step 5: Typecheck
pnpm typecheck

Expected: PASS
[ ] Step 6: Commit
git add src/components/admin/sessions-table.tsx
git commit -m "feat(admin): define tanstack table columns and hooks for sessions table"
──────

### Task 3: Render Table UI with Glassmorphism

Files:
• Modify: src/components/admin/sessions-table.tsx
Interfaces:
• Consumes: table instance from Task 2
• Produces: Fully styled interactive DOM structure
[ ] Step 1: Replace Search and Filter Header

Render the search and filters inside the glassmorphic card:

    <Card className="border border-border/50 bg-card/60 shadow-xl backdrop-blur-md rounded-3xl overflow-hidden mb-6">
      <CardContent className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID o contenido..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-11 pr-9 bg-background/50 rounded-full h-10 border-border/40"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Add model and status Selects here mapped to table.getColumn().setFilterValue */}
          {Object.keys(rowSelection).length > 0 && (
            <Button variant="destructive" className="rounded-full h-10">
              <Trash2 className="size-4 mr-2" /> Eliminar ({Object.keys(rowSelection).length})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>

[ ] Step 2: Render Table Body

Map over table.getRowModel().rows to render the table elements:

    <div className="rounded-3xl border border-border/50 bg-card/40 p-2 shadow-sm backdrop-blur-xs overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
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
              <TableCell colSpan={columns.length} className="h-40 text-center text-muted-foreground">
                No se encontraron sesiones.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>

[ ] Step 3: Render Pagination

    {table.getPageCount() > 0 && (
      <div className="flex items-center justify-between px-4 py-4 mt-2">
        <div className="text-xs text-muted-foreground font-medium">
          Pág. {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon" className="size-8 rounded-full border-border/40" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="size-8 rounded-full border-border/40" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    )}

[ ] Step 4: Lint & Test

    pnpm lint
    pnpm build

Expected: PASS

[ ] Step 5: Final Commit

    git add src/components/admin/sessions-table.tsx
    git commit -m "feat(admin): render tanstack table UI with radix-luma glassmorphism"
