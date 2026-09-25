"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiSearch, FiShoppingBag, FiMenu, FiX, FiUser } from "react-icons/fi";
import { useCartStore } from "@/stores/cartStore";
import AuthModal from "@/components/auth/AuthModal";

interface NavItem {
  label: string;
  href: string;
  isSpecial?: boolean;
  match: (pathname: string, category: string | null) => boolean;
}

const navItems: NavItem[] = [
  {
    label: "HÀNG MỚI",
    href: "/hang-moi",
    isSpecial: true,
    match: (pathname) => pathname === "/hang-moi",
  },
  {
    label: "GIÀY NAM",
    href: "/shop?category=men",
    match: (pathname, category) => pathname === "/shop" && category?.toLowerCase() === "men",
  },
  {
    label: "GIÀY NỮ",
    href: "/shop?category=women",
    match: (pathname, category) => pathname === "/shop" && category?.toLowerCase() === "women",
  },
  {
    label: "GIỚI THIỆU",
    href: "/about-us",
    match: (pathname) => pathname === "/about-us",
  },
  {
    label: "TIN TỨC",
    href: "/news",
    match: (pathname) => pathname.startsWith("/news"),
  },
  {
    label: "LIÊN HỆ",
    href: "/contact",
    match: (pathname) => pathname === "/contact",
  },
];

function DesktopNavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9 text-[13px] xl:text-[14px] tracking-wider">
      {navItems.map((item) => {
        const isActive = item.match(pathname, category);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative py-2 transition-all duration-200 ${
              isActive
                ? "text-primary font-black"
                : item.isSpecial
                ? "text-[#38bdf8] hover:text-primary font-extrabold"
                : "text-white hover:text-primary font-extrabold"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNavLinks({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div className="space-y-2">
      {navItems.map((item) => {
        const isActive = item.match(pathname, category);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`block text-base px-3 py-2.5 rounded-none transition-all ${
              isActive
                ? "text-primary bg-primary/10 border-l-4 border-primary font-black"
                : item.isSpecial
                ? "text-[#38bdf8] hover:text-primary hover:bg-white/5 border-l-4 border-transparent font-extrabold"
                : "text-white hover:text-primary hover:bg-white/5 border-l-4 border-transparent font-bold"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartStore((state) => state.cartCount) || 0;
  const cartItems = useCartStore((state) => state.cartItems) || [];

  const isCartActive = pathname === "/cart";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      // Scroll smoothly to top of homepage
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // If there are search queries or hash, reset cleanly to "/"
      if (typeof window !== "undefined" && (window.location.search || window.location.hash)) {
        router.push("/");
      } else if (typeof window !== "undefined" && window.scrollY <= 10) {
        // If already at top, refresh data
        router.refresh();
      }

      if (mobileMenuOpen) setMobileMenuOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
    } else {
      if (mobileMenuOpen) setMobileMenuOpen(false);
      if (isSearchOpen) setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-[60] bg-dark border-b border-dark-border text-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-20 md:h-[88px] flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-3 group cursor-pointer select-none"
          title="Về đầu trang chủ DINOSPORTS"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary flex items-center justify-center shadow-lg shadow-primary/25 transition-transform group-hover:scale-105 active:scale-95">
            <span className="text-black font-black italic text-xl sm:text-2xl leading-none">D</span>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-wider text-white group-hover:text-primary transition-colors">
            DINOSPORTS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <Suspense
          fallback={
            <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9 text-[13px] xl:text-[14px] font-extrabold tracking-wider text-white">
              {navItems.map((item) => (
                <span key={item.href} className="py-2">
                  {item.label}
                </span>
              ))}
            </nav>
          }
        >
          <DesktopNavLinks />
        </Suspense>

        {/* Right Actions: Search, MapPin, Cart, Vietnam Flag */}
        <div className="flex items-center gap-4 sm:gap-6 text-gray-200">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`transition-colors p-1.5 ${
              isSearchOpen ? "text-primary" : "hover:text-primary"
            }`}
            title="Tìm kiếm"
          >
            <FiSearch className="w-5 h-5" />
          </button>


          {/* Shopping Cart */}
          <div className="relative group">
            <Link
              href="/cart"
              className={`transition-colors p-1.5 relative flex items-center ${
                isCartActive ? "text-primary" : "hover:text-primary"
              }`}
              title="Giỏ hàng"
            >
              <FiShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-primary text-black text-[10px] font-black w-4 h-4 flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mini Cart Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-80 bg-white shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 flex flex-col cursor-default">
              <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-gray-500 text-xs font-medium">Đã thêm {cartCount} sản phẩm</span>
              </div>
              
              <div className="max-h-[320px] overflow-y-auto p-4 flex flex-col gap-4">
                {cartItems.length > 0 ? (
                  cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-100 flex-shrink-0 flex items-center justify-center p-1 border border-gray-200">
                        <img 
                          src={item.images?.[0] || "/images/default_sneaker.png"} 
                          alt={item.title} 
                          className="w-full h-full object-contain"
                          onError={(e) => { e.currentTarget.src = "/images/default_sneaker.png"; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-gray-900 font-bold text-sm truncate">{item.title}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-900 font-bold text-[13px]">
                            {(item.price || 0).toLocaleString("vi-VN")}₫
                          </span>
                          <span className="text-gray-500 text-xs font-medium">SL: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500 text-sm font-medium">
                    Giỏ hàng của bạn đang trống
                  </div>
                )}
                
                {cartItems.length > 3 && (
                  <div className="text-center text-xs text-gray-500 font-medium pt-2 border-t border-gray-50">
                    Và {cartItems.length - 3} sản phẩm khác...
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-4 border-t border-gray-100 bg-white">
                  <Link 
                    href="/cart" 
                    className="block w-full text-center bg-primary hover:bg-black text-black hover:text-white font-bold py-2.5 text-xs uppercase tracking-wider transition-colors"
                  >
                    Đến giỏ hàng
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* User Account */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="transition-colors p-1.5 hover:text-primary"
            title="Đăng nhập / Đăng ký"
          >
            <FiUser className="w-5 h-5" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-white p-1.5 ml-1"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Search Bar Overlay (Covers TopBar & Header) */}
      {isSearchOpen && (
        <div className="fixed top-0 left-0 w-full h-[116px] md:h-[124px] bg-dark z-[100] shadow-2xl flex items-center transition-all animate-in slide-in-from-top-2">
          <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-8 lg:px-12 relative flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 max-w-4xl mx-auto flex items-center gap-3">
              <div className="relative flex-1">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Bạn đang tìm giày gì hôm nay?"
                  className="w-full bg-dark-card text-white pl-12 pr-4 py-3 rounded-none border border-dark-borderHover focus:outline-none focus:border-primary text-base"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="hidden sm:block bg-primary hover:bg-primary-hover text-black font-black px-8 py-3 rounded-none text-base uppercase tracking-wider transition-colors"
              >
                Tìm kiếm
              </button>
            </form>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-gray-300 hover:text-primary transition-colors p-2"
              title="Đóng tìm kiếm"
            >
              <FiX className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-dark border-b border-dark-border px-6 py-6">
          <Suspense
            fallback={
              <div className="space-y-2">
                {navItems.map((item) => (
                  <span key={item.href} className="block text-base py-2 text-white">
                    {item.label}
                  </span>
                ))}
              </div>
            }
          >
            <MobileNavLinks onNavigate={() => setMobileMenuOpen(false)} />
          </Suspense>
        </div>
      )}
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
}
