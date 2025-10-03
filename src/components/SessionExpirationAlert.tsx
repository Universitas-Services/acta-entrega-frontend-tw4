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
import { FiClock, FiLogOut, FiRefreshCw } from 'react-icons/fi';

interface SessionExpirationAlertProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SessionExpirationAlert({
  isOpen,
  onConfirm,
  onCancel,
}: SessionExpirationAlertProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-white max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center">
            <FiClock className="mr-2" />
            Tu sesión está a punto de expirar
          </AlertDialogTitle>
          <AlertDialogDescription>
            ¿Deseas extender tu sesión para no perder tu trabajo?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4 gap-2">
          {/* Este botón solo llama a onCancel */}
          <AlertDialogCancel onClick={onCancel}>
            <FiLogOut className="mr-2" />
            Cerrar Sesión
          </AlertDialogCancel>
          {/* Este botón solo llama a onConfirm */}
          <AlertDialogAction onClick={onConfirm}>
            <FiRefreshCw className="mr-2" />
            Continuar Sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
