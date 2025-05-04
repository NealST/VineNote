// manage the selected rss store

import { create } from "zustand";
import type { IRssItem } from "../types";

export interface IRssState {
  rss: IRssItem;
  setRss: (newRss: IRssItem) => void;
}

export const useSelectedRss = create<IRssState>((set) => ({
  rss: {
    title: "",
    link: "",
    description: "",
  },
  setRss: (newRss: IRssItem) => {
    set({ rss: newRss });
  },
}));
