import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import {
  getMyProfile,
  getAuthenticatedUser,
  loginUser,
  refreshToken as apiRefreshToken,
  type LoginData,
  type IUser,
  type IBasicUser,
  type IUserProfile,
  type AuthTokenResponse,
} from '@/services/authService';
import { axiosPublic } from '@/lib/axios';
import {
  setAuthTokens,
  setUserData,
  getUserData,
  getMyData,
  clearAuthStorage,
  getIsAuthenticated,
  getAccessToken,
  getRefreshToken,
} from '@/lib/authStorage';

interface AuthState {
  status: 'idle' | 'loading' | 'loadingProfile' | 'error';
  showFirstLoginPopup: boolean;
  isAuthenticated: boolean;
  user: IUser | null;
  basic: IBasicUser | null;
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
  basic: getMyData(),

  login: async (data) => {
    // 1. Añadimos un guardia para evitar dobles clics
    if (get().status === 'loading') return;
    set({ status: 'loading' });

    try {
      console.log('useAuthStore: Iniciando login...');
      const tokens = await loginUser(data);
      console.log('useAuthStore: Tokens recibidos:', tokens);

      setAuthTokens(tokens); // Guardar tokens directamente en localStorage

      // Actualizar el estado de Zustand
      set({
        isAuthenticated: getIsAuthenticated(),
        status: 'loading', // Aún cargando el perfil completo
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
    if (get().status === 'loadingProfile') return; // <-- AÑADIR ESTA LÍNEA (con estado propio)
    set({ status: 'loadingProfile' });

    try {
      console.log(
        'useAuthStore: Iniciando fetchFullProfile (GET /users/profile)...'
      );
      // 1. Llama a GET /users/profile
      const fullProfileData = await getMyProfile();
      console.log('useAuthStore: Perfil completo recibido:', fullProfileData);

      // 2. Fusiona los datos completos en el estado de Zustand
      //    (localStorage no se toca aquí)
      set((state) => ({
        user: { ...state.user, ...fullProfileData },
        status: 'idle',
      }));

      // --- 👇 LA LÓGICA DEL POPUP ESTÁ AQUÍ 👇 ---
      // 3. Comprueba la bandera del backend
      if (!fullProfileData.profileCompleted) {
        console.log(
          'useAuthStore: Perfil incompleto (profileCompleted:false). Mostrando popup.'
        );
        set({ showFirstLoginPopup: true });
      }
      // 4. Si es 'true', no hace nada y el popup no se muestra.
    } catch (error) {
      console.error('useAuthStore: Error al obtener perfil completo:', error);
      set({ status: 'error' });
      get().logout();
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
    if (get().status !== 'idle') return;
    set({ status: 'loading' });
    console.log('useAuthStore: Iniciando checkAuthOnLoad...');

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
        return;
      }
    } else {
      set({ isAuthenticated: true });
    }

    // --- 👇 LÓGICA DE CARGA DE DATOS AL RECARGAR PÁGINA 👇 ---
    try {
      // 1. Siempre obtenemos los datos BÁSICOS primero
      const basicUser = await getAuthenticatedUser();

      setUserData(basicUser); // Actualiza localStorage

      set({ user: basicUser, status: 'idle' });

      console.log('useAuthStore: Sesión válida, usuario básico (/my) cargado.');
    } catch (fetchError) {
      console.error('useAuthStore: Falló fetch al recargar, deslogueando.');
      get().logout();
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
