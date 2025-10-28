'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { HeaderProvider } from '@/context/HeaderContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PopupManager } from '@/components/PopupManager';
import { LogoutConfirmationDialog } from '@/components/LogoutConfirmationDialog';
import { SessionManager } from '@/components/SessionManager';
import { UnsavedChangesDialog } from '@/components/UnsavedChangesDialog';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Resetea el scroll del contenedor principal en cada cambio de ruta
  // Esto previene que el header desaparezca y elimina padding indeseado
  useEffect(() => {
    const mainContent = document.getElementById('main-content-container');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);

  return (
    <ProtectedRoute>
      <HeaderProvider>
        <SidebarProvider>
          {/* Contenedor principal con scrollbar que abarca toda la pantalla */}
          <div
            id="main-content-container"
            className="fixed inset-0 flex text-g8 overflow-y-auto overflow-x-hidden"
          >
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              {/* Header fijo que no afecta el scrollbar */}
              <div className="sticky top-0 z-10 bg-background">
                <Header />
              </div>
              <div className="flex-1">
                <main className="p-4 md:p-6 lg:p-8 pb-[calc(4rem+env(safe-area-inset-bottom))]">
                  {children}
                </main>
              </div>
            </div>
          </div>
          <LogoutConfirmationDialog />
          <UnsavedChangesDialog />
          <PopupManager />
          <SessionManager />
        </SidebarProvider>
      </HeaderProvider>
    </ProtectedRoute>
  );
}
