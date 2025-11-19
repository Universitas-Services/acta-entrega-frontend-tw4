'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowData,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimatedToggle } from '@/components/animated-toggle';
import { IoSearch } from 'react-icons/io5';
import { FiFilter, FiDownload } from 'react-icons/fi';

// Extendemos la interfaz de la tabla para aceptar onRefresh
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    onRefresh: () => void;
  }
}

// Definimos una interfaz base para asegurar que TData tenga ID
interface DataWithId {
  id: string;
}

interface DataTableProps<TData extends DataWithId, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRefresh: () => void; // Función para recargar la data real
  isLoading?: boolean; // Indicador de carga
}

export function DataTable<TData extends DataWithId, TValue>({
  columns,
  data,
  onRefresh,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Estado para la selección de filas
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  // Estado para el Toggle ('Todas' | 'Seleccionada')
  const [viewOption, setViewOption] = React.useState<string>('Todas');

  // --- LÓGICA DE FILTRADO POR SELECCIÓN ---
  const tableData = React.useMemo(() => {
    // Si estamos viendo "Todas", pasamos la data original
    if (viewOption === 'Todas') return data;

    // Si estamos viendo "Seleccionada", filtramos la data
    // Nota: Usamos (row as any).id asumiendo que TData tiene id.
    // Es necesario para que la persistencia funcione correctamente.
    return data.filter((row) => {
      return rowSelection[row.id]; // Solo devolvemos si el ID está en la selección
    });
  }, [data, viewOption, rowSelection]);

  const table = useReactTable({
    data: tableData, // Usamos la data calculada en vez de la prop directa
    columns,
    getRowId: (row) => row.id, // Usamos el ID real en lugar del índice
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    meta: {
      onRefresh,
    },
  });

  const shadowEffectClass =
    'border-b-4 border-gray-300 active:border-b-2 disabled:border-b-4 disabled:border-gray-200';
  const activePageStyle = 'bg-white border-b-4 border-gray-300 shadow-xs';
  const disabledPageStyle = 'pointer-events-none opacity-50';

  const currentPageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Buscador */}
          <div className="relative w-full md:max-w-sm">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar acta"
              value={
                (table.getColumn('numeroActa')?.getFilterValue() as string) ||
                ''
              }
              onChange={(event) =>
                table
                  .getColumn('numeroActa')
                  ?.setFilterValue(event.target.value)
              }
              className="pl-10"
              disabled={isLoading} // Deshabilitar input mientras carga
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AnimatedToggle
              options={['Todas', 'Seleccionada']}
              defaultSelected={viewOption}
              // Asumimos que AnimatedToggle acepta una prop para capturar el cambio
              // Si tu componente usa otro nombre (ej: onChange), ajusta aquí.
              onValueChange={(val: string) => setViewOption(val)}
            />

            <Button variant="outline" className={cn(shadowEffectClass)}>
              <FiFilter className="mr-2 h-4 w-4" />
              Filtro
            </Button>
            <Button
              variant="outline"
              disabled
              className={cn(shadowEffectClass)}
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Descargar acta
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="p-0 rounded-md border md:min-h-[532px] md:overflow-auto relative">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-g3/20 border-border shadow-sm hover:bg-g3/20"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn({
                          'hidden md:table-cell': ['tipo', 'estatus'].includes(
                            header.column.id
                          ),
                        })}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {/* --- LÓGICA DEL SKELETON --- */}
              {isLoading ? (
                // Renderizamos 5 filas de Skeleton mientras carga
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex} className="p-4">
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn({
                          'hidden md:table-cell': ['tipo', 'estatus'].includes(
                            cell.column.id
                          ),
                        })}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-center py-0 px-4">
        {!isLoading && (
          <div className="md:ml-auto">
            <Pagination>
              <PaginationContent>
                <div className="hidden md:flex items-center space-x-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.previousPage();
                      }}
                      aria-disabled={!table.getCanPreviousPage()}
                      className={cn(
                        !table.getCanPreviousPage() && disabledPageStyle
                      )}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(0);
                      }}
                      isActive={currentPageIndex === 0}
                      className={cn(currentPageIndex === 0 && activePageStyle)}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(1);
                      }}
                      isActive={currentPageIndex === 1}
                      aria-disabled={pageCount <= 1}
                      className={cn(
                        currentPageIndex === 1 && activePageStyle,
                        pageCount <= 1 && disabledPageStyle
                      )}
                    >
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(2);
                      }}
                      isActive={currentPageIndex === 2}
                      aria-disabled={pageCount <= 2}
                      className={cn(
                        currentPageIndex === 2 && activePageStyle,
                        pageCount <= 2 && disabledPageStyle
                      )}
                    >
                      3
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(3);
                      }}
                      isActive={currentPageIndex === 3}
                      aria-disabled={pageCount <= 3}
                      className={cn(
                        currentPageIndex === 3 && activePageStyle,
                        pageCount <= 3 && disabledPageStyle
                      )}
                    >
                      4
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(9);
                      }}
                      isActive={currentPageIndex === 9}
                      aria-disabled={pageCount <= 9}
                      className={cn(
                        currentPageIndex === 9 && activePageStyle,
                        pageCount <= 9 && disabledPageStyle
                      )}
                    >
                      10
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.nextPage();
                      }}
                      aria-disabled={!table.getCanNextPage()}
                      className={cn(
                        !table.getCanNextPage() && disabledPageStyle
                      )}
                    />
                  </PaginationItem>
                </div>

                {/* ======================= VERSIÓN MÓVIL ======================= */}
                <div className="flex md:hidden items-center space-x-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.previousPage();
                      }}
                      aria-disabled={!table.getCanPreviousPage()}
                      className={cn(
                        !table.getCanPreviousPage() && disabledPageStyle
                      )}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive
                      className={cn(activePageStyle)}
                    >
                      {currentPageIndex + 1}
                    </PaginationLink>
                  </PaginationItem>

                  {/* Se muestra el resto de la paginación solo si hay más de 1 página */}
                  {pageCount > 1 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            table.setPageIndex(pageCount - 1);
                          }}
                          // Se usa pageCount para mostrar el número de la última página real
                          // La desactivación ahora se basa en si hay suficientes páginas para que "10" sea una opción
                          aria-disabled={10 > pageCount}
                          className={cn(10 > pageCount && disabledPageStyle)}
                        >
                          {/* Se muestra el número 10 del diseño, no el pageCount */}
                          10
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        table.nextPage();
                      }}
                      aria-disabled={!table.getCanNextPage()}
                      className={cn(
                        !table.getCanNextPage() && disabledPageStyle
                      )}
                    />
                  </PaginationItem>
                </div>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
