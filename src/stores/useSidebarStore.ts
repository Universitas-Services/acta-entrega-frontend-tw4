// src/stores/useSidebarStore.ts
import { create } from 'zustand';

interface SidebarState {
  isMobileMenuOpen: boolean;
  isDesktopCollapsed: boolean; // <-- ESTADO PARA ESCRITORIO
  toggleMobileMenu: () => void;
  toggleDesktopCollapse: () => void; // <-- ACCIÓN PARA ESCRITORIO
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isMobileMenuOpen: false,
  isDesktopCollapsed: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleDesktopCollapse: () =>
    set((state) => ({ isDesktopCollapsed: !state.isDesktopCollapsed })),
}));
