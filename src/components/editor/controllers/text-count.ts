import { create } from 'zustand';

export interface ITextState {
  count: number;
  setCount: (count: number) => void;
};

const useTextCount = create<ITextState>(set => {
  return {
    count: 0,
    setCount: (count: number) => {
      set({count});
    }
  }
});

export default useTextCount;
