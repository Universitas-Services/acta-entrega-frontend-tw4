'use client';

import { ColumnDef } from '@tanstack/react-table';

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

import { Acta } from '@/lib/data-schema';
import { FiEdit } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { LuArrowUpDown } from 'react-icons/lu';

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
    accessorKey: 'numero',
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
  },
  {
    accessorKey: 'organo',
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
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo de Acta',
  },
  {
    accessorKey: 'estatus',
    header: 'Estatus',
    cell: ({ row }) => {
      const estatus = row.getValue('estatus') as string;
      return <Badge variant="outline">{estatus}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const acta = row.original;

      return (
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="sm" className="cursor-pointer">
            <FiEdit className="mr-2 h-4 w-4" />
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
              <DropdownMenuItem className="cursor-pointer">
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Ver Observaciones
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="cursor-pointer">
                Generar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled className="cursor-pointer">
                Enviar
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="cursor-pointer">
                Descargar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
