'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { columns } from '@/components/panel-actas/elaboracion/columns';
import { DataTable } from '@/components/panel-actas/elaboracion/data-table';
import { getMyActas, Acta } from '@/services/actasService';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export default function ActasPage() {
  const { setTitle } = useHeader();
  const [data, setData] = useState<Acta[]>([]);
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);

  // Función para cargar datos
  const fetchActas = useCallback(async () => {
    try {
      const actas = await getMyActas();
      setData(actas);
    } catch (error) {
      toast.error('Error al cargar tus actas.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar y setear título
  useEffect(() => {
    setTitle('Panel de actas (Elaboración)');
    // Verificación para evitar doble ejecución en desarrollo
    if (!hasFetched.current) {
      fetchActas();
      hasFetched.current = true;
    }
  }, [setTitle, fetchActas]);

  if (loading) {
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
        onRefresh={fetchActas} // Pasamos la función para recargar
        isLoading={loading}
      />
    </div>
  );
}
