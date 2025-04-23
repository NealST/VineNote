// manage the selected folder store

import { create } from 'zustand';

export interface IFolderState {
  name: string;
  setName: (newName: string) => void;
}

export const useSelectedFolder = create<IFolderState>(set => ({
  name: '',
  setName: (newName: string) => {
    set({ name: newName });
  },
}));
