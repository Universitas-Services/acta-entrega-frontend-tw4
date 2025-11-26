'use client';

import { useState, useEffect } from 'react';
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
import { LuShieldQuestion } from 'react-icons/lu';
import { useModalStore } from '@/stores/useModalStore';
import { toast } from 'sonner';

export function SaveOnExitDialog() {
  const { isOpen, type, payload, close } = useModalStore();
  const [loadingAction, setLoadingAction] = useState<'stay' | 'leave' | null>(
    null
  );

  const isModalOpen = isOpen && type === 'saveOnExitPro';

  // Reseteamos el estado cuando el modal se cierra o abre
  useEffect(() => {
    if (!isModalOpen) {
      setLoadingAction(null);
    }
  }, [isModalOpen]);

  if (!payload.onSave || !payload.onNavigate) {
    return null;
  }

  // Guardar y Quedarse
  const handleSaveAndStay = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir comportamiento por defecto si es necesario
    setLoadingAction('stay'); // Marcamos que es este botón
    try {
      await payload.onSave?.();
      close();
    } catch (error) {
      console.error(error);
      toast.error('Error inesperado al guardar.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Guardar y Salir
  const handleSaveAndLeave = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoadingAction('leave'); // Marcamos que es este botón
    try {
      await payload.onSave?.();
      setTimeout(() => {
        payload.onNavigate?.();
        close();
      }, 500);
    } catch (error) {
      toast.error('No se pudo guardar, cancelando salida.');
      setLoadingAction(null); // Solo quitamos carga si falló
    }
  };

  // Helper para saber si hay ALGUNA acción cargando (para deshabilitar ambos)
  const isAnyLoading = loadingAction !== null;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={close}>
      <AlertDialogContent className="max-w-sm text-center data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 bg-white">
        <AlertDialogHeader className="flex flex-col items-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <LuShieldQuestion className="h-8 w-8 text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-black">
            ¿Seguro que quieres salir?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground ">
            Su proceso se está guardando, podrá continuar la elaboración de su
            acta dirigiéndose al panel de actas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:justify-center">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="cursor-pointer text-black flex-1 bg-g2 hover:bg-g3 border-g4 font-bold"
              onClick={handleSaveAndStay}
              disabled={isAnyLoading}
            >
              {loadingAction === 'stay'
                ? 'Guardando...'
                : 'Guardar y permanecer'}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="default"
              className="cursor-pointer flex-1 font-bold"
              onClick={handleSaveAndLeave}
              disabled={isAnyLoading}
            >
              {loadingAction === 'leave' ? 'Guardando...' : 'Guardar y salir'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
