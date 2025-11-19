// src/app/dashboard/(forms)/panel-de-actas/elaboracion/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { columns } from '@/components/panel-actas/elaboracion/columns';
import { DataTable } from '@/components/panel-actas/elaboracion/data-table';
import { getMyActas, Acta } from '@/services/actasService';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
// import { Skeleton } from '@/components/ui/skeleton'; // Opcional si quieres loading skeleton

export default function ActasPage() {
  const { setTitle } = useHeader();
  const [data, setData] = useState<Acta[]>([]);
  const [loading, setLoading] = useState(true);

  // Función para cargar datos
  const fetchActas = useCallback(async () => {
    try {
      // setLoading(true); // Opcional: si quieres mostrar loading en cada refresh
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
    fetchActas();
  }, [setTitle, fetchActas]);

  if (loading) {
    //return <div className="p-8">Cargando actas...</div>; // O usa un Skeleton
    <Skeleton className="h-6 w-1/3 mb-4" />;
    return (
      <div className="flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-10 w-full mb-4" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <DataTable
        columns={columns}
        data={data}
        onRefresh={fetchActas} // Pasamos la función para recargar
      />
    </div>
  );
}
