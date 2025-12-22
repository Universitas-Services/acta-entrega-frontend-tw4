'use client';

import { ColumnDef, Row, Table } from '@tanstack/react-table';
import {
  Acta,
  downloadActa,
  resendActaEmail,
  deleteActa,
  entregarActa,
} from '@/services/actasService';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { FiEdit } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { LuArrowUpDown } from 'react-icons/lu';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Definimos una interfaz para el meta de la tabla (lo que pasas en data-table.tsx)
interface TableMeta {
  onRefresh?: () => void;
}

// Tipamos correctamente los props usando los tipos de la librería
interface ActionsCellProps {
  row: Row<Acta>;
  table: Table<Acta>;
}

// --- COMPONENTE INTERNO PARA EL SWITCH DE ENTREGAR ---
const EntregarSwitch = ({ row, table }: ActionsCellProps) => {
  const acta = row.original;
  const isEntregada = acta.status === 'ENTREGADA';
  const isCompleted = !!acta.isCompleted;

  // Deshabilitado si ya está entregada o no está completa
  const isDisabled = isEntregada || !isCompleted;

  const refreshTable = () => {
    (table.options.meta as TableMeta)?.onRefresh?.();
  };

  const handleEntregar = async (checked: boolean) => {
    if (!checked || isDisabled) return;

    toast.promise(entregarActa(acta.id), {
      loading: 'Marcando como entregada...',
      success: () => {
        refreshTable();
        return 'Acta marcada como entregada';
      },
      error: 'Error al marcar como entregada',
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center">
            <Switch
              checked={isEntregada}
              onCheckedChange={handleEntregar}
              disabled={isDisabled}
              className={cn(isEntregada && 'data-[state=checked]:bg-green-500')}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isEntregada
            ? 'Acta ya entregada'
            : !isCompleted
              ? 'Complete el formulario para entregar'
              : 'Marcar como entregada'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// --- COMPONENTE INTERNO PARA LAS ACCIONES (SOLUCIÓN AL ERROR DE HOOKS) ---
const ActionsCell = ({ row, table }: ActionsCellProps) => {
  const acta = row.original;
  const router = useRouter(); // Ahora sí podemos usar el hook

  // Verificamos si el acta está completa (default false si no viene)
  const isCompleted = !!acta.isCompleted;

  const refreshTable = () => {
    // Hacemos un cast seguro al meta que definimos arriba
    (table.options.meta as TableMeta)?.onRefresh?.();
  };

  const handleEdit = () => {
    let route = '#';
    // Lógica de rutas movida aquí adentro
    if (acta.type.includes('MAXIMA_AUTORIDAD'))
      route = `/dashboard/actas-pro/ma-pro?id=${acta.id}`;
    else if (acta.type.includes('ENTRANTE'))
      route = `/dashboard/actas-pro/entrante-pro?id=${acta.id}`;
    else if (acta.type.includes('SALIENTE'))
      route = `/dashboard/actas-pro/saliente-pro?id=${acta.id}`;

    router.push(route);
  };

  const handleDownload = async () => {
    toast.promise(downloadActa(acta.id, acta.numeroActa || 'SN'), {
      loading: 'Generando documento...',
      success: () => {
        refreshTable();
        return 'Descarga iniciada';
      },
      error: 'Error al descargar',
    });
  };

  const handleSendEmail = async () => {
    toast.promise(resendActaEmail(acta.id), {
      loading: 'Enviando correo...',
      success: () => {
        refreshTable();
        return 'Correo enviado exitosamente';
      },
      error: 'No se pudo enviar el correo',
    });
  };

  const handleDelete = async () => {
    toast.promise(deleteActa(acta.id), {
      loading: 'Eliminando...',
      success: () => {
        refreshTable();
        return 'Acta eliminada';
      },
      error: 'Error al eliminar',
    });
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className="cursor-pointer"
        onClick={handleEdit}
      >
        <FiEdit className="h-4 w-4" />
        Edit
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <BsThreeDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white text-black">
          <DropdownMenuItem className="cursor-pointer" onClick={handleEdit}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <TooltipProvider>
            {/* ITEM: ENVIAR */}
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Usamos un div wrapper o aplicamos eventos manualmente porque disabled previene eventos */}
                <div className="w-full outline-none">
                  <DropdownMenuItem
                    className={cn(
                      'cursor-pointer w-full',
                      !isCompleted && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={(e) => {
                      if (!isCompleted) {
                        e.preventDefault();
                        return;
                      }
                      handleSendEmail();
                    }}
                  >
                    Enviar
                  </DropdownMenuItem>
                </div>
              </TooltipTrigger>
              {!isCompleted && (
                <TooltipContent side="left">
                  <p>Completa el formulario para habilitar</p>
                </TooltipContent>
              )}
            </Tooltip>

            {/* ITEM: DESCARGAR */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full outline-none">
                  <DropdownMenuItem
                    className={cn(
                      'cursor-pointer w-full',
                      !isCompleted && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={(e) => {
                      if (!isCompleted) {
                        e.preventDefault();
                        return;
                      }
                      handleDownload();
                    }}
                  >
                    Descargar
                  </DropdownMenuItem>
                </div>
              </TooltipTrigger>
              {!isCompleted && (
                <TooltipContent side="left">
                  <p>Completa el formulario para habilitar</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// --- DEFINICIÓN DE COLUMNAS ---
export const columns: ColumnDef<Acta>[] = [
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
    accessorKey: 'numeroActa',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Número de Acta
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const val = row.getValue('numeroActa') as string;
      return <div className="font-medium pl-2">{val || 'S/N'}</div>;
    },
  },
  {
    accessorKey: 'nombreEntidad',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre del Órgano
          <LuArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const val = row.getValue('nombreEntidad') as string;
      return <div className="pl-2">{val || 'Sin Entidad'}</div>;
    },
  },
  {
    accessorKey: 'type',
    header: 'Tipo de Acta',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      let label = type;
      if (type.includes('MAXIMA_AUTORIDAD')) label = 'Máxima Autoridad';
      if (type.includes('ENTRANTE')) label = 'Servidor Entrante';
      if (type.includes('SALIENTE')) label = 'Servidor Saliente';

      return (
        <div className="flex flex-col">
          <span>{label}</span>
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
      let customClass = '';

      if (status === 'GUARDADA') {
        variant = 'secondary';
        label = 'Guardada';
      } else if (status === 'ENVIADA') {
        variant = 'default';
        label = 'Enviada';
      } else if (status === 'DESCARGADA') {
        variant = 'outline';
        label = 'Descargada';
      } else if (status === 'ENTREGADA') {
        variant = 'default';
        label = 'Entregada';
        customClass =
          'bg-green-500 hover:bg-green-600 text-white border-green-500';
      }

      return (
        <Badge variant={variant} className={customClass}>
          {label}
        </Badge>
      );
    },
  },
  {
    id: 'entregar',
    header: () => <div className="text-center">Entregar</div>,
    cell: ({ row, table }) => <EntregarSwitch row={row} table={table} />,
  },
  {
    id: 'actions',
    header: () => null,
    cell: ({ row, table }) => <ActionsCell row={row} table={table} />,
  },
];
