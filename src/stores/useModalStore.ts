import { create } from 'zustand';
import { ReactNode } from 'react';

export type ModalType =
  | 'logoutConfirmation'
  | 'userProfileOptions'
  | 'sessionExpiration'
  | 'unsavedChanges';

interface ModalPayload {
  title: string;
  description?: React.ReactNode;
  content?: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ModalStore {
  type: ModalType | null;
  payload: Partial<ModalPayload>;
  isOpen: boolean;
  open: (type: ModalType, payload: Partial<ModalPayload>) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  type: null,
  payload: {},
  isOpen: false,
  open: (type, payload) => set({ isOpen: true, type, payload }),
  close: () => set({ isOpen: false, type: null, payload: {} }),
}));
