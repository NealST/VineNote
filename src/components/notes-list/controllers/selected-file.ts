// manage article select state

import { create } from 'zustand';
import type { IArticleItem } from '../types';

export interface IFileState {
  selectedFile: IArticleItem | null;
  setSelectedFile: (newFile: IArticleItem | null) => void;
}

export const useSelectedFile = create<IFileState>(set => ({
  selectedFile: {} as IArticleItem,
  setSelectedFile: (newFile: IArticleItem | null) => {
    set({selectedFile: newFile});
  },
}));
