// manage the selected tag store

import { create } from "zustand";
import type { ITagItem } from "../types";

export interface ITagState {
  tag: ITagItem;
  setTag: (newTag: ITagItem) => void;
}

export const useSelectedTag = create<ITagState>((set) => ({
  tag: {
    name: "",
    id: "",
    files: [],
  },
  setTag: (newTag: ITagItem) => {
    set({ tag: newTag });
  },
}));
