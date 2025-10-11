'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Obtenemos los valores directamente del store para mayor claridad
  const token = useAuthStore((state) => state.token);
  const initialize = useAuthStore((state) => state.initialize);

  // 1. Creamos un estado para saber si ya revisamos el localStorage
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Al cargar el componente, inicializamos el estado desde localStorage
    // y marcamos como inicializado.
    initialize();
    setIsInitialized(true);
  }, [initialize]);

  useEffect(() => {
    // 2. Este efecto ahora solo se ejecuta DESPUÉS de la inicialización
    if (isInitialized && !token) {
      // Si ya revisamos y AÚN ASÍ no hay token, entonces redirigimos.
      router.push('/login');
    }
  }, [token, isInitialized, router]);

  //  3. NO MOSTRAMOS NADA hasta que la inicialización haya terminado Y haya un token.
  // Esto cierra la ventana de tiempo y previene la "condición de carrera".
  if (!isInitialized || !token) {
    return null; // Muestra una pantalla en blanco (o un spinner) mientras verifica
  }

  // Si todo está en orden, muestra el contenido protegido.
  return <>{children}</>;
}
