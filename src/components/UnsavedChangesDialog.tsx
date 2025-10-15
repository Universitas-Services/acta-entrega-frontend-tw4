// En: src/components/UnsavedChangesDialog.tsx
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
import { useModalStore } from '@/stores/useModalStore'; // <-- Importamos el store

export function UnsavedChangesDialog() {
  // Obtenemos el estado y las funciones del store
  const { isOpen, type, payload, close } = useModalStore();

  // El diálogo solo es visible si el tipo es 'unsavedChanges'
  const isModalOpen = isOpen && type === 'unsavedChanges';

  // Si no hay una función de confirmación en el payload, no hacemos nada
  if (!payload.onConfirm) {
    return null;
  }

  return (
    <AlertDialog open={isModalOpen} onOpenChange={close}>
      <AlertDialogContent className="max-w-sm text-center data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 bg-white">
        <AlertDialogHeader className="flex flex-col items-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-yellow100 flex items-center justify-center">
            <LuTriangleAlert className="h-8 w-8 text-yellow600" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-black">
            {payload.title || '¿Seguro que quieres salir?'}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground ">
            {payload.description ||
              'Tienes cambios sin guardar. Si sales ahora, perderás todo el progreso en este formulario.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:justify-center">
          <AlertDialogCancel asChild>
            <Button
              onClick={close} // El botón Cancelar simplemente cierra el modal
              variant="outline"
              className="cursor-pointer text-black flex-1 bg-g2 hover:bg-g3 border-g4 font-bold"
            >
              Permanecer
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              className="cursor-pointer flex-1 hover:bg-destructive/90 font-bold "
              onClick={() => {
                payload.onConfirm?.(); // Ejecuta la acción de confirmación (navegar, etc.)
                close(); // Cierra el modal después de confirmar
              }}
            >
              Salir
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
