'use client';

import { useRouter } from 'next/navigation';
import { useFormDirtyStore } from '@/stores/useFormDirtyStore';
import { useModalStore } from '@/stores/useModalStore';
import { Button, type buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';

interface GuardedButtonProps
  extends React.ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  href: string;
}

export function GuardedButton({
  href,
  onClick,
  children,
  ...props
}: GuardedButtonProps) {
  const router = useRouter();
  // --- LEER EL ESTADO COMPLETO Y LAS ACCIONES ---
  const {
    isDirty,
    isProForm,
    hasReachedStep3,
    actaId,
    onSave,
    clearFormState,
  } = useFormDirtyStore();
  const { open } = useModalStore();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e); // Ejecuta el onClick pasado (para cerrar el sidebar móvil)
    }

    if (isDirty) {
      e.preventDefault(); // Detenemos la navegación por defecto

      const navigateAction = () => {
        clearFormState(); // Limpiamos el estado "dirty"
        router.push(href);
      };

      // --- LÓGICA DE DECISIÓN ---
      if (isProForm && (hasReachedStep3 || !!actaId)) {
        // CASO PRO: Si es Pro Y (llegó al paso 3 O ya tiene ID guardado) -> Modal de Guardar
        open('saveOnExitPro', {
          onSave: onSave, // Pasamos la función de guardado del formulario
          onNavigate: navigateAction, // Pasamos la función de navegación
        });
      } else {
        // CASO EXPRESS: Si es Express, o es Pro nuevo en paso 1/2 -> Modal simple de "Descartar"
        open('unsavedChanges', {
          onConfirm: navigateAction, // La confirmación solo navega
        });
      }
    } else {
      // Navegación normal si no hay cambios
      setTimeout(() => router.push(href), 100);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
