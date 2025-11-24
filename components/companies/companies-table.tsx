"use client"

import * as React from "react"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { CompaniesAPI } from "@/lib/companies-api"
import { toast } from "sonner"
import type { Company } from "@/types/organizational-structure"

function TableCellViewer({
  item,
}: {
  readonly item: Company
}) {
  return (
    <Link
      href={`/dashboard/companies/${item.id}/organizational-chart`}
      className="font-medium text-primary hover:underline"
    >
      {item.name}
    </Link>
  )
}

const columns = (onUpdate: (company: Company) => void, onDelete: (id: number) => void): ColumnDef<Company>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
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
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    cell: ({ row }) => <span>{row.original.phone}</span>,
  },
  {
    accessorKey: "industry",
    header: "Industria",
    cell: ({ row }) => <span>{row.original.industry}</span>,
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => <span className="max-w-xs truncate block">{row.original.address}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const company = row.original
      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/companies/${company.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <span className="sr-only">Editar</span>
              <IconLayoutColumns className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={async () => {
              if (!confirm("¿Estás seguro de eliminar esta empresa?")) return
              try {
                await CompaniesAPI.deleteCompany(company.id)
                toast.success("Empresa eliminada exitosamente")
                onDelete(company.id)
              } catch (error) {
                toast.error("Error al eliminar empresa")
              }
            }}
          >
            <span className="sr-only">Eliminar</span>
            <IconPlus className="h-4 w-4 rotate-45" />
          </Button>
        </div>
      )
    },
  },
]

export function CompaniesTable({
  data: initialData,
  pageCount,
  pagination,
  setPaginationAction,
  sorting,
  setSortingAction,
  loading,
  searchTerm,
  setSearchTermAction,
}: {
  readonly data: Company[]
  pageCount: number
  pagination: { pageIndex: number; pageSize: number }
  setPaginationAction: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>
  sorting: SortingState
  setSortingAction: React.Dispatch<React.SetStateAction<SortingState>>
  loading: boolean
  searchTerm: string
  setSearchTermAction: (term: string) => void
}) {
  const [data, setData] = React.useState(() => initialData)
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const handleUpdate = (updatedCompany: Company) => {
    setData((prev) => prev.map((c) => (c.id === updatedCompany.id ? updatedCompany : c)))
  }

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((c) => c.id !== id))
  }

  const table = useReactTable({
    data,
    columns: columns(handleUpdate, handleDelete),
    pageCount,
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSortingAction,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPaginationAction,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Input
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTermAction(e.target.value)}
          className="max-w-sm size-min h-8"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Personalizar columnas</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/dashboard/companies/create">
          <Button size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Crear empresa</span>
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay empresas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} seleccionados.
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Filas por página
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Primera página</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8 bg-transparent"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Anterior</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8 bg-transparent"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Siguiente</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex bg-transparent"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Última página</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
