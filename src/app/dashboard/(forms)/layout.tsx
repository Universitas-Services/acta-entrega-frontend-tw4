// src/app/dashboard/(forms)/layout.tsx
'use client';

import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { HeaderProvider } from '@/context/HeaderContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PopupManager } from '@/components/PopupManager';
import { LogoutConfirmationDialog } from '@/components/LogoutConfirmationDialog';
import { SessionManager } from '@/components/SessionManager';
import { UnsavedChangesDialog } from '@/components/UnsavedChangesDialog';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FormsProLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // --- INICIO: Lógica para controlar el scroll del body ---
    // Al montar este layout (o al navegar dentro de él), ocultamos el scroll del body
    document.body.style.overflow = 'hidden';

    // Función de limpieza: Se ejecuta al desmontar el layout (navegar fuera de /forms/)
    return () => {
      // Restauramos el scroll del body a su estado normal
      document.body.style.overflow = '';
    };
    // --- FIN: Lógica para controlar el scroll del body ---
  }, []); // El array vacío asegura que esto se ejecute solo al montar/desmontar el layout

  useEffect(() => {
    // Lógica opcional para resetear el scroll INTERNO de <main> si es necesario
    const mainContent = document.getElementById('main-content-forms');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]); // Se ejecuta en cada cambio de ruta DENTRO de este layout

  return (
    <ProtectedRoute>
      <HeaderProvider>
        <SidebarProvider>
          {/* Contenedor Flex Principal: Ocupa toda la pantalla y oculta su propio overflow */}
          <div className="flex h-screen w-screen overflow-hidden text-g8">
            {' '}
            {/* overflow-hidden es clave aquí */}
            <AppSidebar />
            {/* Área de Contenido: Header + Main */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {' '}
              {/* overflow-hidden también aquí */}
              {/* Header: Altura fija */}
              <Header />
              {/* Main: Ocupa el espacio restante y permite scroll INTERNO */}
              <main
                id="main-content-forms"
                className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-[calc(4rem+env(safe-area-inset-bottom))]"
              >
                {/* Aquí dentro va el Card con h-[calc(100vh-10rem)] */}
                {children}
              </main>
            </div>
          </div>
          {/* Modales globales */}
          <LogoutConfirmationDialog />
          <UnsavedChangesDialog />
          <PopupManager />
          <SessionManager />
        </SidebarProvider>
      </HeaderProvider>
    </ProtectedRoute>
  );
}
