'use client';

import React from 'react';
import Image from 'next/image';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { mainNav } from '@/config/sidebar-nav';
import { cn } from '@/lib/utils';
import { FiLogOut, FiInfo } from 'react-icons/fi';
import { GuardedButton } from './GuardedButton';

// --- SHADCN UI COMPONENT ---
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function AppSidebar() {
  // Obtenemos TODO el estado de nuestro store de Zustand
  const {
    isDesktopCollapsed,
    toggleDesktopCollapse,
    isMobileMenuOpen,
    toggleMobileMenu,
  } = useSidebarStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const pathname = usePathname();

  const sidebarContent = (
    <>
      {/* El Header ahora contiene el Trigger y el Logo */}
      <SidebarHeader className="h-16 flex items-center justify-between px-4 py-0 border-b">
        <div
          className={cn(
            'flex items-center w-full h-full justify-center md:justify-between',
            isDesktopCollapsed && '!justify-center'
          )}
        >
          {/* Botón de Trigger a la izquierda del logo */}
          <SidebarTrigger
            onClick={toggleDesktopCollapse}
            className="hidden md:flex"
          />
          <Image
            src="/logo de universitas legal.svg"
            alt="Universitas Legal Logo"
            width={120}
            height={48}
            priority={true}
            className={cn(
              'mr-8 object-contain',
              isDesktopCollapsed && 'hidden'
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup className="flex flex-col space-y-1">
          <TooltipProvider key={isDesktopCollapsed ? 'collapsed' : 'expanded'}>
            {mainNav.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <GuardedButton
                    href={item.href}
                    variant="ghost"
                    className={cn(
                      'flex w-full items-center justify-start gap-3 rounded-lg py-2 pl-3 pr-4 transition-colors text-sidebar-foreground hover:bg-sidebar-hover-bg bg-sidebar',
                      isDesktopCollapsed && 'justify-center p-2',
                      pathname === item.href && 'bg-sidebar-primary font-bold' // <-- Estilo activo
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span
                      className={cn(
                        'grow text-left',
                        isDesktopCollapsed && 'hidden'
                      )}
                    >
                      {item.title}
                    </span>
                  </GuardedButton>
                </TooltipTrigger>
                {isDesktopCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.title}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        {/* Separando los items de acción de la información de usuario */}
        <div className="flex flex-col gap-1 space-y-1 ">
          <GuardedButton
            href="/dashboard/acerca-de"
            variant="ghost"
            className={cn(
              'flex w-full bg-sidebar items-center justify-start gap-3 rounded-lg py-2 pl-3 pr-4 text-sidebar-foreground hover:bg-sidebar-hover-bg',
              isDesktopCollapsed && 'justify-center p-2',
              pathname === '/dashboard/acerca-de' &&
                'bg-sidebar-primary font-bold' // <-- Estilo activo
            )}
          >
            <FiInfo className="h-5 w-5 shrink-0" />
            <span
              className={cn('grow text-left', isDesktopCollapsed && 'hidden')}
            >
              Acerca de
            </span>
          </GuardedButton>
          <Button
            variant="ghost"
            className={cn(
              'flex w-full items-center justify-start gap-3 rounded-lg py-2 pl-3 pr-4 text-destructive hover:bg-destructive/10',
              isDesktopCollapsed && 'justify-center p-2'
            )}
          >
            <FiLogOut className="h-5 w-5 shrink-0" />
            <span
              className={cn('grow text-left', isDesktopCollapsed && 'hidden')}
            >
              Cerrar Sesión
            </span>
          </Button>
        </div>

        <div className="mt-0 w-full border-t border-border pt-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'h-auto w-full justify-start gap-3 px-3 py-2',
                  isDesktopCollapsed && 'justify-center p-2'
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'flex flex-col items-start',
                    isDesktopCollapsed && 'hidden'
                  )}
                >
                  <span className="text-sm font-medium whitespace-nowrap">
                    Shadcn
                  </span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    m@shadcn.com
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Shadcn</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    m@shadcn.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </>
  );

  if (!isDesktop) {
    return (
      <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
        <SheetContent
          side="left"
          className="w-72 p-0 border-r-0 flex flex-col bg-sidebar text-sidebar-foreground"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navegación Principal</SheetTitle>
            <SheetDescription>
              Menú para navegar entre las secciones de la aplicación.
            </SheetDescription>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // El componente Sidebar principal es un contenedor. Su estado de colapso
  // es manejado por clases condicionales controladas por nuestro store.
  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        'hidden md:flex border-r bg-sidebar text-sidebar-foreground', // <-- Colores aplicados aquí
        isDesktopCollapsed ? 'w-20' : 'w-64',
        'transition-all duration-300'
      )}
    >
      {sidebarContent}
    </Sidebar>
  );
}
