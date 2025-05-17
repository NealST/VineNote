// manage the selected folder store

import { create } from 'zustand';
import type { IFolderItem } from '../types';

export interface IFolderState {
  folder: IFolderItem | null;
  setFolder: (newFolder: IFolderItem | null) => void;
}

export const useSelectedFolder = create<IFolderState>(set => ({
  folder: {
    name: '',
    type: 'folder',
    path: '',
  },
  setFolder: (newFolder: IFolderItem | null) => {
    set({ folder: newFolder });
  },
}));
