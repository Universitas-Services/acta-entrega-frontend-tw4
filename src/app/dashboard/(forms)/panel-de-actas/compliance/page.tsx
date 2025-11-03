'use client'; // <-- 1. Convertir a Componente de Cliente

import { useEffect } from 'react'; // <-- 2. Importar useEffect
import { z } from 'zod';
import { useHeader } from '@/context/HeaderContext'; // <-- 3. Importar useHeader
import { columns } from '@/components/panel-actas/compliance/columns';
import { DataTable } from '@/components/panel-actas/compliance/data-table';
import { actaSchema, Acta } from '@/lib/data-schema'; // <-- 4. Importar el tipo Acta
import actasData from '@/lib/actas'; // <-- 5. Importar el JSON directamente

export default function ActasPage() {
  const { setTitle } = useHeader(); // <-- 6. Usar el hook

  // 7. Establecer el título del header cuando el componente se monte
  useEffect(() => {
    setTitle('Panel de actas (Compliance)');
  }, [setTitle]);

  // 8. Validar y usar los datos del JSON importado
  const actas = z.array(actaSchema).parse(actasData) as Acta[];

  return (
    <div className="flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <DataTable data={actas} columns={columns} />
    </div>
  );
}
