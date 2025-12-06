'use client';

import { useState } from 'react';
import { ColumnDef, Row, Table } from '@tanstack/react-table';
import {
  ComplianceActa,
  downloadCompliance,
  sendComplianceEmail,
  getObservacionesCompliance,
} from '@/services/actasService';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { BsThreeDots, BsEye } from 'react-icons/bs';
import { LuArrowUpDown, LuSend, LuDownload } from 'react-icons/lu';
import { ComplianceObservationSheet } from '@/components/ComplianceObservationSheet';
import { toast } from 'sonner';

// Interfaz para el meta de la tabla (para refrescar datos)
interface TableMeta {
  onRefresh?: () => void;
}

interface ActionsCellProps {
  row: Row<ComplianceActa>;
  table: Table<ComplianceActa>;
}

// --- COMPONENTE DE ACCIONES INTERNO ---
const ActionsCell = ({ row, table }: ActionsCellProps) => {
  const acta = row.original;
  // Estado para controlar la apertura del Sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Estados para manejar las observaciones y la carga
  const [observacionesData, setObservacionesData] = useState<string | null>(
    null
  );
  const [isLoadingObservations, setIsLoadingObservations] = useState(false);

  // Función para refrescar la tabla
  const refreshTable = () => {
    (table.options.meta as TableMeta)?.onRefresh?.();
  };

  // Manejo de la visualización de observaciones
  const handleViewObservations = async () => {
    // Abrir el Sheet inmediatamente
    setIsSheetOpen(true);

    // Activar spinner (loading)
    setIsLoadingObservations(true);
    setObservacionesData(null); // Limpiar data previa si la hubiera

    try {
      // Intentar traer las observaciones (GET)
      const data = await getObservacionesCompliance(acta.id);

      // Aseguramos que lo que guardamos sea un string o null
      if (typeof data === 'string') {
        setObservacionesData(data);
      } else if (data && typeof data === 'object') {
        // Si por error llega un objeto, lo convertimos a string para evitar fallos
        setObservacionesData(JSON.stringify(data, null, 2));
      } else {
        setObservacionesData(null);
      }
    } catch (error) {
      console.error('Error cargando observaciones', error);
      toast.error('No se pudieron cargar las observaciones.');
    } finally {
      // Desactivar spinner
      setIsLoadingObservations(false);
    }
  };

  const handleDownload = async () => {
    toast.promise(downloadCompliance(acta.id, acta.numeroCompliance || 'SN'), {
      loading: 'Generando documento de compliance...',
      success: () => {
        refreshTable();
        return 'Descarga iniciada';
      },
      error: 'Error al descargar el archivo',
    });
  };

  const handleSendEmail = async () => {
    toast.promise(sendComplianceEmail(acta.id), {
      loading: 'Enviando reporte por correo...',
      success: () => {
        refreshTable();
        return 'Correo enviado exitosamente';
      },
      error: 'No se pudo enviar el correo',
    });
  };

  return (
    <>
      {/* Renderizamos el Sheet aquí, vinculado al estado local */}
      <ComplianceObservationSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        actaId={acta.id}
        numeroCompliance={acta.numeroCompliance || 'S/N'}
        observaciones={observacionesData} // Data obtenida del GET
        isLoading={isLoadingObservations} // Estado del Spinner
      />

      <div className="flex items-center justify-end space-x-2">
        {/* Botón directo para ver observaciones (Abre el Sheet) */}
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer text-muted-foreground hover:text-primary"
          onClick={handleViewObservations}
          title="Ver Observaciones"
        >
          <BsEye className="h-4 w-4" />
          Ver Obs
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <BsThreeDots className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white text-black min-w-[160px]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleViewObservations}
            >
              <BsEye className="mr-2 h-4 w-4" />
              Ver Observaciones
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleSendEmail}
            >
              <LuSend className="mr-2 h-4 w-4" />
              Enviar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleDownload}
            >
              <LuDownload className="mr-2 h-4 w-4" />
              Descargar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

// --- DEFINICIÓN DE COLUMNAS ---
export const columns: ColumnDef<ComplianceActa>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'numeroCompliance', // Ajustado a la interfaz ComplianceActa
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Número de Acta
          <LuArrowUpDown className="h-4 w-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const val = row.getValue('numeroCompliance') as string;
      return <div className="font-medium pl-4">{val || 'S/N'}</div>;
    },
  },
  {
    accessorKey: 'nombre_organo_entidad',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre del Órgano
          <LuArrowUpDown className="h-4 w-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const val = row.getValue('nombre_organo_entidad') as string;
      return (
        <div className="pl-4 truncate max-w-[300px]" title={val}>
          {val || 'Sin Entidad'}
        </div>
      );
    },
  },
  {
    accessorKey: 'puntajeCalculado', // Nueva Columna
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Puntuación
          <LuArrowUpDown className="h-4 w-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      // Asumiendo que viene un número (0-100)
      const score = row.getValue('puntajeCalculado') as number;
      // Color semántico simple
      let colorClass = 'text-red-600';
      if (score >= 80) colorClass = 'text-green-600';
      else if (score >= 50) colorClass = 'text-yellow-600';

      return (
        <div className={`pl-4 font-bold ${colorClass}`}>
          {score !== undefined ? `${score}%` : '-'}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Estatus',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        'secondary';
      let label = status;

      if (status === 'GUARDADA') {
        variant = 'secondary';
        label = 'Guardada';
      } else if (status === 'ENVIADA') {
        variant = 'default';
        label = 'Enviada';
      } else if (status === 'DESCARGADA') {
        variant = 'outline';
        label = 'Descargada';
      }

      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => <ActionsCell row={row} table={table} />,
  },
];
