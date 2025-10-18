'use client';

import { useState, useEffect } from 'react';
import { useHeader } from '@/context/HeaderContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FiSettings, FiKey, FiTrash2 } from 'react-icons/fi';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ProfileForm } from '@/components/profile/profileForm';
import { ChangePasswordForm } from '@/components/profile/ChangePasswordForm';
import { DeleteAccountSection } from '@/components/profile/DeleteAccountSection';

type ProfileTab = 'edit' | 'password' | 'delete';

const navItems = [
  { id: 'edit', label: 'Editar perfil', icon: FiSettings },
  { id: 'password', label: 'Cambiar contraseña', icon: FiKey },
  { id: 'delete', label: 'Eliminar cuenta', icon: FiTrash2 },
];

export default function PerfilPage() {
  const { setTitle } = useHeader();
  const [activeTab, setActiveTab] = useState<ProfileTab>('edit');

  useEffect(() => {
    setTitle('Gestión de Perfil');
  }, [setTitle]);

  const renderContent = () => {
    switch (activeTab) {
      case 'edit':
        return <ProfileForm />;
      case 'password':
        return <ChangePasswordForm />;
      case 'delete':
        return <DeleteAccountSection />;
      default:
        return <ProfileForm />;
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl">Configuración de tu perfil</CardTitle>
          <CardDescription>
            Gestiona la información de tu cuenta y tu configuración de
            seguridad.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-10">
            {/* Columna Izquierda: Menú de Navegación Vertical (sin cambios) */}
            <nav className="md:col-span-1 flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setActiveTab(item.id as ProfileTab)}
                    className={cn(
                      'w-full justify-start text-left cursor-pointer',
                      'focus-visible:ring-0 focus-visible:ring-offset-0',
                      activeTab === item.id
                        ? 'bg-sidebar-primary font-semibold'
                        : 'hover:bg-sidebar-hover-bg hover:underline',
                      item.id === 'delete' &&
                        'text-destructive hover:text-destructive focus-visible:text-destructive'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* Columna Derecha: Contenido Dinámico (sin cambios) */}
            <div className="md:col-span-3">{renderContent()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
