'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { LuTriangleAlert } from 'react-icons/lu';

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function UnsavedChangesDialog({
  isOpen,
  onConfirm,
  onCancel,
}: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent className="max-w-sm text-center data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]">
        <AlertDialogHeader className="flex flex-col items-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <LuTriangleAlert className="h-8 w-8 text-yellow-600" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold">
            ¿Seguro que quieres salir?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-gray-600">
            Tienes cambios sin guardar. Si sales ahora, perderás todo el
            progreso en este formulario.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:justify-center">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="flex-1 bg-gray-100 hover:bg-gray-200 border-gray-300 font-bold"
            >
              Permanecer
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 font-bold text-white"
              onClick={onConfirm}
            >
              Salir
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
