import { create } from "zustand";
import { getCategories } from "../api/categoryApi";
export interface TaskbarItem {
  path: string;
  icon: any;
  label: string;
  badge?: number;
  activeCheck?: string[];
}

export interface MenuItem {
  label: string;
  path?: string;
  subMenu?: MenuItem[];
}

interface HeaderState {
  isScrolled: boolean;
  activeMenu: string | null;
  mobileOpen: boolean;
  searchOpen: boolean;
  searchQuery: string;
  user: { name?: string; id?: string } | null;
  menuItems: MenuItem[];
  categoryMenuOpen: boolean;

  setIsScrolled: (value: boolean) => void;
  setActiveMenu: (menu: string | null) => void;
  setMobileOpen: (value: boolean) => void;
  setSearchOpen: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  setUser: (user: { name?: string; id?: string } | null) => void;
  setCategoryMenuOpen: (value: boolean) => void;

  toggleSubMenu: (label: string) => void;
  closeMobileMenu: () => void;
  fetchMenuItems: () => Promise<void>;
  loadUser: () => void;
  handleScroll: () => void;
}

const baseMenu: MenuItem[] = [
  { label: "HOME", path: "/" },
  { label: "SHOP", path: "/shop" },
  { label: "CATEGORY", subMenu: [] },
  // { label: "CONTACT", path: "/contact" },
];

export const useHeaderStore = create<HeaderState>((set, get) => ({
  isScrolled: false,
  activeMenu: null,
  mobileOpen: false,
  searchOpen: false,
  searchQuery: "",
  user: null,
  menuItems: baseMenu,
  categoryMenuOpen: false,

  setIsScrolled: (value) => set({ isScrolled: value }),
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  setMobileOpen: (value) => set({ mobileOpen: value }),
  setSearchOpen: (value) => set({ searchOpen: value }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setUser: (user) => set({ user }),
  setCategoryMenuOpen: (value) => set({ categoryMenuOpen: value }),

  toggleSubMenu: (label) => {
    const { activeMenu } = get();
    set({ activeMenu: activeMenu === label ? null : label });
  },

  closeMobileMenu: () => set({ mobileOpen: false, activeMenu: null }),

  fetchMenuItems: async () => {
    try {
      const categories = await getCategories();
      const updated = get().menuItems.map((item) => {
        if (item.label === "CATEGORY") {
          return {
            ...item,
            subMenu: Array.isArray(categories)
              ? categories.map((cat: string) => ({
                  label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  path: `/shop/${cat.toLowerCase().replace(/\s+/g, "-")}`,
                }))
              : [],
          };
        }
        return item;
      });

      const shopIndex = updated.findIndex((m) => m.label === "SHOP");
      const categoryIndex = updated.findIndex((m) => m.label === "CATEGORY");

      if (
        shopIndex !== -1 &&
        categoryIndex !== -1 &&
        categoryIndex !== shopIndex + 1
      ) {
        const [categoryItem] = updated.splice(categoryIndex, 1);
        updated.splice(shopIndex + 1, 0, categoryItem);
      }

      set({ menuItems: updated });
    } catch {
      set({ menuItems: get().menuItems });
    }
  },

  loadUser: () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedUserId = localStorage.getItem("userId");

      if (storedUser) set({ user: JSON.parse(storedUser) });
      else if (storedUserId) set({ user: { id: storedUserId } });
      else set({ user: null });
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      set({ user: null });
    }
  },

  handleScroll: () => set({ isScrolled: window.scrollY > 50 }),
}));
