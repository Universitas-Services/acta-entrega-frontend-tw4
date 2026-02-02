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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AiOutlineInfoCircle } from 'react-icons/ai';

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
  const [isAlertClosing, setIsAlertClosing] = useState(false);

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

        // Detectar si hay actas completadas para mostrar el Alert
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
          toast.success(
            `Ya están disponibles las observaciones para el acta ${numeroActa}`,
            {
              action: {
                label: 'OK',
                onClick: () => {
                  refreshData(); // Refrescar para actualizar tieneObservaciones
                },
              },
              duration: Infinity, // No se cierra automáticamente
            }
          );
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

  // Cerrar automáticamente el Alert después de 15 segundos
  useEffect(() => {
    if (showCompletedAlert) {
      const timer = setTimeout(() => {
        // Activar animación de salida
        setIsAlertClosing(true);

        // Después de la animación, ocultar completamente el Alert
        setTimeout(() => {
          setShowCompletedAlert(false);
          setIsAlertClosing(false);
        }, 500); // 500ms para que termine la animación
      }, 15000); // 15 segundos

      return () => clearTimeout(timer);
    }
  }, [showCompletedAlert]);

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

      {/* Alert para actas completadas */}
      {showCompletedAlert && (
        <div
          className={`fixed top-4 right-4 z-50 w-100 transition-all duration-500 ${
            isAlertClosing
              ? 'animate-out slide-out-to-right fade-out'
              : 'animate-in slide-in-from-top-2 fade-in'
          }`}
        >
          <Alert className="border-blue-200 bg-blue-50">
            <AiOutlineInfoCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-900 font-semibold">
              Hemos detectado nuevas actas
            </AlertTitle>
            <AlertDescription className="text-blue-800 text-sm">
              Revisa las nuevas actas completadas. Ya puedes generar las
              observaciones
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
