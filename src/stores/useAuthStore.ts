import { create } from 'zustand';
// Importamos 'persist' para guardar en localStorage
import { persist } from 'zustand/middleware';
// Importamos las nuevas funciones y tipos de nuestro authService corregido
import {
  getMyProfile,
  loginUser,
  logoutUser,
  type LoginData,
  type IUser,
  type AuthTokenResponse,
} from '@/services/authService';
// NO importamos más Zod aquí

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'error';
  showFirstLoginPopup: boolean;
  login: (data: LoginData) => Promise<void>; // Usa la interface LoginData
  fetchUser: () => Promise<void>;
  setTokens: (tokens: AuthTokenResponse) => void;
  logout: () => void;
  setShowFirstLoginPopup: (isOpen: boolean) => void;
}

// Envolvemos todo en 'persist'
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access_token: null,
      refresh_token: null,
      user: null,
      isAuthenticated: false,
      status: 'idle',
      showFirstLoginPopup: false,

      login: async (data) => {
        set({ status: 'loading' });
        try {
          // Llama a loginUser, que devuelve { access_token, refresh_token }
          const tokens = await loginUser(data);

          set({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            isAuthenticated: true,
          });

          // Inmediatamente después, llama a fetchUser
          await get().fetchUser();
        } catch (error) {
          set({ status: 'error' });
          console.error('Error en el store al iniciar sesión:', error);
          throw error; // Relanza el error para que el LoginForm lo muestre
        }
      },

      // fetchUser (para /users/my)
      fetchUser: async () => {
        set({ status: 'loading' });
        try {
          // Llama al endpoint protegido (/users/my)
          const userData = await getMyProfile();

          set({
            user: userData,
            status: 'idle',
          });

          // esta lógica funciona porque 'userData' existe
          if (!userData.profile) {
            set({ showFirstLoginPopup: true });
          }
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          set({ status: 'error' });
          // Si fetchUser falla (ej. token inválido), el interceptor
          // intentará refrescarlo. Si todo falla, deslogueamos.
          get().logout();
        }
      },

      // setTokens (usada por el interceptor)
      setTokens: (tokens) => {
        set({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
        });
      },

      // FUNCIÓN LOGOUT CORREGIDA
      logout: () => {
        // Llama al backend para invalidar el token
        logoutUser().catch((err) => {
          console.error('Error al desloguear en el servidor:', err);
        });

        // Limpia el estado local
        set({
          access_token: null,
          refresh_token: null,
          user: null,
          isAuthenticated: false,
          showFirstLoginPopup: false,
          status: 'idle',
        });
      },

      // Función para establecer el estado de showFirstLoginPopup
      setShowFirstLoginPopup: (isOpen: boolean) => {
        set({ showFirstLoginPopup: isOpen });
      },
    }),
    {
      name: 'auth-storage', // Nombre de la clave en localStorage
      // Guardamos solo esto para que la sesión persista
      partialize: (state) => ({
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
