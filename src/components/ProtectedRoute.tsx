'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Skeleton } from './ui/skeleton';

/**
 * Este componente protege las rutas del dashboard.
 * Comprueba si el usuario está autenticado DESPUÉS de que el store
 * se haya rehidratado desde el localStorage.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // Obtenemos 'isAuthenticated' del store.
  // Usamos un selector simple para que solo se re-renderice si este valor cambia.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Estado local para saber si estamos "listos" en el cliente.
  // Esto evita problemas de hidratación de Next.js (Client/Server mismatch)
  // y nos da tiempo para que el store se cargue desde localStorage.
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    // Cuando el componente se monta en el cliente,
    // comprobamos la autenticación desde el store (que ya se rehidrató).

    if (!isAuthenticated) {
      // Si no está autenticado, lo enviamos al login.
      router.replace('/login');
    } else {
      // Si está autenticado, permitimos que se muestre el contenido.
      setIsClientReady(true);
    }
  }, [isAuthenticated, router]);

  // Mientras 'isClientReady' sea falso, mostramos un esqueleto de carga.
  // Esto cubre tanto la carga inicial del cliente como el breve
  // momento antes de la redirección si el usuario no está autenticado.
  if (!isClientReady) {
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

  // Si 'isClientReady' es verdadero, significa que el usuario
  // está autenticado y mostramos la página protegida.
  return <>{children}</>;
};

export default ProtectedRoute;
