import { create } from "zustand";

export const useUIStore = create((set) => ({
  notFoundText: "",
  globalLoading: false,
  tableLoading: false,
  setNotFoundText: (text) => set({ notFoundText: text }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  setTableLoading: (loading) => set({ tableLoading: loading }),
}));
