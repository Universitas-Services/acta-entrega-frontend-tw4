import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

import { columns } from '@/components/columns';
import { DataTable } from '@/components/data-table';
import { actaSchema } from '@/lib/data-schema';

// Función para obtener y validar los datos de actas
async function getActas() {
  const dataPath = path.join(process.cwd(), 'src/lib/actas.json');

  const data = await fs.readFile(dataPath, 'utf-8'); // Especificar la codificación
  const actas = JSON.parse(data);

  // Usamos Zod para asegurar que los datos tienen la forma esperada.
  return z.array(actaSchema).parse(actas);
}

export default async function ActasPage() {
  const actas = await getActas();

  return (
    <div className="flex-1 flex-col space-y-8 p-4 md:p-8 md:flex">
      <DataTable data={actas} columns={columns} />
    </div>
  );
}
