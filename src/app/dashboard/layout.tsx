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
  return (
    <ProtectedRoute>
      <HeaderProvider>
        <SidebarProvider>
          <div className="flex h-screen w-screen text-g8">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <Header />
              <main
                id="main-content-container"
                className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-[calc(1rem+env(safe-area-inset-bottom))]"
              >
                {children}
              </main>
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
