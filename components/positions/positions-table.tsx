"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";
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
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { PositionForm } from "./position-form";
import type { Position } from "@/types/organizational-structure";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PositionsAPI } from "@/lib/positions-api";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function TableCellViewer({
  item,
  onUpdate,
  onDelete,
}: {
  readonly item: Position;
  onUpdate: (position: Position) => void;
  onDelete: (id: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const [position, setPosition] = React.useState<Position>(item);
  const [loading, setLoading] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const handleSave = (updatedPosition: Position) => {
    setPosition(updatedPosition);
    onUpdate(updatedPosition);
    setEditMode(false);
  };

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de eliminar este puesto?")) return;

    try {
      await PositionsAPI.deletePosition(position.id);
      toast.success("Puesto eliminado exitosamente");
      onDelete(position.id);
      setOpen(false);
    } catch (error) {
      console.error("Error deleting position:", error);
      toast.error("Error al eliminar puesto");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {position.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-lg w-full">
        <DrawerHeader>
          <DrawerTitle>
            {editMode ? "Editar Puesto" : "Detalles del Puesto"}
          </DrawerTitle>
          <DrawerDescription>
            {editMode
              ? "Modifica la información del puesto."
              : "Consulta la información de este puesto."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          {editMode ? (
            <PositionForm
              position={position}
              onSave={handleSave}
              onCancel={() => setEditMode(false)}
              formRef={formRef as React.RefObject<HTMLFormElement>}
              loading={loading}
              setLoading={setLoading}
            />
          ) : (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Información General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium">ID:</span>
                      <span className="ml-2">{position.id}</span>
                    </div>
                    <div>
                      <span className="font-medium">Nombre:</span>
                      <span className="ml-2">{position.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">Descripción:</span>
                      <span className="ml-2">{position.description}</span>
                    </div>
                    <div>
                      <span className="font-medium">Departamento:</span>
                      <Badge variant="outline" className="ml-2">
                        ID: {position.department.id}
                      </Badge>
                    </div>
                    {position.createdAt && (
                      <div>
                        <span className="font-medium">Fecha de Creación:</span>
                        <span className="ml-2">
                          {new Date(position.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </div>
        <DrawerFooter>
          {editMode ? (
            <Button onClick={handleExternalSubmit} disabled={loading}>
              {loading ? "Guardando..." : "Actualizar Puesto"}
            </Button>
          ) : (
            <>
              <Button variant="default" onClick={() => setEditMode(true)}>
                Editar
              </Button>
              <Button variant="ghost" onClick={handleDelete}>
                Eliminar
              </Button>
            </>
          )}
          <DrawerClose asChild>
            <Button variant="secondary">Cerrar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const columns = (
  onUpdate: (position: Position) => void,
  onDelete: (id: number) => void,
): ColumnDef<Position>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
    cell: ({ row }) => (
      <TableCellViewer
        item={row.original}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => (
      <span className="max-w-xs truncate block">
        {row.original.description}
      </span>
    ),
  },
  {
    accessorKey: "departmentId",
    header: "Departamento ID",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.department.id}</Badge>
    ),
  },
];

export function PositionsTable({
  data: initialData,
  pageCount,
  pagination,
  setPaginationAction,
  sorting,
  setSorting,
  loading,
  searchTerm,
  setSearchTerm,
}: {
  readonly data: Position[];
  pageCount: number;
  pagination: { pageIndex: number; pageSize: number };
  setPaginationAction: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  const [data, setData] = React.useState(() => initialData);
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [createDrawerOpen, setCreateDrawerOpen] = React.useState(false);
  const [createLoading, setCreateLoading] = React.useState(false);
  const createFormRef = React.useRef<HTMLFormElement | null>(null);

  const handleUpdate = (updatedPosition: Position) => {
    setData((prev) =>
      prev.map((p) => (p.id === updatedPosition.id ? updatedPosition : p)),
    );
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCreateSave = (newPosition: Position) => {
    setData((prev) => [newPosition, ...prev]);
    setCreateDrawerOpen(false);
  };

  const handleCreateSubmit = () => {
    if (createFormRef.current) {
      createFormRef.current.requestSubmit();
    }
  };

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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPaginationAction,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
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
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide(),
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button size="sm" onClick={() => setCreateDrawerOpen(true)}>
          <IconPlus />
          <span className="hidden lg:inline">Agregar Puesto</span>
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay puestos registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} seleccionados.
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
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
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
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
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

      <Drawer
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
        direction="right"
      >
        <DrawerContent className="max-w-lg w-full">
          <DrawerHeader>
            <DrawerTitle>Crear Nuevo Puesto</DrawerTitle>
            <DrawerDescription>
              Ingresa la información del nuevo puesto.
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4">
            <PositionForm
              onSave={handleCreateSave}
              onCancel={() => setCreateDrawerOpen(false)}
              formRef={createFormRef as React.RefObject<HTMLFormElement>}
              loading={createLoading}
              setLoading={setCreateLoading}
            />
          </div>
          <DrawerFooter>
            <Button onClick={handleCreateSubmit} disabled={createLoading}>
              {createLoading ? "Guardando..." : "Crear Puesto"}
            </Button>
            <DrawerClose asChild>
              <Button variant="secondary">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
