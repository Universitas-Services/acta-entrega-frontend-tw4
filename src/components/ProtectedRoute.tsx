'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Skeleton } from './ui/skeleton';
import { getIsAuthenticated } from '@/lib/authStorage'; // Importar para verificar autenticación inicial

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAuthenticatedFromStore = useAuthStore(
    (state) => state.isAuthenticated
  );
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Este efecto se ejecuta solo en el cliente.
    // Verificamos el estado de autenticación directamente de localStorage.
    const initialAuthStatus = getIsAuthenticated();
    useAuthStore.setState({ isAuthenticated: initialAuthStatus }); // Sincronizar Zustand con localStorage

    setIsClientReady(true); // Marcar que el cliente ha verificado el estado de autenticación
  }, []);

  useEffect(() => {
    if (!isClientReady) {
      return;
    }

    // Si el cliente está listo y el usuario NO está autenticado, lo redirigimos.
    if (!isAuthenticatedFromStore) {
      router.replace('/login');
    }
  }, [isAuthenticatedFromStore, isClientReady, router]);

  // Mostramos el esqueleto mientras el cliente no ha verificado el estado de autenticación
  // O si el usuario no está autenticado y está a punto de ser redirigido.
  if (!isClientReady || !isAuthenticatedFromStore) {
    return (
      <div className="flex flex-col space-y-3 p-8">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      </div>
    );
  }

  // Si el cliente está listo y el usuario autenticado, mostramos el contenido.
  return <>{children}</>;
};

export default ProtectedRoute;
