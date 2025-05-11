import { create } from "zustand";

export interface INavState {
  id: string;
  setId: (newId: string) => void;
}

export const useSelectedNav = create<INavState>((set) => ({
  id: 'notes',
  setId: (newId: string) => {
    set({ id: newId });
  },
}));
