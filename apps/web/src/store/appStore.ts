import { create } from "zustand";

interface AppState {
  purityDays: number;
  setPurityDays: (days: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  purityDays: 0,
  setPurityDays: (days) => set({ purityDays: days }),
}));
