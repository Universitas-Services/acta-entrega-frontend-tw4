'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { useModalStore } from '@/stores/useModalStore';
import { logoutUser } from '@/services/authService';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { mainNav } from '@/config/sidebar-nav';
import { cn, getInitials } from '@/lib/utils';
import { FiLogOut, FiInfo, FiUser } from 'react-icons/fi';
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
} from 'react-icons/fa';
import { GuardedButton } from './GuardedButton';
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
  const { user, logout } = useAuthStore();
  const { open: openModal } = useModalStore();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogoutClick = () => {
    openModal('logoutConfirmation', {
      title: '¿Ya te vas?',
      description: 'Estás a punto de cerrar tu sesión actual.',
      onConfirm: async () => {
        // Primero, hacemos la llamada a la API para invalidar el token en el backend
        await logoutUser();
        // Luego, limpiamos el estado local y el localStorage
        logout();
        // Finalmente, redirigimos al login
        router.push('/login');
      },
    });
  };

  const sidebarContent = (
    <>
      <SidebarHeader className="h-16 flex items-center justify-between px-4 py-0 border-b">
        <div
          className={cn(
            'flex items-center w-full h-full justify-center md:justify-between',
            isDesktopCollapsed && '!justify-center'
          )}
        >
          <SidebarTrigger
            onClick={toggleDesktopCollapse}
            className="hidden md:flex cursor-pointer"
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
                      'flex w-full items-center justify-start gap-3 rounded-lg py-2 pl-3 pr-4 transition-colors text-sidebar-foreground hover:bg-sidebar-hover-bg bg-sidebar cursor-pointer overflow-hidden',
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

      <SidebarFooter className=" p-2">
        {/* Separando los items de acción de la información de usuario */}
        <div className="flex flex-col gap-1 space-y-1 ">
          <GuardedButton
            href="/dashboard/acerca-de"
            variant="ghost"
            className={cn(
              'flex w-full bg-sidebar items-center justify-start gap-3 rounded-lg py-2 pl-3 pr-4 text-sidebar-foreground hover:bg-sidebar-hover-bg cursor-pointer overflow-hidden',
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
        </div>

        <div className="mt-0 w-full border-t border-border pt-2">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'h-auto w-full justify-between items-center px-3 py-2 cursor-pointer overflow-hidden',
                  isDesktopCollapsed && 'justify-center p-2',
                  isDropdownOpen && 'bg-sidebar-primary'
                )}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 ">
                    {/* Si hay una imagen de perfil, se mostrará aquí */}
                    <AvatarImage alt={user?.name || 'Usuario'} />
                    {/* Fallback con iniciales y nuevos estilos */}
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {user ? getInitials(user.name, user.apellido) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'flex flex-col items-start text-left',
                      isDesktopCollapsed && 'hidden'
                    )}
                  >
                    {/* Nombre y Apellido dinámicos */}
                    <span className="text-sm font-medium whitespace-nowrap">
                      {user
                        ? `${user.name} ${user.apellido || ''}`.trim()
                        : 'Usuario'}
                    </span>
                    {/* Email dinámico */}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {user?.email || ''}
                    </span>
                  </div>
                </div>

                <div className={cn('shrink-0', isDesktopCollapsed && 'hidden')}>
                  {isDesktop ? (
                    isDropdownOpen ? (
                      <FaChevronLeft size={16} />
                    ) : (
                      <FaChevronRight size={16} />
                    )
                  ) : isDropdownOpen ? (
                    <FaChevronDown size={16} />
                  ) : (
                    <FaChevronUp size={16} />
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>

            {/* Contenido del Dropdown con posición condicional */}
            <DropdownMenuContent
              className="w-56 bg-white"
              align="end"
              forceMount
              side={isDesktop ? 'right' : 'top'}
              sideOffset={isDesktop ? 10 : 5}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 ">
                    <AvatarImage alt={user?.name || 'Usuario'} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                      {user ? getInitials(user.name, user.apellido) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user
                        ? `${user.name} ${user.apellido || ''}`.trim()
                        : 'Usuario'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || ''}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer">
                <FiUser className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogoutClick}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <FiLogOut className="mr-2 h-4 w-4 text-destructive" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
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
        'hidden md:flex border-r bg-sidebar text-sidebar-foreground',
        isDesktopCollapsed ? 'w-20' : 'w-64',
        'transition-all duration-300'
      )}
    >
      {sidebarContent}
    </Sidebar>
  );
}
