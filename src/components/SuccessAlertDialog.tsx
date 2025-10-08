'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SuccessAlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
  onConfirm: () => void;
}

export function SuccessAlertDialog({
  isOpen,
  onClose,
  title,
  description,
  buttonText = 'Entendido',
  onConfirm,
}: SuccessAlertDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      {/* El fondo se hereda del tema, no es necesario 'bg-white' */}
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black">{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {/* El botón ahora usa el estilo 'primary' por defecto del tema */}
        <AlertDialogAction onClick={onConfirm} className="cursor-pointer">
          {buttonText}
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
