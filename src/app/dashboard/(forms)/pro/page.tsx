// src/app/dashboard/actas-pro/page.tsx
'use client';

import { useHeader } from '@/context/HeaderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function ActasProDashboardPage() {
  // Nombre actualizado
  const { setTitle } = useHeader();
  const { user } = useAuthStore();

  useEffect(() => {
    setTitle('Dashboard Pro'); // Título para el Header
  }, [setTitle]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Bienvenido al Dashboard Pro, {user?.name || 'Usuario'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Este es el panel principal para usuarios con rol <strong>Pro</strong>.
        </p>
        <p className="mt-4">
          Desde aquí podrás acceder a las funcionalidades avanzadas, como los
          formularios Pro (MA-Pro, Compliance) y el Asistente IA.
        </p>
        <p className="mt-2">
          (Rol simulado: <strong>{user?.role}</strong>)
        </p>
      </CardContent>
    </Card>
  );
}
