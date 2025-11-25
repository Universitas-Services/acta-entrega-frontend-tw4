'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
  OnChangeFn,
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
import { Spinner } from '@/components/ui/spinner';
import { AnimatedToggle } from '@/components/animated-toggle';
import { IoSearch } from 'react-icons/io5';
import { FiFilter, FiDownload } from 'react-icons/fi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { downloadCompliance } from '@/services/actasService';
import { toast } from 'sonner';

interface DataWithId {
  id: string;
}

interface DataTableProps<TData extends DataWithId, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  onSearchChange: (value: string) => void;
  onFilterChange: (type: 'status', value: string | undefined) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function DataTable<TData extends DataWithId, TValue>({
  columns,
  data,
  pageCount,
  pagination,
  onPaginationChange,
  onSearchChange,
  onFilterChange,
  onRefresh,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [viewOption, setViewOption] = React.useState<string>('Todas');
  const [searchTerm, setSearchTerm] = React.useState('');

  // Estado visual para el Radio Group de Estatus
  const [selectedStatus, setSelectedStatus] = React.useState<string>('todos');

  const isMounted = React.useRef(false);

  // Debounce búsqueda optimizado a 800ms
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      onSearchChange(searchTerm);
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearchChange]);

  const tableData = React.useMemo(() => {
    if (viewOption === 'Todas') return data;
    return data.filter((row) => rowSelection[row.id]);
  }, [data, viewOption, rowSelection]);

  const table = useReactTable({
    data: tableData,
    columns,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    manualPagination: true,
    manualFiltering: true,
    pageCount: pageCount || -1,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: onPaginationChange,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      pagination,
    },
    meta: {
      onRefresh,
    },
  });

  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    onFilterChange('status', val === 'todos' ? undefined : val);
  };

  // Filas seleccionadas actualmente
  const selectedRows = table.getSelectedRowModel().rows;

  const handleGlobalDownload = async () => {
    if (selectedRows.length !== 1) return;

    const selectedCompliance = selectedRows[0].original;

    const complianceData = selectedCompliance as {
      numeroCompliance?: string | null;
    };
    const numeroCompliance = complianceData.numeroCompliance || 'SN';

    toast.promise(downloadCompliance(selectedCompliance.id, numeroCompliance), {
      loading: 'Generando documento de compliance...',
      success: () => {
        return 'Descarga iniciada';
      },
      error: 'Error al descargar el archivo',
    });
  };

  const totalPages = pageCount;
  const currentPage = pagination.pageIndex + 1;

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    let l;
    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const showPagination = data.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Buscador */}
          <div className="relative w-full md:max-w-sm">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número o entidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-8"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Spinner className="h-4 w-4 text-primary animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AnimatedToggle
              options={['Todas', 'Seleccionada']}
              defaultSelected={viewOption}
              onValueChange={setViewOption}
            />

            {/* Filtros (Solo Estatus) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-b-4 border-gray-300 active:border-b-2"
                >
                  <FiFilter className="mr-2 h-4 w-4" />
                  Filtro
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuLabel>Filtrar por...</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Estatus</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-white">
                    <DropdownMenuRadioGroup
                      value={selectedStatus}
                      onValueChange={handleStatusChange}
                    >
                      <DropdownMenuRadioItem value="todos">
                        Todos
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="GUARDADA">
                        Guardada
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="ENVIADA">
                        Enviada
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="DESCARGADA">
                        Descargada
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="border-b-4 border-gray-300 active:border-b-2"
              disabled={selectedRows.length !== 1 || isLoading}
              onClick={handleGlobalDownload}
            >
              <FiDownload className="mr-2 h-4 w-4" />
              Descargar acta
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="p-0 rounded-md border md:min-h-[532px] md:overflow-auto relative">
          {/* Overlay opcional de carga visual */}
          <div
            className={cn(
              'transition-opacity duration-200',
              isLoading ? 'opacity-60 pointer-events-none' : 'opacity-100'
            )}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-g3/20 border-border hover:bg-g3/20"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={cn({
                          'hidden md:table-cell': [
                            'puntajeCalculado',
                            'estatus',
                          ].includes(header.column.id),
                        })}
                      >
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn({
                            'hidden md:table-cell': [
                              'puntajeCalculado',
                              'estatus',
                            ].includes(cell.column.id),
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
                      {isLoading
                        ? 'Cargando registros...'
                        : 'No se encontraron resultados.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-end">
        {showPagination && (
          <Pagination className="w-auto mx-0 justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (table.getCanPreviousPage()) table.previousPage();
                  }}
                  aria-disabled={!table.getCanPreviousPage()}
                  className={cn(
                    !table.getCanPreviousPage()
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer hover:bg-accent'
                  )}
                />
              </PaginationItem>

              {getPageNumbers().map((page, idx) => {
                if (page === '...') {
                  return (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                const pageNum = Number(page);
                const isCurrent = pageNum === currentPage;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={isCurrent}
                      onClick={(e) => {
                        e.preventDefault();
                        table.setPageIndex(pageNum - 1);
                      }}
                      className={
                        isCurrent ? 'cursor-default' : 'cursor-pointer'
                      }
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (table.getCanNextPage()) table.nextPage();
                  }}
                  aria-disabled={!table.getCanNextPage()}
                  className={cn(
                    !table.getCanNextPage()
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer hover:bg-accent'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardFooter>
    </Card>
  );
}
