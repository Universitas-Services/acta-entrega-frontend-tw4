'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useFormDirtyStore } from '@/stores/useFormDirtyStore';
import { useModalStore } from '@/stores/useModalStore';
import { useLoaderStore } from '@/stores/useLoaderStore';
import { Button, type buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';

interface GuardedButtonProps
  extends
    React.ComponentProps<typeof Button>,
    VariantProps<typeof buttonVariants> {
  href: string;
  isNavigation?: boolean; // Indica si el botón es para navegación (por defecto true)
}

export function GuardedButton({
  href,
  onClick,
  children,
  isNavigation = true, // Por defecto es true, es un botón de navegación
  ...props
}: GuardedButtonProps) {
  const router = useRouter();
  const pathname = usePathname(); // Obtener la ruta actual
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
  const { showLoader } = useLoaderStore();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e); // Ejecuta el onClick pasado (para cerrar el sidebar móvil)
    }

    // Botones que NO son de navegación
    // Si el botón está marcado explícitamente como no-navegación (ej. Panel de Actas),
    // detenemos aquí. No hay loader, no hay router.push, no hay validación de formulario sucio.
    if (!isNavigation) {
      return;
    }

    // Detección de Misma Página
    // Si la URL destino es idéntica a la actual, detenemos todo.
    // Esto evita el loader infinito y recargas innecesarias.
    if (pathname === href) {
      e.preventDefault();
      return;
    }

    // Función centralizada para navegar
    const performNavigation = () => {
      clearFormState();
      showLoader(); // ACTIVAR LOADER AQUÍ (Justo antes de irnos)
      router.push(href);
    };

    // --- LÓGICA DE GUARDADO / NAVEGACIÓN ---
    if (isDirty) {
      e.preventDefault(); // Detenemos la navegación por defecto

      // --- LÓGICA DE DECISIÓN ---
      if (isProForm && (hasReachedStep3 || !!actaId)) {
        // CASO PRO: Si es Pro Y (llegó al paso 3 O ya tiene ID guardado) -> Modal de Guardar
        open('saveOnExitPro', {
          onSave: onSave, // Pasamos la función de guardado del formulario
          onNavigate: performNavigation, // Pasamos la función de navegación
        });
      } else {
        // CASO EXPRESS: Si es Express, o es Pro nuevo en paso 1/2 -> Modal simple de "Descartar"
        open('unsavedChanges', {
          onConfirm: performNavigation, // La confirmación solo navega
        });
      }
    } else {
      // Navegación normal si no hay cambios
      // Activamos el loader inmediatamente y navegamos
      showLoader();
      // Usamos setTimeout 0 para permitir que el render del loader ocurra antes del push pesado
      setTimeout(() => router.push(href), 0);
    }
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
