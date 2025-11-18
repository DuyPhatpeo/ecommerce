import { create } from "zustand";
import { getCategories } from "../api/categoryApi";

export interface MenuItem {
  label: string;
  path?: string;
  subMenu?: MenuItem[];
}

export interface TaskbarItem {
  path: string;
  icon: any;
  label: string;
  badge?: number;
  activeCheck?: string[];
}

interface HeaderState {
  // State
  isScrolled: boolean;
  activeMenu: string | null;
  mobileOpen: boolean;
  searchOpen: boolean;
  searchQuery: string;
  user: { name?: string; id?: string } | null;
  menuItems: MenuItem[];
  categoryMenuOpen: boolean;

  // Actions
  setIsScrolled: (value: boolean) => void;
  setActiveMenu: (menu: string | null) => void;
  setMobileOpen: (value: boolean) => void;
  setSearchOpen: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  setUser: (user: { name?: string; id?: string } | null) => void;
  setCategoryMenuOpen: (value: boolean) => void;

  // Methods
  toggleSubMenu: (label: string) => void;
  closeMobileMenu: () => void;
  fetchMenuItems: () => Promise<void>;
  loadUser: () => void;
  handleScroll: () => void;
}

const baseMenu: MenuItem[] = [
  { label: "HOME", path: "/" },
  { label: "SHOP", path: "/shop" },
  { label: "CONTACT", path: "/contact" },
];

export const useHeaderStore = create<HeaderState>((set, get) => ({
  // Initial State
  isScrolled: false,
  activeMenu: null,
  mobileOpen: false,
  searchOpen: false,
  searchQuery: "",
  user: null,
  menuItems: baseMenu,
  categoryMenuOpen: false,

  // Setters
  setIsScrolled: (value) => set({ isScrolled: value }),
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  setMobileOpen: (value) => set({ mobileOpen: value }),
  setSearchOpen: (value) => set({ searchOpen: value }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setUser: (user) => set({ user }),
  setCategoryMenuOpen: (value) => set({ categoryMenuOpen: value }),

  // Toggle SubMenu
  toggleSubMenu: (label) => {
    const { activeMenu } = get();
    set({ activeMenu: activeMenu === label ? null : label });
  },

  // Close Mobile Menu
  closeMobileMenu: () => {
    set({ mobileOpen: false, activeMenu: null });
  },

  // Fetch Categories & Build Menu
  fetchMenuItems: async () => {
    try {
      const categories = await getCategories();

      if (!Array.isArray(categories) || categories.length === 0) {
        set({ menuItems: baseMenu });
        return;
      }

      const categoryMenu: MenuItem = {
        label: "CATEGORY",
        subMenu: categories.map((cat: string) => ({
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          path: `/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`,
        })),
      };

      const updated = [...baseMenu];
      const shopIndex = updated.findIndex((m) => m.label === "SHOP");

      if (shopIndex !== -1) {
        updated.splice(shopIndex + 1, 0, categoryMenu);
      } else {
        updated.push(categoryMenu);
      }

      set({ menuItems: updated });
    } catch {
      set({ menuItems: baseMenu });
    }
  },

  // Load User from LocalStorage
  loadUser: () => {
    const storedUser = localStorage.getItem("user");
    const storedUserId = localStorage.getItem("userId");

    try {
      if (storedUser) {
        set({ user: JSON.parse(storedUser) });
      } else if (storedUserId) {
        set({ user: { id: storedUserId } });
      } else {
        set({ user: null });
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      set({ user: null });
    }
  },

  // Handle Scroll
  handleScroll: () => {
    set({ isScrolled: window.scrollY > 50 });
  },
}));
