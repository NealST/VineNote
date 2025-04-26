// manage article select state

import { create } from 'zustand';
import type { IArticleItem } from '../types';

export interface IFileState {
  selectedFile: IArticleItem;
  setSelectedFile: (newFile: IArticleItem) => void;
}

export const useSelectedFile = create<IFileState>(set => ({
  selectedFile: {} as IArticleItem,
  setSelectedFile: (newFile: IArticleItem) => {
    set({selectedFile: newFile});
  },
}));
