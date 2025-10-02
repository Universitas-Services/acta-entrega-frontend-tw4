'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

// Definimos la estructura de nuestro contexto
interface HeaderContextType {
  title: string;
  setTitle: (title: string) => void;
}

// Creamos el contexto con un valor inicial por defecto
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// Creamos el "Proveedor" que envolverá nuestra aplicación
export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('Menú Principal'); // Título por defecto

  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
}

// Creamos un hook personalizado para usar el contexto fácilmente
export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}
