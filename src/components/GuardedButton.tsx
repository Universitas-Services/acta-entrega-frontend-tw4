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
  const { isDirty, setIsDirty } = useFormDirtyStore();
  const { open } = useModalStore(); // <-- Obtenemos la función 'open' del store

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e); // Ejecuta el onClick pasado (para cerrar el sidebar móvil)
    }

    if (isDirty) {
      e.preventDefault(); // Detenemos la navegación por defecto

      // Llamamos al store para abrir el modal
      open('unsavedChanges', {
        // Le pasamos la lógica que debe ejecutarse si el usuario confirma
        onConfirm: () => {
          setIsDirty(false); // Limpiamos el estado "dirty"
          router.push(href); // Y navegamos
        },
      });
    } else {
      // Navegación normal si no hay cambios
      setTimeout(() => router.push(href), 100);
    }
  };

  // El botón ya no renderiza ningún diálogo. Está limpio y desacoplado.
  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
