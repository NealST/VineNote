import { create } from "zustand";
import type { ITagItem } from "../types";

export interface ITagDataSourceState {
  dataSource: ITagItem[];
  setDataSource: (newDataSource: ITagItem[]) => void;
}

export const useTagDataSource = create<ITagDataSourceState>((set) => ({
  dataSource: [],
  setDataSource: (newDataSource: ITagItem[]) => {
    set({ dataSource: newDataSource });
  },
}));
