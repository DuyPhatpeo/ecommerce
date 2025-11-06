import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../api/cartApi";
import { getCategories } from "../api/categoryApi";

// ==================== TYPES ====================
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

// ==================== CUSTOM HOOK ====================
export const useHeader = () => {
  // ========== STATE ==========
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ========== REFS ==========
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);

  // ========== BASE MENU ==========
  const baseMenu: MenuItem[] = useMemo(
    () => [
      { label: "HOME", path: "/" },
      { label: "SHOP", path: "/shop" },
      { label: "CONTACT", path: "/contact" },
    ],
    []
  );

  // ========== TASKBAR ITEMS ==========
  const taskbarItems: TaskbarItem[] = useMemo(
    () => [
      { path: "/", icon: "Home", label: "Home" },
      { path: "/shop", icon: "Store", label: "Shop" },
      { path: "#category", icon: "LayoutGrid", label: "Category" },
      {
        path: user ? "/account/profile" : "/login",
        icon: "User",
        label: "Account",
        activeCheck: ["/account", "/account/profile", "/login"],
      },
    ],
    [user]
  );

  // ========== HANDLERS ==========
  const fetchCartCount = useCallback(async () => {
    try {
      const cartItems = await getCart(); // 🔥 getCart() trả về CartItem[] trực tiếp
      setCartCount(Array.isArray(cartItems) ? cartItems.length : 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartCount(0);
    }
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery, navigate]
  );

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 300);
  }, []);

  const toggleSubMenu = useCallback((label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setActiveMenu(null);
  }, []);

  // ========== EFFECTS ==========
  // Fetch categories & build menu
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        if (!Array.isArray(categories) || categories.length === 0) {
          setMenuItems(baseMenu);
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

        setMenuItems(updated);
      } catch (error) {
        console.error("❌ Fetch categories failed:", error);
        setMenuItems(baseMenu);
      }
    };

    fetchCategories();
  }, [baseMenu]);

  // Initialize cart & user
  useEffect(() => {
    fetchCartCount();
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data in localStorage", error);
        localStorage.removeItem("userId");
      }
    }
  }, [fetchCartCount, location.pathname]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        searchOpen &&
        searchBoxRef.current &&
        !searchBoxRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }

      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        closeMobileMenu();
      }

      if (
        categoryMenuOpen &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(target)
      ) {
        setCategoryMenuOpen(false);
      }
    };

    if (searchOpen || mobileOpen || categoryMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen, mobileOpen, categoryMenuOpen, closeMobileMenu]);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
    setCategoryMenuOpen(false);
  }, [location.pathname, closeMobileMenu]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // ========== RETURN ==========
  return {
    // State
    isScrolled,
    activeMenu,
    mobileOpen,
    searchOpen,
    cartCount,
    searchQuery,
    user,
    menuItems,
    categoryMenuOpen,

    // Refs
    searchInputRef,
    searchBoxRef,
    mobileMenuRef,
    categoryMenuRef,

    // Setters
    setSearchOpen,
    setMobileOpen,
    setSearchQuery,
    setCategoryMenuOpen,

    // Handlers
    handleSearchSubmit,
    handleMouseEnter,
    handleMouseLeave,
    toggleSubMenu,
    closeMobileMenu,
    fetchCartCount,

    // Data
    taskbarItems,
    location,
    navigate,
  };
};
