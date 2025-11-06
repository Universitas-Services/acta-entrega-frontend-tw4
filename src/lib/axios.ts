import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import { refreshToken } from '@/services/authService';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// CLIENTE PÚBLICO
// Para login, register, forgot-password, y refresh
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// CLIENTE PRIVADO (el que estabas llamando 'apiClient')
// Para todas las peticiones autenticadas (/users/my, /actas, etc.)
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// --- INTERCEPTORES (SOLO PARA EL CLIENTE PRIVADO) ---

// Interceptor de Solicitud (Request)
apiClient.interceptors.request.use(
  (config) => {
    // Antes de cada petición, tomamos el access_token del store
    const accessToken = useAuthStore.getState().access_token;
    if (accessToken && !config.headers['Authorization']) {
      // Y lo añadimos a la cabecera
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta (Response)
apiClient.interceptors.response.use(
  (response) => response, // Si todo bien, dejamos pasar la respuesta
  async (error) => {
    const originalRequest = error.config;
    const { logout, setTokens } = useAuthStore.getState();

    // Si el error es 401 (token expirado) Y no lo hemos reintentado ya
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Marcamos que es un reintento

      const currentRefreshToken = useAuthStore.getState().refresh_token;

      if (currentRefreshToken) {
        try {
          // Intentamos obtener nuevos tokens
          const newTokens = await refreshToken(currentRefreshToken);
          // Los guardamos en el store
          setTokens(newTokens);
          // Actualizamos la cabecera de la petición original
          originalRequest.headers['Authorization'] =
            `Bearer ${newTokens.access_token}`;
          // Reintentamos la petición original (ahora con el token nuevo)
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Si el refresh token también falla, deslogueamos
          console.error('Refresh token fallido:', refreshError);
          logout();
          return Promise.reject(refreshError);
        }
      } else {
        // No hay refresh token, deslogueamos
        logout();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
