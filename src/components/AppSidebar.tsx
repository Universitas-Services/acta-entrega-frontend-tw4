'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { SidebarExpress } from '@/components/sidebar/SidebarExpress';
import { SidebarPro } from '@/components/sidebar/SidebarPro';
import { Skeleton } from '@/components/ui/skeleton';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { cn } from '@/lib/utils';

export default function AppSidebar() {
  // Obtenemos el usuario del store de autenticación
  const { user } = useAuthStore();
  // Obtenemos el estado de colapso para el esqueleto
  const { isDesktopCollapsed } = useSidebarStore();

  // Estado de carga (mientras el user store se hidrata)
  if (!user) {
    // Muestra un esqueleto del sidebar para evitar "saltos" (layout shift)
    // Solo mostramos esqueleto en desktop, en móvil no es necesario
    return (
      <div
        className={cn(
          'hidden md:flex flex-col border-r h-screen p-4 space-y-4 bg-sidebar', // bg-sidebar (blanco) por defecto
          isDesktopCollapsed ? 'w-20 items-center' : 'w-64',
          'transition-all duration-300'
        )}
      >
        <Skeleton className="h-10 w-full" />
        <Skeleton
          className={cn(
            'h-8 w-full',
            isDesktopCollapsed && 'w-10 h-10 rounded-full'
          )}
        />
        <Skeleton
          className={cn(
            'h-8 w-full',
            isDesktopCollapsed && 'w-10 h-10 rounded-full'
          )}
        />
        <Skeleton
          className={cn(
            'h-8 w-full',
            isDesktopCollapsed && 'w-10 h-10 rounded-full'
          )}
        />
        <div className="flex-1" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  // Lógica principal: renderizado condicional basado en el rol
  if (user.role === 'pro') {
    // Si el usuario es 'pro', renderiza el Sidebar Pro
    return <SidebarPro />;
  }

  // Para cualquier otro caso (rol 'express', 'user', undefined, etc.),
  // renderiza el Sidebar Express estándar.
  return <SidebarExpress />;
}
