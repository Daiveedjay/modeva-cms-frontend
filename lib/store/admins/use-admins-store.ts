interface Admin {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "Active" | "Suspended";
  lastLogin: string;
  joinedDate: string;
}
import { admins as initialAdmins } from "@/lib/constants";
import { create } from "zustand";

interface AdminState {
  admins: Admin[];
  setAdmins: (admin: Admin) => void;
  updateAdminStatus: (id: string, status: Admin["status"]) => void;
}

export const useAdminsStore = create<AdminState>((set) => ({
  admins: initialAdmins, // start empty or from initial data

  setAdmins: (admin) =>
    set((state) => ({
      admins: [...state.admins, admin],
    })),

  updateAdminStatus: (id, status) => {
    set((state) => ({
      admins: state.admins.map((admin) =>
        admin.id === id ? { ...admin, status } : admin,
      ),
    }));
  },
}));
