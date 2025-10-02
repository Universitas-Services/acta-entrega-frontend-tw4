'use client';

import React from 'react';
import Image from 'next/image';
import { useHeader } from '@/context/HeaderContext';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from './ui/button';
import { GuardedButton } from './GuardedButton';
import { GiHamburgerMenu } from 'react-icons/gi';

export default function Header() {
  const { title } = useHeader();
  // Obtenemos todo lo que necesitamos de nuestro store
  const { toggleMobileMenu, isDesktopCollapsed } = useSidebarStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <header className="relative flex h-15 shrink-0 items-center justify-between bg-background px-4 md:px-6">
      <div className="flex items-center">
        {/* Botón de hamburguesa para MÓVIL */}
        <Button
          variant="ghost"
          onClick={toggleMobileMenu}
          className="md:hidden" // Ocultar en escritorio
        >
          <GiHamburgerMenu className="h-6 w-6" />
        </Button>

        {/* El logo solo aparece si el sidebar está COLAPSADO */}
        {isDesktop && isDesktopCollapsed && (
          <GuardedButton
            href="/dashboard"
            variant="ghost"
            className="flex items-center bg-background hover:bg-background"
          >
            <Image
              src="/logo de universitas legal.svg"
              alt="Universitas Legal Logo"
              width={120}
              height={48}
              className="object-contain"
            />
          </GuardedButton>
        )}
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* El color del título ahora viene de text-foreground, que es nuestro azul principal */}
        <h1 className="text-center text-xl font-semibold text-foreground sm:text-2xl md:text-3xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center" />
    </header>
  );
}
