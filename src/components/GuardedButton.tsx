// src/components/GuardedButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormDirtyStore } from '@/stores/useFormDirtyStore';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';
import { Button, type buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';

// 1. Definimos las nuevas props. Heredan todas las de un botón normal
//    y le añadimos la prop 'href' que necesitamos.
interface GuardedButtonProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  href: string;
}

export function GuardedButton({
  href,
  onClick,
  children,
  variant = 'link',
  ...props
}: GuardedButtonProps) {
  const router = useRouter();
  const { isDirty, setIsDirty } = useFormDirtyStore();
  const [showDialog, setShowDialog] = useState(false);
  const [intendedHref, setIntendedHref] = useState('');

  // 2. La lógica de click ahora decide si navegar o mostrar el diálogo.
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Primero, si hay una función onClick (como la que cierra el sidebar), la ejecutamos.
    // Esto inicia el proceso de cierre INMEDIATAMENTE.
    if (onClick) {
      onClick(e);
    }

    if (isDirty) {
      e.preventDefault();
      setIntendedHref(href);
      setShowDialog(true);
    } else {
      // --- LA SOLUCIÓN ---
      // En lugar de navegar al instante, lo hacemos en el siguiente "tick" del navegador.
      // setTimeout con 0ms es una técnica para diferir la ejecución hasta que la pila
      // de llamadas actual esté vacía. Esto le da tiempo a React para procesar el
      // cambio de estado que cierra el sidebar antes de que comience la navegación.
      setTimeout(() => {
        router.push(href);
      }, 100); // 100ms es un buen valor para permitir que la animación comience.
    }
  };

  const handleConfirm = () => {
    setIsDirty(false);
    setShowDialog(false);
    // También aplicamos el retraso aquí para consistencia
    setTimeout(() => {
      router.push(intendedHref);
    }, 100);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setIntendedHref('');
  };

  // 3. El componente ahora renderiza un <Button> de Shadcn,
  //    pasándole todas las props y nuestro manejador de click.
  return (
    <>
      <Button onClick={handleClick} {...props}>
        {children}
      </Button>
      <UnsavedChangesDialog
        isOpen={showDialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
