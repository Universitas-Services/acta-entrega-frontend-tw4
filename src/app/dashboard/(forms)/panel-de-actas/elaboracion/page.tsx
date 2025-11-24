'use client';

import { useEffect, useState, useCallback } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { columns } from '@/components/panel-actas/elaboracion/columns';
import { DataTable } from '@/components/panel-actas/elaboracion/data-table';
import { getMyActas, Acta } from '@/services/actasService';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { PaginationState } from '@tanstack/react-table';

export default function ActasPage() {
  const { setTitle } = useHeader();
  const [data, setData] = useState<Acta[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  // Estado de paginación (TanStack usa 0-index)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Estados de filtros
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Efecto para cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getMyActas({
          page: pagination.pageIndex + 1, // Convertir a 1-index para backend
          limit: pagination.pageSize,
          search: search,
          type: typeFilter,
          status: statusFilter,
        });

        setData(response.data);

        const metaTotal = response.meta?.total;

        // Si existe meta.total lo usamos, si no, intentamos response.total, o finalmente 0
        setTotalRecords(metaTotal || response.total || 0);
      } catch (error) {
        toast.error('Error al cargar tus actas.');
        console.error(error);
      } finally {
        setLoading(false);
        // Desactivamos la bandera de primera carga para que las futuras
        // actualizaciones no desmonten la tabla.
        setIsFirstLoad(false);
      }
    };

    loadData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    search,
    typeFilter,
    statusFilter,
  ]);

  useEffect(() => {
    setTitle('Panel de actas (Elaboración)');
  }, [setTitle]);

  // Usamos useCallback para que esta función no cambie de referencia en cada render.
  // Esto evita que el useEffect del DataTable se dispare innecesariamente y resetee la página.
  const handleFilterChange = useCallback(
    (type: 'type' | 'status', value: string | undefined) => {
      if (type === 'type') setTypeFilter(value);
      if (type === 'status') setStatusFilter(value);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Función para refrescar manualmente
  const refreshData = () => {
    const triggerFetch = async () => {
      setLoading(true);
      try {
        const response = await getMyActas({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search,
          type: typeFilter,
          status: statusFilter,
        });
        setData(response.data);

        const metaTotal = response.meta?.total;
        setTotalRecords(metaTotal || response.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setIsFirstLoad(false);
      }
    };
    triggerFetch();
  };

  if (loading && isFirstLoad) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 min-h-[calc(100vh-10rem)]">
        <Spinner className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm animate-pulse">
          Cargando panel de actas...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <DataTable
        columns={columns}
        data={data}
        // Calculamos el total de páginas basado en el totalRecords corregido
        pageCount={Math.ceil(totalRecords / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onRefresh={refreshData}
        isLoading={loading}
      />
    </div>
  );
}
