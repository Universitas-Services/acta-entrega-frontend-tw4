'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { FirstLoginPopup } from '@/components/FirstLoginPopup';

export function PopupManager() {
  // 👇 [CORREGIDO] Obtenemos el estado Y la función para cambiarlo
  // Usamos 'showFirstLoginPopup' (el nombre real) en lugar de 'isFirstLogin'
  const { showFirstLoginPopup, setShowFirstLoginPopup } = useAuthStore(
    (state) => ({
      showFirstLoginPopup: state.showFirstLoginPopup,
      setShowFirstLoginPopup: state.setShowFirstLoginPopup,
    })
  );

  return (
    <>
      {showFirstLoginPopup && (
        <FirstLoginPopup
          isOpen={showFirstLoginPopup}
          // 👇 [CORREGIDO] Pasamos la prop 'onOpenChange' que faltaba
          onOpenChange={setShowFirstLoginPopup}
        />
      )}
    </>
  );
}
