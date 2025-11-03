'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/stores/useAuthStore';
import { useModalStore } from '@/stores/useModalStore';
import { logoutUser } from '@/services/authService';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { usePathname, useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { NavItem, NavSubItem, proNav } from '@/config/sidebar-nav';
import { cn, getInitials } from '@/lib/utils';
import { FiInfo } from 'react-icons/fi';
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
} from 'react-icons/fa';
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
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { BsArrowBarLeft, BsPerson } from 'react-icons/bs';

export function SidebarPro() {
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
  const [openCollapsible, setOpenCollapsible] = useState<string>('');
  const [openPanelDropdown, setOpenPanelDropdown] = useState<string>('');

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
    setOpenPanelDropdown('');
  };

  // Efecto para abrir el Collapsible si estás en una sub-página
  React.useEffect(() => {
    for (const item of proNav) {
      if (item.subItems) {
        if (item.subItems.some((sub) => pathname === sub.href)) {
          setOpenCollapsible(item.id); // Abre el item padre
          return;
        }
      }
    }
  }, [pathname]);

  // --- Componente de Botón de Navegación reutilizable ---
  // Esto simplifica la lógica de renderizado
  const NavButton = ({
    item,
    className,
  }: {
    item: NavItem;
    className?: string;
  }) => {
    const Icon = item.icon;
    return (
      <Tooltip key={item.id} delayDuration={0}>
        <TooltipTrigger asChild>
          <GuardedButton
            href={item.href}
            onClick={handleNavigation}
            variant="ghost"
            className={cn(
              'flex items-center gap-3 transition-colors cursor-pointer',
              'overflow-hidden transition-all duration-300',
              'text-primary-foreground',
              'hover:bg-sidebar-hover-bg',
              isDesktopCollapsed
                ? 'justify-center rounded-none'
                : 'w-full justify-start py-2 px-3 rounded-none',
              pathname === item.href &&
                'bg-sidebar-primary text-sidebar-foreground font-bold',
              className // Permite pasar clases extra
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span
              className={cn(
                'grow text-left',
                'whitespace-nowrap truncate', // --- Previene salto de línea
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
    );
  };

  // --- Componente de Sub-Botón de Navegación reutilizable ---
  const SubNavButton = ({ item }: { item: NavSubItem }) => {
    return (
      <GuardedButton
        href={item.href}
        onClick={handleNavigation}
        variant="ghost"
        className={cn(
          'w-full justify-start rounded-none py-2 cursor-pointer',
          'text-primary-foreground',
          'hover:bg-sidebar-hover-bg',
          // --- Estilo de sub-item ---
          'pr-3', // Indentación
          pathname === item.href &&
            'bg-sidebar-primary text-sidebar-foreground font-bold'
        )}
      >
        {/* Sin icono, solo texto */}
        <span className="grow text-left whitespace-nowrap">{item.title}</span>
      </GuardedButton>
    );
  };

  const sidebarContent = (
    <>
      <TooltipProvider key={isDesktopCollapsed ? 'collapsed' : 'expanded'}>
        <SidebarHeader className="h-16 flex items-center justify-between px-4 py-0">
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
              src="/logo de universitas legal blanco.png"
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
          {/* --- Lógica de Renderizado Principal --- */}
          <SidebarGroup className="flex flex-col space-y-1 py-2 px-0">
            {proNav.map((item) =>
              item.subItems ? (
                // --- Si tiene sub-items, decidimos entre Dropdown o Collapsible ---
                isDesktopCollapsed ? (
                  // --- Modo Colapsado -> <DropdownMenu /> ---
                  <Tooltip key={item.id} delayDuration={0}>
                    <DropdownMenu
                      key={item.id}
                      open={openPanelDropdown === item.id}
                      onOpenChange={(isOpen) =>
                        setOpenPanelDropdown(isOpen ? item.id : '')
                      }
                    >
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          {/* Botón solo con icono */}
                          <GuardedButton
                            href="#" // No navega
                            variant="ghost"
                            className={cn(
                              'flex items-center gap-3 transition-colors cursor-pointer overflow-hidden justify-center rounded-none',
                              'text-primary-foreground',
                              'hover:bg-sidebar-hover-bg',
                              openCollapsible === item.id && 'font-bold'
                            )}
                          >
                            <item.icon className="h-5 w-5 shrink-0" />
                          </GuardedButton>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuContent
                          side="right"
                          align="start"
                          sideOffset={5}
                          className="w-40 bg-primary text-primary-foreground border-primary-foreground/20 space-y-1"
                        >
                          <DropdownMenuLabel className="font-semibold">
                            {item.title}
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-primary-foreground/20" />
                          {item.subItems.map((subItem) => (
                            <DropdownMenuItem
                              asChild
                              key={subItem.id}
                              className="p-0"
                            >
                              <SubNavButton item={subItem} />
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenuPortal>
                    </DropdownMenu>

                    <TooltipContent side="right">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  // ---  Modo Expandido ---
                  <Collapsible
                    key={item.id}
                    open={openCollapsible === item.id}
                    onOpenChange={(isOpen) =>
                      setOpenCollapsible(isOpen ? item.id : '')
                    }
                    className="w-full"
                  >
                    <CollapsibleTrigger asChild>
                      {/* Botón con texto y flecha */}
                      <GuardedButton
                        href="#" // No navega
                        variant="ghost"
                        className={cn(
                          'flex items-center gap-3 transition-colors cursor-pointer overflow-hidden w-full justify-between py-2 px-3 rounded-none',
                          'text-primary-foreground',
                          'hover:bg-sidebar-hover-bg', // --- Sin 'hover:underline' ---
                          openCollapsible === item.id && ''
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="grow text-left whitespace-nowrap">
                            {item.title}
                          </span>
                        </div>
                        {/* --- Flecha fluida --- */}
                        <FaChevronDown
                          className={cn(
                            'h-4 w-4 shrink-0 transition-transform duration-200',
                            openCollapsible === item.id && 'rotate-180'
                          )}
                        />
                      </GuardedButton>
                    </CollapsibleTrigger>

                    <CollapsibleContent
                      className={cn(
                        'text-sm bg-blue-900/50', // Base
                        isDesktopCollapsed && 'hidden'
                      )}
                    >
                      {/* --- Estilo de sub-items con línea --- */}
                      <div className="ml-5 pl-4 border-l border-primary-foreground/30 space-y-1 py-1">
                        {item.subItems.map((subItem) => (
                          <SubNavButton item={subItem} key={subItem.id} />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )
              ) : (
                // --- Si NO tiene sub-items, renderiza un botón normal ---
                <NavButton item={item} key={item.id} />
              )
            )}
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2 px-0">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <NavButton
                item={{
                  id: 'pro-acerca-de',
                  title: 'Acerca de',
                  href: '/dashboard/acerca-de',
                  icon: FiInfo,
                }}
              />
            </TooltipTrigger>
            {isDesktopCollapsed && (
              <TooltipContent side="right">
                <p>Acerca de</p>
              </TooltipContent>
            )}
          </Tooltip>

          <div className="mt-0 w-full pt-2 px-2">
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
                        isDesktopCollapsed &&
                          'w-10 h-10 p-0 hover:bg-transparent',
                        isDropdownOpen &&
                          !isDesktopCollapsed &&
                          'bg-sidebar-primary text-sidebar-foreground'
                      )}
                    >
                      <div className="flex flex-1 items-center gap-3 min-w-0">
                        <Avatar
                          className={cn(
                            'h-8 w-8 transition-all duration-100 ease-in-out',
                            isDesktopCollapsed &&
                              (isDropdownOpen
                                ? 'rounded-lg bg-avatar-pro'
                                : 'hover:bg-avatar-pro hover:rounded-lg')
                          )}
                        >
                          <AvatarImage alt={user?.name || 'Usuario'} />
                          <AvatarFallback className="bg-avatar-pro text-foreground font-bold">
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
                          <span className="text-xs  whitespace-nowrap truncate w-full">
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

                <DropdownMenuContent
                  className="w-56 bg-dropdownperfil-pro"
                  align="end"
                  forceMount
                  side={isDesktop ? 'right' : 'top'}
                  sideOffset={isDesktop ? 10 : 5}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ">
                        <AvatarImage alt={user?.name || 'Usuario'} />
                        <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                          {user ? getInitials(user.name, user.apellido) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 min-w-0">
                        <p className="text-sm font-medium leading-none">
                          {user
                            ? `${user.name} ${user.apellido || ''}`.trim()
                            : 'Usuario'}
                        </p>
                        <p className="text-xs truncate w-full">
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
                      href="/dashboard/perfil"
                      onClick={handleNavigation}
                      variant="ghost"
                      className="hover:bg-white w-full h-full justify-start px-2 py-1.5 text-sm font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <BsPerson className="mr-2 h-4 w-4 text-foreground" />
                      <span className="text-foreground">Perfil</span>
                    </GuardedButton>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <BsArrowBarLeft className="ml-1 mr-2 h-4 w-4 text-destructive" />
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
          className="w-72 p-0 border-r-0 flex flex-col bg-primary text-primary-foreground"
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
      className={cn(
        'hidden md:flex border-none',
        '[&_[data-slot="sidebar-inner"]]:bg-primary [&_[data-slot="sidebar-inner"]]:text-primary-foreground',
        isDesktopCollapsed ? 'w-20' : 'w-64',
        'transition-all duration-300'
      )}
    >
      {sidebarContent}
    </Sidebar>
  );
}
