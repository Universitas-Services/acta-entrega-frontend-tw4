'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { FirstLoginPopup } from '@/components/FirstLoginPopup';

export function PopupManager() {
  // Este componente "escucha" el estado de autenticación
  const { isFirstLogin } = useAuthStore();

  // Si es el primer inicio de sesión, renderiza el popup.
  // Si no, no renderiza nada.
  return <>{isFirstLogin && <FirstLoginPopup isOpen={isFirstLogin} />}</>;
}
