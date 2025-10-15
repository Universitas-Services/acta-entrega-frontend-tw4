import { create } from 'zustand';

interface User {
  email: string;
  name: string;
  apellido?: string;
  role: string;
  isFirstLogin?: boolean; // 1. Añadimos el campo opcional aquí
}

interface AuthState {
  token: string | null;
  user: User | null;
  isFirstLogin: boolean; // 2. Y aquí para el estado principal
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
  completeFirstLogin: () => void; // 3. Nueva función para actualizar el estado
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isFirstLogin: false, // Valor inicial

  setAuth: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    // 4. Guardamos el estado de isFirstLogin al iniciar sesión
    set({ token, user, isFirstLogin: !!user.isFirstLogin });
  },
  // Acción para cerrar sesión
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    localStorage.removeItem('chatMessages');
    localStorage.removeItem('chatSessionId');
    set({ token: null, user: null, isFirstLogin: false }); // Reseteamos
  },
  // Acción para inicializar el estado desde localStorage al cargar la app
  initialize: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },

  // 5. Nueva función para llamar cuando el popup se haya completado
  completeFirstLogin: () => {
    set({ isFirstLogin: false });
    // También actualizamos el objeto de usuario en localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.isFirstLogin = false;
      localStorage.setItem('user', JSON.stringify(user));
    }
  },
}));
