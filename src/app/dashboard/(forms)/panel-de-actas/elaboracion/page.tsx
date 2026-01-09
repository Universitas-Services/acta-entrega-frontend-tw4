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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const [showCompletedAlert, setShowCompletedAlert] = useState(false);

  // Estados para el sistema de observaciones
  const [generatingActas, setGeneratingActas] = useState<Set<string>>(
    new Set()
  );
  const [showObservacionesReadyAlert, setShowObservacionesReadyAlert] =
    useState(false);
  const [observacionesReadyCount, setObservacionesReadyCount] = useState(0);

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

        // NO enviamos el typeFilter al backend, lo manejamos en el frontend
        const response = await getMyActas({
          page: pagination.pageIndex + 1, // Convertir a 1-index para backend
          limit: pagination.pageSize,
          search: search,
          // type: typeFilter, // REMOVIDO - filtraremos en el frontend
          status: statusFilter,
        });

        // Filtrado de tipo en el FRONTEND
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

        // Detectar si hay actas completadas para mostrar el Alert Dialog
        const hasCompletedActas = filteredData.some((acta) => acta.isCompleted);
        setShowCompletedAlert(hasCompletedActas);

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
      let completedCount = 0;

      for (const actaId of generatingActas) {
        try {
          await getObservacionesElaboracion(actaId);
          // Éxito: observaciones listas
          setGeneratingActas((prev) => {
            const newSet = new Set(prev);
            newSet.delete(actaId);
            return newSet;
          });
          completedCount++;
        } catch (error) {
          // Error: continuar polling
          // Si es error NO_OBSERVACIONES, seguir esperando
        }
      }

      if (completedCount > 0) {
        setObservacionesReadyCount(completedCount);
        setShowObservacionesReadyAlert(true);
      }
    }, 10000); // Cada 10 segundos

    return () => clearInterval(interval);
  }, [generatingActas]);

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
        // NO enviamos el typeFilter al backend
        const response = await getMyActas({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          search,
          // type: typeFilter, // REMOVIDO - filtraremos en el frontend
          status: statusFilter,
        });

        // Filtrado de tipo en el FRONTEND
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
        // Calculamos el total de páginas basado en el totalRecords corregido
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

      {/* Alert Dialog para actas completadas */}
      <AlertDialog
        open={showCompletedAlert}
        onOpenChange={setShowCompletedAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Actas Finalizadas Detectadas</AlertDialogTitle>
            <AlertDialogDescription>
              Debes revisar las actas que estén Finalizadas, ya que puedes
              obtener observaciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowCompletedAlert(false)}>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert Dialog para observaciones listas */}
      <AlertDialog
        open={showObservacionesReadyAlert}
        onOpenChange={setShowObservacionesReadyAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>✅ Observaciones Generadas</AlertDialogTitle>
            <AlertDialogDescription>
              {observacionesReadyCount === 1
                ? 'Las observaciones solicitadas están listas.'
                : `Se generaron observaciones para ${observacionesReadyCount} actas.`}{' '}
              Puedes revisarlas haciendo clic en el botón del ojo con badge
              verde en la columna &quot;Observaciones&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowObservacionesReadyAlert(false);
                setObservacionesReadyCount(0);
                refreshData(); // Refrescar tabla para actualizar badges
              }}
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
