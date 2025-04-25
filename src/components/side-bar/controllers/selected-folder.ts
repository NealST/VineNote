// manage the selected folder store

import { create } from 'zustand';
import type { IFolderItem } from '../types';

export interface IFolderState {
  folder: IFolderItem;
  setFolder: (newFolder: IFolderItem) => void;
}

export const useSelectedFolder = create<IFolderState>(set => ({
  folder: {
    name: '',
    type: 'folder',
    path: '',
  },
  setFolder: (newFolder: IFolderItem) => {
    set({ folder: newFolder });
  },
}));
