'use client';

import { useEffect, useState, useCallback } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { columns } from '@/components/panel-actas/elaboracion/columns';
import { DataTable } from '@/components/panel-actas/elaboracion/data-table';
import { getMyActas, Acta } from '@/services/actasService';
import { toast } from 'sonner';

export default function ActasPage() {
  const { setTitle } = useHeader();
  const [data, setData] = useState<Acta[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchActas();
  }, [setTitle, fetchActas]);

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
