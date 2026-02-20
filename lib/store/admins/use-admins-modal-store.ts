import { AdminModalState } from "@/lib/types";
import { create } from "zustand";

interface AdminsModalStore {
  adminModal: AdminModalState | null;
  openAdminModal: (admin: AdminModalState) => void;
  closeAdminModal: () => void;
}

export const useAdminModalStore = create<AdminsModalStore>((set) => ({
  adminModal: null,
  openAdminModal: (adminModal) => {
    set({ adminModal });
  },
  closeAdminModal: () => set({ adminModal: null }),
}));
