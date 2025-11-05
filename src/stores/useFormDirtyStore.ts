import { create } from 'zustand';

interface FormDirtyState {
  isDirty: boolean;
  isProForm: boolean;
  hasReachedStep3: boolean;
  onSave: () => Promise<void>;
  setFormState: (data: Partial<FormDirtyState>) => void;
  clearFormState: () => void;
}

const initialState = {
  isDirty: false,
  isProForm: false,
  hasReachedStep3: false,
  onSave: () => Promise.resolve(), // Una función no-op por defecto
};

export const useFormDirtyStore = create<FormDirtyState>((set) => ({
  ...initialState,
  setFormState: (data) => set((state) => ({ ...state, ...data })),
  clearFormState: () => set(initialState),
}));
