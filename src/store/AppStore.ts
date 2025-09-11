import { create } from "zustand";

interface AppState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // User
  userName: string;
  userImage: string;
  setUser: (name: string, image: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar state
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // User state
  userName: "",
  userImage: "",
  setUser: (name, image) => set({ userName: name, userImage: image }),
}));
