// src/components/SessionManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import { refreshToken as apiRefreshToken } from '@/services/authService';
import { SessionExpirationAlert } from './SessionExpirationAlert';
import {
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from '@/lib/authStorage';

export function SessionManager() {
  // --- CORRECCIÓN DEL BUCLE INFINITO ---
  // Seleccionamos cada función individualmente.
  // Esto devuelve una referencia estable y no causa un nuevo renderizado.
  const logout = useAuthStore((state) => state.logout);
  const checkAuthOnLoad = useAuthStore((state) => state.checkAuthOnLoad);
  // --- FIN DE LA CORRECCIÓN ---

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Ejecutar checkAuthOnLoad al montar el componente
  useEffect(() => {
    checkAuthOnLoad();
  }, [checkAuthOnLoad]); // Esta dependencia es estable, se ejecuta 1 vez.

  useEffect(() => {
    const access_token = getAccessToken(); // Obtener access_token directamente de localStorage

    if (!access_token) {
      // Si no hay token, checkAuthOnLoad() ya se está encargando o se encargó
      // de redirigir al login. No hacemos nada aquí.
      return;
    }

    let sessionTimeout: NodeJS.Timeout;

    try {
      const decodedToken: { exp: number } = jwtDecode(access_token);
      const expirationTime = decodedToken.exp * 1000; // en milisegundos
      const currentTime = Date.now();

      // Mostrar alerta 5 minutos antes de la expiración
      const warningTime = expirationTime - currentTime - 5 * 60 * 1000;

      if (warningTime > 0) {
        sessionTimeout = setTimeout(() => {
          setIsAlertOpen(true);
        }, warningTime);
      } else if (expirationTime < currentTime) {
        // Si el token ya expiró, checkAuthOnLoad() debería manejar el refresh o logout.
        // Quitamos el 'logout()' agresivo que estaba aquí para evitar
        // que compita con la lógica de carga inicial.
        console.warn(
          'SessionManager: Token ya expirado, confiando en checkAuthOnLoad.'
        );
      }
    } catch (error) {
      console.error(
        'Token inválido en SessionManager, cerrando sesión:',
        error
      );
      logout();
    }

    return () => {
      clearTimeout(sessionTimeout);
    };
    // El 'logout' es estable. Agregamos 'isAlertOpen' para que este efecto
    // se re-ejecute después de que el usuario presione "Continuar Sesión"
    // y se obtenga un nuevo token.
  }, [logout, isAlertOpen]);

  const handleConfirm = async () => {
    const currentRefreshToken = getRefreshToken(); // Obtener refresh_token directamente de localStorage

    if (!currentRefreshToken) {
      logout();
      return;
    }

    try {
      const newTokens = await apiRefreshToken(currentRefreshToken); // Usar apiRefreshToken
      setAuthTokens(newTokens); // Guardar nuevos tokens directamente en localStorage
      setIsAlertOpen(false); // Cierra la alerta y dispara el useEffect anterior
    } catch {
      logout();
    }
  };

  const handleLogout = () => {
    logout(); // Solo llamamos a logout
    setIsAlertOpen(false);
    // Ya no necesitamos router.push('/login'), ProtectedRoute lo hará.
  };

  return (
    <SessionExpirationAlert
      isOpen={isAlertOpen}
      onConfirm={handleConfirm}
      onLogout={handleLogout}
    />
  );
}
