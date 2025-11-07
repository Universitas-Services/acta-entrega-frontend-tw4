'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import { refreshToken } from '@/services/authService';
import { SessionExpirationAlert } from './SessionExpirationAlert';

export function SessionManager() {
  const { access_token, refresh_token, setTokens, logout } = useAuthStore(
    (state) => ({
      access_token: state.access_token,
      refresh_token: state.refresh_token,
      setTokens: state.setTokens,
      logout: state.logout,
    })
  );

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    // Si no hay token, no hacemos nada.
    if (!access_token) {
      return;
    }

    let sessionTimeout: NodeJS.Timeout;

    try {
      const decodedToken: { exp: number } = jwtDecode(access_token);
      const expirationTime = decodedToken.exp * 1000; // en milisegundos
      const currentTime = Date.now();

      // El aviso se mostrará 5 minutos antes de que expire la sesión.
      const warningTime = expirationTime - currentTime - 5 * 60 * 1000;

      if (warningTime > 0) {
        // Programamos el aviso para que aparezca en el futuro.
        sessionTimeout = setTimeout(() => {
          setIsAlertOpen(true);
        }, warningTime);
      } else {
        // Si el token ya expiró o está a menos de 5 minutos de hacerlo, cerramos la sesión.
        logout();
      }
    } catch (error) {
      console.error('Token inválido, cerrando sesión:', error);
      logout();
    }

    // Esta función de limpieza es la clave.
    // Se ejecuta cada vez que el 'token' cambia, ANTES de volver a ejecutar el efecto.
    // Esto asegura que el temporizador antiguo siempre se destruya.
    return () => {
      clearTimeout(sessionTimeout);
    };
  }, [access_token, logout]); // La dependencia [token] asegura que esto se re-ejecute.

  const handleConfirm = async () => {
    // Si no tenemos un refresh token, no podemos hacer nada
    if (!refresh_token) {
      logout();
      return;
    }

    try {
      // 1. Llamamos a nuestra función de servicio
      const newTokens = await refreshToken(refresh_token);

      // 2. Usamos 'setTokens' para guardar el nuevo par de tokens
      setTokens(newTokens);

      // 3. Cerramos la alerta
      setIsAlertOpen(false);
    } catch {
      // Si el refresh token falla, deslogueamos
      logout();
    }
  };

  const handleLogout = () => {
    logout();
    setIsAlertOpen(false);
  };

  return (
    <SessionExpirationAlert
      isOpen={isAlertOpen}
      onConfirm={handleConfirm}
      onLogout={handleLogout}
    />
  );
}
