'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Este layout envuelve las páginas de autenticación (Login, Registro, etc.).
 * Su ÚNICA función es redirigir a los usuarios que YA ESTÁN AUTENTICADOS
 * fuera de estas páginas y llevarlos a su dashboard correspondiente.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Estado para gestionar la visualización del loader
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Leemos el estado síncrono de Zustand.
    // Al cargar la app, Zustand se hidrata desde localStorage,
    // por lo que 'isAuthenticated' y 'basic' están disponibles de inmediato.
    const { isAuthenticated, basic } = useAuthStore.getState();

    if (isAuthenticated && basic) {
      // 1. El usuario ESTÁ logueado. Redirigir.
      let targetRoute = '/dashboard';
      if (basic.role === 'PAID_PRO') {
        targetRoute = '/dashboard/pro';
      }
      router.replace(targetRoute);
      // NO cambiamos 'isChecking' a 'false', queremos
      // que el loader se siga mostrando hasta que la redirección surta efecto.
    } else {
      // 2. El usuario NO está logueado. Dejamos de cargar.
      // Es seguro mostrar la página de Login/Registro.
      setIsChecking(false);
    }
  }, [router]);

  // Si estamos comprobando, o si estamos en proceso de redirigir
  // (porque 'isAuthenticated' era true), mostramos el loader.
  if (isChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>
    );
  }

  // Si no estamos cargando (y por ende, no estamos autenticados),
  // mostramos el contenido de la página (Login, Registro, etc.).
  return <>{children}</>;
}
