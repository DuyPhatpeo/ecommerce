import { useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useHeaderStore } from "../stores/headerStore";
import type { TaskbarItem } from "../stores/headerStore";
import { useCartStore } from "../stores/cartStore";

export const useHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 Zustand Stores
  const {
    isScrolled,
    activeMenu,
    mobileOpen,
    searchOpen,
    searchQuery,
    user,
    menuItems,
    categoryMenuOpen,
    setActiveMenu,
    setSearchOpen,
    setMobileOpen,
    setSearchQuery,
    setCategoryMenuOpen,
    toggleSubMenu,
    closeMobileMenu,
    fetchMenuItems,
    loadUser,
    handleScroll,
  } = useHeaderStore();

  const { cartCount, fetchCart } = useCartStore();

  // Refs
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);

  // Taskbar Items
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

  // Handle Search Submit
  const handleSearchSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchQuery.trim()) {
        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        setSearchOpen(false);
        setSearchQuery("");
      }
    },
    [searchQuery, navigate, setSearchOpen, setSearchQuery]
  );

  // Mouse Handlers
  const handleMouseEnter = useCallback(
    (label: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setActiveMenu(label);
    },
    [setActiveMenu]
  );

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 300);
  }, [setActiveMenu]);

  //   Load Categories & User on Mount
  useEffect(() => {
    fetchMenuItems();
    loadUser();
  }, [fetchMenuItems, loadUser]);

  //   Sync Cart on Route Change
  useEffect(() => {
    fetchCart();
    loadUser();
  }, [location.pathname, fetchCart, loadUser]);

  //   Scroll Detection
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  //   Focus Search Input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  //   Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        searchOpen &&
        searchBoxRef.current &&
        !searchBoxRef.current.contains(target)
      )
        setSearchOpen(false);

      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      )
        closeMobileMenu();

      if (
        categoryMenuOpen &&
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(target)
      )
        setCategoryMenuOpen(false);
    };

    if (searchOpen || mobileOpen || categoryMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [
    searchOpen,
    mobileOpen,
    categoryMenuOpen,
    setSearchOpen,
    closeMobileMenu,
    setCategoryMenuOpen,
  ]);

  //   Close Menus on Route Change
  useEffect(() => {
    closeMobileMenu();
    setCategoryMenuOpen(false);
  }, [location.pathname, closeMobileMenu, setCategoryMenuOpen]);

  return {
    isScrolled,
    activeMenu,
    mobileOpen,
    searchOpen,
    cartCount,
    searchQuery,
    user,
    menuItems,
    categoryMenuOpen,
    searchInputRef,
    searchBoxRef,
    mobileMenuRef,
    categoryMenuRef,
    setSearchOpen,
    setMobileOpen,
    setSearchQuery,
    setCategoryMenuOpen,
    handleSearchSubmit,
    handleMouseEnter,
    handleMouseLeave,
    toggleSubMenu,
    closeMobileMenu,
    taskbarItems,
    location,
    navigate,
  };
};
