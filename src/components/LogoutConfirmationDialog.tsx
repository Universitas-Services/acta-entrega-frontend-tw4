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
import { Button, buttonVariants } from '@/components/ui/button';
import { AiOutlineLogout } from 'react-icons/ai';
import { useModalStore } from '@/stores/useModalStore';
import { cn } from '@/lib/utils';

export function LogoutConfirmationDialog() {
  // Obtenemos el estado y las funciones de nuestro store
  const { isOpen, type, payload, close } = useModalStore();

  // El diálogo solo debe ser visible si es del tipo 'logoutConfirmation'
  const isModalOpen = isOpen && type === 'logoutConfirmation';

  // Si no hay una función de confirmación, no renderizamos nada
  if (!payload.onConfirm) {
    return null;
  }

  return (
    <AlertDialog open={isModalOpen} onOpenChange={close}>
      <AlertDialogContent className="max-w-sm text-center data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 bg-white">
        <AlertDialogHeader className="flex flex-col items-center">
          <div className="mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AiOutlineLogout className="h-8 w-8 text-destructive" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-black">
            {payload.title || '¿Ya te vas?'}
          </AlertDialogTitle>
          {payload.description && (
            <AlertDialogDescription className="text-base ext-muted-foreground text-center">
              {payload.description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:justify-center">
          <AlertDialogCancel asChild>
            <Button className="flex-1 font-bold bg-muted hover:bg-accent border-border text-black cursor-pointer">
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              buttonVariants({ variant: 'destructive' }),
              'flex-1 font-bold cursor-pointer hover:bg-red700'
            )}
            onClick={() => {
              payload.onConfirm?.();
              close();
            }}
          >
            Cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
