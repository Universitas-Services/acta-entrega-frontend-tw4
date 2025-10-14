import Header from '@/components/Header';
import AppSidebar from '@/components/AppSidebar';
import { HeaderProvider } from '@/context/HeaderContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PopupManager } from '@/components/PopupManager';
import { LogoutConfirmationDialog } from '@/components/LogoutConfirmationDialog';
import { SessionManager } from '@/components/SessionManager';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <HeaderProvider>
        <SidebarProvider>
          {/* El `bg-body-dashboard` ya no es necesario, `bg-background` lo maneja globalmente */}
          <div className="flex h-screen w-screen overflow-hidden text-g8">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              {/* El color de fondo del main ya viene de la variable --background */}
              <main
                id="main-content-container"
                className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
              >
                {children}
              </main>
            </div>
          </div>
          <LogoutConfirmationDialog />
          <PopupManager />
          <SessionManager />
        </SidebarProvider>
      </HeaderProvider>
    </ProtectedRoute>
  );
}
