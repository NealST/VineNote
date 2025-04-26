import { create } from 'zustand';

export interface IFocusState {
  isFocusMode: boolean;
  setFocusMode: (focusMode: boolean) => void;
};

const useFocusMode = create<IFocusState>(set => {
  return {
    isFocusMode: false,
    setFocusMode: (focusMode: boolean) => {
      set({isFocusMode: focusMode});
    }
  }
});

export default useFocusMode;
