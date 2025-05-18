import { create } from "zustand";

export interface INavState {
  selectedNav: string;
  setSelectedNav: (newId: string) => void;
}

export const useSelectedNav = create<INavState>((set) => ({
  selectedNav: 'notes',
  setSelectedNav: (newId: string) => {
    set({ selectedNav: newId });
  },
}));
