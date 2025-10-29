// src/components/sidebar/SidebarPro.tsx
'use client';

// (Importaciones idénticas a SidebarExpress)
import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { useModalStore } from '@/stores/useModalStore';
import { logoutUser } from '@/services/authService';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { mainNav } from '@/config/sidebar-nav'; // Importamos el nav completo
import { cn, getInitials } from '@/lib/utils';
import { FiInfo, FiUser } from 'react-icons/fi';
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
} from 'react-icons/fa';
import { AiOutlineLogout } from 'react-icons/ai';
import { GuardedButton } from '../GuardedButton';
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

// Renombramos la función
export function SidebarPro() {
  // (Lógica de hooks idéntica a SidebarExpress)
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
        await logoutUser();
        logout();
        router.push('/login');
      },
    });
  };

  const handleNavigation = () => {
    if (!isDesktop) {
      toggleMobileMenu();
    }
  };

  // --- Clases de estilo personalizadas para Pro ---
  const proBgClass = 'bg-primary text-primary-foreground'; // Fondo azul, texto blanco
  const proHoverClass = 'hover:bg-blue-800'; // Hover más oscuro (ejemplo)
  const proActiveClass = 'bg-blue-700 font-bold'; // Activo más claro (ejemplo)
  const proTextColor = 'text-primary-foreground'; // Texto blanco
  const proBorderClass = 'border-blue-700'; // Borde más oscuro

  const sidebarContent = (
    <>
      <TooltipProvider key={isDesktopCollapsed ? 'collapsed' : 'expanded'}>
        <SidebarHeader
          className={cn(
            'h-16 flex items-center justify-between px-4 py-0',
            proBorderClass,
            'border-b'
          )}
        >
          <div
            className={cn(
              'flex items-center w-full h-full justify-center md:justify-between',
              isDesktopCollapsed && '!justify-center'
            )}
          >
            <SidebarTrigger
              onClick={toggleDesktopCollapse}
              className={cn('hidden md:flex cursor-pointer', proTextColor)} // Color de icono
            />
            <Image
              src="/blanco 250px.svg" // <-- CAMBIAMOS AL LOGO BLANCO
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
            {/* Filtramos para mostrar SOLO items 'pro' y los generales */}
            {mainNav
              .filter(
                (item) =>
                  item.href.includes('/pro') || // Mostramos links 'pro'
                  item.href.includes('/actas-pro') || // Mostramos links 'actas-pro'
                  item.href.includes('/consultoria') // Mostramos 'Asistente IA'
              )
              .map((item) => (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <GuardedButton
                      href={item.href}
                      onClick={handleNavigation}
                      variant="ghost"
                      className={cn(
                        'flex w-full items-center justify-start gap-3 rounded-lg py-2 pl-3 pr-4 transition-colors cursor-pointer overflow-hidden',
                        proTextColor, // Texto blanco
                        proHoverClass, // Hover oscuro
                        isDesktopCollapsed && 'justify-center p-2',
                        pathname === item.href && proActiveClass // Activo claro
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
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className=" p-2">
          <div className="flex flex-col gap-1 space-y-1 ">
            {/* (Puedes ocultar 'Acerca de' o mantenerlo si quieres) */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <GuardedButton
                  href="/dashboard/acerca-de-pro" // Asumiendo que 'acerca-de' es para todos
                  onClick={handleNavigation}
                  variant="ghost"
                  className={cn(
                    'flex w-full items-center justify-start gap-3 rounded-lg py-2 pl-3 pr-4 cursor-pointer overflow-hidden',
                    proTextColor,
                    proHoverClass,
                    isDesktopCollapsed && 'justify-center p-2',
                    pathname === '/dashboard/acerca-de' && proActiveClass
                  )}
                >
                  <FiInfo className="h-5 w-5 shrink-0" />
                  <span
                    className={cn(
                      'grow text-left',
                      isDesktopCollapsed && 'hidden'
                    )}
                  >
                    Acerca de
                  </span>
                </GuardedButton>
              </TooltipTrigger>
              {isDesktopCollapsed && (
                <TooltipContent side="right">
                  <p>Acerca de</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>

          <div className={cn('mt-0 w-full border-t pt-2', proBorderClass)}>
            <Tooltip delayDuration={0}>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        'group h-auto w-full justify-between items-center px-3 py-2 cursor-pointer transition-colors duration-200 overflow-hidden focus-none',
                        proTextColor, // Texto blanco
                        proHoverClass, // Hover oscuro
                        isDesktopCollapsed &&
                          'w-10 h-10 p-0 hover:bg-transparent',
                        isDropdownOpen && !isDesktopCollapsed && proActiveClass // Activo claro
                      )}
                    >
                      {/* ... (Lógica interna del botón de avatar idéntica) ... */}
                      <div className="flex flex-1 items-center gap-3 min-w-0">
                        <Avatar
                          className={cn(
                            'h-8 w-8 transition-all duration-100 ease-in-out',
                            isDesktopCollapsed &&
                              (isDropdownOpen
                                ? 'rounded-lg bg-white text-primary' // Invertir colores en colapsado/abierto
                                : 'hover:bg-white hover:text-primary hover:rounded-lg')
                          )}
                        >
                          <AvatarImage alt={user?.name || 'Usuario'} />
                          {/* Fallback usa colores primarios (texto blanco sobre azul) */}
                          <AvatarFallback className="bg-white text-primary font-bold">
                            {user ? getInitials(user.name, user.apellido) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            'flex flex-col items-start text-left min-w-0',
                            isDesktopCollapsed && 'hidden'
                          )}
                        >
                          <span className="text-sm font-medium whitespace-nowrap">
                            {user
                              ? `${user.name} ${user.apellido || ''}`.trim()
                              : 'Usuario'}
                          </span>
                          {/* Email (muted) ahora necesita ser un color claro */}
                          <span className="text-xs text-primary-foreground/70 whitespace-nowrap truncate w-full">
                            {user?.email || ''}
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'shrink-0',
                          isDesktopCollapsed && 'hidden'
                        )}
                      >
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
                </TooltipTrigger>

                {/* Dropdown se mantiene blanco para legibilidad */}
                <DropdownMenuContent
                  className="w-56 bg-white" // Fondo blanco estándar
                  align="end"
                  forceMount
                  side={isDesktop ? 'right' : 'top'}
                  sideOffset={isDesktop ? 10 : 5}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  {/* ... (Contenido del dropdown idéntico, se verá bien en blanco) ... */}
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ">
                        <AvatarImage alt={user?.name || 'Usuario'} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                          {user ? getInitials(user.name, user.apellido) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 min-w-0">
                        <p className="text-sm font-medium leading-none text-black">
                          {' '}
                          {/* Texto negro */}
                          {user
                            ? `${user.name} ${user.apellido || ''}`.trim()
                            : 'Usuario'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate w-full">
                          {user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer text-black/80"
                  >
                    <GuardedButton
                      href="/dashboard/perfil" // Perfil es para todos
                      onClick={handleNavigation}
                      variant="ghost"
                      className="bg-white w-full h-full justify-start px-2 py-1.5 text-sm font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <FiUser className="mr-2 h-4 w-4 text-black/80" />
                      <span>Perfil</span>
                    </GuardedButton>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <AiOutlineLogout className="mr-2 h-4 w-4 text-destructive" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isDesktopCollapsed && (
                <TooltipContent side="right">
                  <p>Perfil y ajustes</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </SidebarFooter>
      </TooltipProvider>
    </>
  );

  if (!isDesktop) {
    return (
      <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
        <SheetContent
          side="left"
          // Aplicamos clases Pro al Sheet (móvil)
          className={cn('w-72 p-0 border-r-0 flex flex-col', proBgClass)}
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

  return (
    <Sidebar
      collapsible="icon"
      // Aplicamos clases Pro al Sidebar (desktop)
      className={cn(
        'hidden md:flex border-r',
        proBgClass, // Fondo azul, texto blanco
        isDesktopCollapsed ? 'w-20' : 'w-64',
        'transition-all duration-300'
      )}
    >
      {sidebarContent}
    </Sidebar>
  );
}
