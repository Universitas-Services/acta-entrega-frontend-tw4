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
  const { toggleMobileMenu, isDesktopCollapsed } = useSidebarStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    // ▼▼▼ MODIFICACIÓN 1: Quitamos 'relative' y 'justify-between' ▼▼▼
    <header className="flex min-h-16 shrink-0 items-center bg-background px-4 md:px-6">
      {/* --- Columna Izquierda --- */}
      <div className="flex w-1/4 justify-start">
        <Button
          variant="ghost"
          onClick={toggleMobileMenu}
          className="md:hidden"
        >
          <GiHamburgerMenu className="h-6 w-6" />
        </Button>

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

      {/* ▼▼▼ MODIFICACIÓN 2: Título en una columna flexible ▼▼▼ */}
      <div className="flex-1 min-w-0">
        <h1 className="text-center text-xl font-semibold text-foreground sm:text-2xl md:text-2xl">
          {title}
        </h1>
      </div>

      {/* --- Columna Derecha (para equilibrio) --- */}
      <div className="w-1/4" />
    </header>
  );
}
