// hooks/useHeader.ts
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCart } from "../api/cartApi";

export const useHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{ name: string } | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Fetch cart count
  const fetchCartCount = async () => {
    try {
      const { data } = await getCart();
      setCartCount(Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  // Desktop menu hover
  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 300);
  };

  // Mobile submenu toggle
  const toggleSubMenu = (label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label));
  };

  // Initialize cart count and user
  useEffect(() => {
    fetchCartCount();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Invalid user data in localStorage");
      }
    }
  }, [location.pathname]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 120);
    }
  }, [searchOpen]);

  // Click outside to close search or mobile menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const outsideSearch =
        searchBoxRef.current && !searchBoxRef.current.contains(target);
      const outsideMobile =
        mobileMenuRef.current && !mobileMenuRef.current.contains(target);

      if (searchOpen && outsideSearch) setSearchOpen(false);
      if (mobileOpen && outsideMobile) setMobileOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen, mobileOpen]);

  return {
    // States
    isScrolled,
    activeMenu,
    mobileOpen,
    searchOpen,
    cartCount,
    searchQuery,
    user,

    // Refs
    timeoutRef,
    searchInputRef,
    searchBoxRef,
    mobileMenuRef,

    // Setters
    setActiveMenu,
    setMobileOpen,
    setSearchOpen,
    setSearchQuery,
    setUser,

    // Handlers
    handleSearchSubmit,
    handleMouseEnter,
    handleMouseLeave,
    toggleSubMenu,

    // Navigation
    location,
    navigate,
  };
};
