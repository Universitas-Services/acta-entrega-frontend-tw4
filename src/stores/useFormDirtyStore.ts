import { create } from 'zustand';

interface FormDirtyState {
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}

export const useFormDirtyStore = create<FormDirtyState>((set) => ({
  isDirty: false,
  setIsDirty: (isDirty: boolean) => set({ isDirty }),
}));
