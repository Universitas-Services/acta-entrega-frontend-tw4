// src/hooks/useMediaQuery.ts

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // 1. La clave es inicializar el estado leyendo el valor real,
  //    pero solo si estamos en el navegador. En el servidor, se usa 'false'.
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // Este código se ejecuta solo en el cliente.
    const media = window.matchMedia(query);

    // Función para actualizar el estado cuando cambie la pantalla.
    const listener = () => {
      setMatches(media.matches);
    };

    // Nos aseguramos de que el estado esté sincronizado al montar.
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Usamos el método moderno para escuchar cambios.
    media.addEventListener('change', listener);

    // Limpiamos el listener cuando el componente se desmonta.
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query, matches]); // Mantenemos 'matches' para re-sincronizar si es necesario.

  return matches;
}
