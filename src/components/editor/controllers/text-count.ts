import { create } from 'zustand';

export interface ITextState {
  count: number;
  setCount: (count: number) => void;
};

export const useTextCount = create<ITextState>(set => {
  return {
    count: 0,
    setCount: (count: number) => {
      set({count});
    }
  }
});
