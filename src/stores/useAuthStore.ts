import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import {
  getMyProfile,
  loginUser,
  refreshToken as apiRefreshToken,
  type LoginData,
  type IUser,
  type IUserProfile,
  type AuthTokenResponse,
} from '@/services/authService';
import { axiosPublic } from '@/lib/axios';
import {
  setAuthTokens,
  setUserData,
  getUserData,
  clearAuthStorage,
  getIsAuthenticated,
  getAccessToken,
  getRefreshToken,
} from '@/lib/authStorage';

interface AuthState {
  status: 'idle' | 'loading' | 'error';
  showFirstLoginPopup: boolean;
  isAuthenticated: boolean;
  user: IUser | null;
  login: (data: LoginData) => Promise<void>;
  fetchUser: () => Promise<void>;
  setTokens: (tokens: AuthTokenResponse) => void;
  logout: () => void;
  checkAuthOnLoad: () => Promise<void>;
  setShowFirstLoginPopup: (isOpen: boolean) => void;
  setUserProfile: (profile: IUserProfile) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  showFirstLoginPopup: false,
  isAuthenticated: getIsAuthenticated(),
  user: getUserData(),

  login: async (data) => {
    set({ status: 'loading' });
    try {
      console.log('useAuthStore: Iniciando login...');
      const tokens = await loginUser(data);
      console.log('useAuthStore: Tokens recibidos:', tokens);

      setAuthTokens(tokens); // Guardar tokens directamente en localStorage

      // Actualizar el estado de Zustand
      set({
        isAuthenticated: getIsAuthenticated(),
      });

      await get().fetchUser();
      console.log('useAuthStore: Login exitoso y usuario cargado.');
    } catch (error) {
      set({ status: 'error' });
      console.error(
        'useAuthStore: Error en el store al iniciar sesión:',
        error
      );
      throw error;
    }
  },

  fetchUser: async () => {
    // Si no estamos autenticados (o estamos en proceso de logout),
    // no intentes buscar un usuario.
    if (!get().isAuthenticated) {
      console.warn('useAuthStore: fetchUser abortado, no autenticado.');
      return;
    }

    set({ status: 'loading' });

    const existingUser = getUserData(); // Obtener usuario existente de localStorage
    const existingProfile = existingUser?.profile;

    try {
      console.log('useAuthStore: Iniciando fetchUser...');
      const userData = await getMyProfile();
      console.log('useAuthStore: Datos de usuario recibidos:', userData);

      if (userData.profile === null && existingProfile) {
        userData.profile = existingProfile;
        console.log('useAuthStore: Perfil preservado de localStorage.');
      }

      setUserData(userData); // Guardar datos de usuario directamente en localStorage

      // Actualizar el estado de Zustand
      set({
        user: userData,
        status: 'idle',
      });

      if (!userData.profile) {
        console.log(
          'useAuthStore: Perfil de usuario incompleto, mostrando popup.'
        );
        set({ showFirstLoginPopup: true });
      }
    } catch (error) {
      console.error('useAuthStore: Error al obtener datos del usuario:', error);
      set({ status: 'error' });
      get().logout(); // Si fetchUser falla, llamará a logout
      throw error;
    }
  },

  setTokens: (tokens) => {
    console.log('useAuthStore: Tokens actualizados por interceptor.');
    setAuthTokens(tokens); // Guardar tokens directamente en localStorage
    set({ isAuthenticated: getIsAuthenticated() }); // Actualizar estado de autenticación
  },

  logout: () => {
    // Si ya estamos deslogueados (isAuthenticated es false),
    // no hacer nada. Esto previene las llamadas en bucle.
    if (!get().isAuthenticated) {
      console.log('useAuthStore: Logout abortado, ya está desautenticado.');
      return;
    }

    console.log('useAuthStore: Iniciando logout...');

    // Obtenemos el REFRESH token para invalidarlo
    const tokenToInvalidate = getRefreshToken();

    clearAuthStorage(); // Limpiar nuestro localStorage

    set({
      isAuthenticated: false,
      user: null,
      showFirstLoginPopup: false,
      status: 'idle',
    });
    console.log('useAuthStore: Estado de autenticación limpiado.');

    if (tokenToInvalidate) {
      // Enviamos el refreshToken en el body
      axiosPublic
        .post(
          '/auth/logout',
          { refreshToken: tokenToInvalidate } // <- El token va aquí
          // Sin cabecera 'Authorization'
        )
        .catch((err) => {
          console.error(
            'useAuthStore: Error (ignorado) al notificar al servidor el logout:',
            err.message
          );
        });
    }
    // ProtectedRoute se encargará de la redirección
  },

  checkAuthOnLoad: async () => {
    const currentAccessToken = getAccessToken();
    const currentRefreshToken = getRefreshToken();
    const { logout, setTokens, fetchUser } = get();

    if (!currentAccessToken || !currentRefreshToken) {
      console.log('useAuthStore: No hay tokens, deslogueando.');
      logout();
      return;
    }

    let isTokenInvalidOrExpired = false;
    try {
      // Intentamos decodificar.
      const decodedToken: { exp: number } = jwtDecode(currentAccessToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        // Marcado como expirado si el tiempo pasó
        isTokenInvalidOrExpired = true;
      }
    } catch (error) {
      // Marcado como inválido si jwtDecode falla (token corrupto o "basura")
      console.warn(
        'useAuthStore: Token inválido o corrupto. Forzando refresh.'
      );
      isTokenInvalidOrExpired = true;
    }

    // Ahora, manejamos el refresh si es necesario.
    if (isTokenInvalidOrExpired) {
      console.log(
        'useAuthStore: Access token expirado o inválido, intentando refrescar...'
      );
      try {
        // Usar el refresh token para obtener nuevos tokens
        const newTokens = await apiRefreshToken(currentRefreshToken);
        setTokens(newTokens); // Guardar los nuevos tokens
        await fetchUser(); // Cargar usuario con los nuevos tokens
        console.log('useAuthStore: Tokens refrescados y usuario cargado.');
      } catch (refreshError) {
        // Si el refresh falla (ej. refresh token también expiró o es inválido)
        console.error(
          'useAuthStore: Falló el refresh token, deslogueando.',
          refreshError
        );
        logout(); // Ahora sí, deslogueamos.
      }
    } else {
      // El token ES válido y NO ha expirado
      console.log('useAuthStore: Access token válido, cargando usuario...');
      try {
        await fetchUser();
      } catch (fetchError) {
        // Esto puede pasar si el token es válido pero el servidor lo rechaza
        // (p.ej. el interceptor falló y llamó a logout).
        // `fetchUser` ya llama a `logout()` en su propio catch,
        // así que no necesitamos hacer nada extra aquí.
        console.error(
          'useAuthStore: Falló fetchUser (probablemente ya se está deslogueando).',
          fetchError
        );
      }
    }
  },

  setShowFirstLoginPopup: (isOpen: boolean) => {
    console.log('useAuthStore: Estableciendo showFirstLoginPopup a', isOpen);
    set({ showFirstLoginPopup: isOpen });
  },

  setUserProfile: (profile) => {
    set((state) => {
      const currentUser = getUserData();
      if (currentUser) {
        const updatedUser = { ...currentUser, profile: profile };
        setUserData(updatedUser);
        return { user: updatedUser };
      }
      return {};
    });
    console.log('useAuthStore: Perfil de usuario actualizado localmente.');
  },
}));
