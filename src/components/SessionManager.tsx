'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/lib/axios';
import { SessionExpirationAlert } from './SessionExpirationAlert';

export function SessionManager() {
  const { token, setAuth, logout } = useAuthStore();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    // Si no hay token, no hacemos nada.
    if (!token) {
      return;
    }

    let sessionTimeout: NodeJS.Timeout;

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
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
  }, [token, logout]); // La dependencia [token] asegura que esto se re-ejecute.

  const handleConfirm = async () => {
    try {
      const response = await apiClient.post('/auth/refresh-token');
      // Al llamar a setAuth, el 'token' en el store cambia,
      // lo que re-activa el useEffect de arriba, creando un nuevo temporizador.
      setAuth(response.data.token, response.data.user);
      setIsAlertOpen(false);
    } catch {
      logout();
    }
  };

  const handleCancel = () => {
    logout();
    setIsAlertOpen(false);
  };

  return (
    <SessionExpirationAlert
      isOpen={isAlertOpen}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
