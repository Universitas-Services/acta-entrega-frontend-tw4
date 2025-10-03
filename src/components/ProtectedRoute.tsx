'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, initialize } = useAuthStore();

  useEffect(() => {
    // Inicializa el estado desde localStorage al cargar
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Si la inicialización ha terminado y no hay token, redirige al login
    if (!token) {
      // Obtenemos el token directamente de localStorage como última verificación
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        router.push('/login');
      }
    }
  }, [token, router]);

  // Si hay token, renderiza el contenido protegido
  if (token) {
    return <>{children}</>;
  }

  // Muestra un loader o null mientras se verifica el token
  return null;
}
