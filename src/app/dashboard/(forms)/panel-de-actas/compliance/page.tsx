'use client';

import { useEffect, useState, useCallback } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { columns } from '@/components/panel-actas/compliance/columns';
import { DataTable } from '@/components/panel-actas/compliance/data-table';
import {
  getMyComplianceChecklists,
  ComplianceActa,
} from '@/services/actasService';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { PaginationState } from '@tanstack/react-table';

export default function ComplianceActasPage() {
  const { setTitle } = useHeader();
  const [data, setData] = useState<ComplianceActa[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);

  // Estado de paginación (TanStack usa 0-index)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Estados de filtros
  const [search, setSearch] = useState('');
  // En Compliance solo filtramos por estatus, no por tipo
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  // Bandera para controlar la carga inicial y evitar desmontajes
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Efecto principal para cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Llamada al endpoint específico de Compliance
        const response = await getMyComplianceChecklists({
          page: pagination.pageIndex + 1, // Convertir a 1-index para backend
          limit: pagination.pageSize,
          search: search,
          status: statusFilter,
        });

        setData(response.data);

        // Manejo robusto del total de registros usando 'meta'
        const metaTotal = response.meta?.total;
        setTotalRecords(metaTotal || response.total || 0);
      } catch (error) {
        toast.error('Error al cargar los checklists de compliance.');
        console.error(error);
      } finally {
        setLoading(false);
        // Apagamos la bandera de primera carga
        setIsFirstLoad(false);
      }
    };

    loadData();
  }, [pagination.pageIndex, pagination.pageSize, search, statusFilter]);

  // Configurar título del header
  useEffect(() => {
    setTitle('Panel de actas (Compliance)');
  }, [setTitle]);

  // Manejador optimizado para cambio de filtros
  const handleFilterChange = useCallback(
    (type: 'status', value: string | undefined) => {
      if (type === 'status') setStatusFilter(value);
      // Al filtrar, siempre volvemos a la página 1
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  // Manejador optimizado para búsqueda
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  // Función para refrescar manualmente (pasada a la tabla para acciones como eliminar/descargar)
  const refreshData = () => {
    const triggerFetch = async () => {
      setLoading(true);
      try {
        const response = await getMyComplianceChecklists({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search,
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

  // Renderizado de carga inicial (Pantalla completa solo la primera vez)
  if (loading && isFirstLoad) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 min-h-[calc(100vh-10rem)]">
        <Spinner className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm animate-pulse">
          Cargando panel de compliance...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <DataTable
        columns={columns}
        data={data}
        // Cálculo de páginas totales
        pageCount={Math.ceil(totalRecords / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onRefresh={refreshData}
        isLoading={loading} // Pasamos estado de carga para feedback visual en la tabla
      />
    </div>
  );
}
