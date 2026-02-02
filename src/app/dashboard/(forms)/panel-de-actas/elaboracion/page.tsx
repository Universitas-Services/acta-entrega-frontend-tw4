'use client';

import { useEffect, useState, useCallback } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { columns } from '@/components/panel-actas/elaboracion/columns';
import { DataTable } from '@/components/panel-actas/elaboracion/data-table';
import {
  getMyActas,
  Acta,
  getObservacionesElaboracion,
} from '@/services/actasService';
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

  // Estados para el sistema de observaciones
  const [generatingActas, setGeneratingActas] = useState<Set<string>>(
    new Set()
  );

  // Mapeo de tipos simplificados a sus variantes PAGA y GRATIS
  const TYPE_MAPPING: Record<string, string[]> = {
    MAXIMA_AUTORIDAD: ['MAXIMA_AUTORIDAD_PAGA', 'MAXIMA_AUTORIDAD_GRATIS'],
    ENTRANTE: ['ENTRANTE_PAGA', 'ENTRANTE_GRATIS'],
    SALIENTE: ['SALIENTE_PAGA', 'SALIENTE_GRATIS'],
  };

  // Efecto para cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // NO enviamos el typeFilter
        const response = await getMyActas({
          page: pagination.pageIndex + 1, // Convertir a 1-index
          limit: pagination.pageSize,
          search: search,
          status: statusFilter,
        });

        // Filtrado de tipo
        let filteredData = response.data;

        if (typeFilter && typeFilter !== 'todos') {
          const allowedTypes = TYPE_MAPPING[typeFilter];
          if (allowedTypes) {
            filteredData = response.data.filter((acta) =>
              allowedTypes.includes(acta.type)
            );
          }
        }

        setData(filteredData);

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

  // Función para iniciar generación de observaciones
  const startObservacionesGeneration = useCallback((actaId: string) => {
    setGeneratingActas((prev) => {
      const newSet = new Set(prev);
      newSet.add(actaId);
      return newSet;
    });
  }, []);

  // Polling global de observaciones en segundo plano
  useEffect(() => {
    if (generatingActas.size === 0) return;

    const interval = setInterval(async () => {
      for (const actaId of generatingActas) {
        try {
          await getObservacionesElaboracion(actaId);

          // Observaciones listas - remover del conjunto
          setGeneratingActas((prev) => {
            const newSet = new Set(prev);
            newSet.delete(actaId);
            return newSet;
          });

          // Encontrar el acta para obtener su número
          const acta = data.find((a) => a.id === actaId);
          const numeroActa = acta?.numeroActa || 'S/N';

          // Refrescar automáticamente el panel para actualizar badge y observaciones
          refreshData();

          // Mostrar Toast personalizado con código de acta
          toast.success(`Observaciones listas para el Acta ${numeroActa}`, {
            action: {
              label: 'OK',
              onClick: () => {
                refreshData(); // Refrescar para actualizar tieneObservaciones
              },
            },
            duration: Infinity, // No se cierra automáticamente
          });
        } catch (error) {
          // Continuar polling si aún no están listas
        }
      }
    }, 60000); // Cada 1 minuto

    return () => clearInterval(interval);
  }, [generatingActas, data]);

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
        // NO enviamos el typeFilter
        const response = await getMyActas({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search,
          status: statusFilter,
        });

        // Filtrado de tipo
        let filteredData = response.data;

        if (typeFilter && typeFilter !== 'todos') {
          const allowedTypes = TYPE_MAPPING[typeFilter];
          if (allowedTypes) {
            filteredData = response.data.filter((acta) =>
              allowedTypes.includes(acta.type)
            );
          }
        }

        setData(filteredData);

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
          Cargando panel de elaboración...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <DataTable
        columns={columns}
        data={data}
        // Calculamos el total de páginas basado en el totalRecords
        pageCount={Math.ceil(totalRecords / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onRefresh={refreshData}
        isLoading={loading}
        generatingActas={generatingActas}
        startObservacionesGeneration={startObservacionesGeneration}
      />
    </div>
  );
}
