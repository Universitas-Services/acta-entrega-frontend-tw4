// src/components/SaveOnExitDialog.tsx
'use client';

import { useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = isOpen && type === 'saveOnExitPro';

  if (!payload.onSave || !payload.onNavigate) {
    return null;
  }

  const handleSaveAndStay = async () => {
    setIsLoading(true);
    try {
      await payload.onSave?.();
      toast.success('Progreso guardado exitosamente.');
    } catch (error) {
      toast.error('Error al guardar el progreso.');
    } finally {
      setIsLoading(false);
      close();
    }
  };

  const handleSaveAndLeave = async () => {
    setIsLoading(true);
    try {
      await payload.onSave?.();
      // No mostramos toast aquí, solo navegamos
      payload.onNavigate?.();
    } catch (error) {
      toast.error('Error al guardar, no se puede salir.');
    } finally {
      setIsLoading(false);
      close();
    }
  };

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
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar y permanecer'}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="default"
              className="cursor-pointer flex-1 font-bold"
              onClick={handleSaveAndLeave}
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar y salir'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
