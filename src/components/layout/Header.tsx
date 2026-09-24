"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiSearch, FiMapPin, FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useCartStore } from "@/stores/cartStore";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartStore((state) => state.cartCount) || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#06101e] border-b border-[#0f1d2e] text-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 h-20 md:h-[88px] flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#78e000] flex items-center justify-center shadow-lg shadow-[#78e000]/25 transition-transform group-hover:scale-105">
            <span className="text-black font-black italic text-xl sm:text-2xl leading-none">D</span>
          </div>
          <span className="text-xl sm:text-2xl font-black tracking-wider text-white">
            DINOSPORTS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9 text-[13px] xl:text-[14px] font-extrabold tracking-wider">
          <Link href="/hang-moi" className="text-[#38bdf8] hover:text-[#78e000] transition-colors py-2">
            HÀNG MỚI
          </Link>
          <Link href="/shop?category=men" className="text-white hover:text-[#78e000] transition-colors py-2">
            GIÀY NAM
          </Link>
          <Link href="/shop?category=women" className="text-white hover:text-[#78e000] transition-colors py-2">
            GIÀY NỮ
          </Link>
          <Link href="/about-us" className="text-white hover:text-[#78e000] transition-colors py-2">
            GIỚI THIỆU
          </Link>
          <Link href="/news" className="text-white hover:text-[#78e000] transition-colors py-2">
            TIN TỨC
          </Link>
          <Link href="/contact" className="text-white hover:text-[#78e000] transition-colors py-2">
            LIÊN HỆ
          </Link>
        </nav>

        {/* Right Actions: Search, MapPin, Cart, Vietnam Flag */}
        <div className="flex items-center gap-4 sm:gap-6 text-gray-200">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="hover:text-[#78e000] transition-colors p-1.5"
            title="Tìm kiếm"
          >
            <FiSearch className="w-5 h-5" />
          </button>

          {/* Showroom Map Pin */}
          <Link
            href="#showroom-section"
            className="hover:text-[#78e000] transition-colors p-1.5 hidden sm:block"
            title="Cửa hàng"
          >
            <FiMapPin className="w-5 h-5" />
          </Link>

          {/* Shopping Cart */}
          <Link
            href="/cart"
            className="hover:text-[#78e000] transition-colors p-1.5 relative"
            title="Giỏ hàng"
          >
            <FiShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#78e000] text-black text-[10px] font-black w-4 h-4 flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Vietnam Flag Badge */}
          <div className="flex items-center pl-1 select-none">
            <div
              className="w-6 h-4 bg-[#da251d] relative flex items-center justify-center shadow overflow-hidden"
              title="Việt Nam"
            >
              <span className="text-yellow-400 text-xs leading-none">★</span>
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-gray-300 hover:text-white p-1.5 ml-1"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      {isSearchOpen && (
        <div className="bg-[#0b141f] border-b border-gray-800 py-4 px-4 transition-all">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm giày thể thao, thương hiệu, mã sản phẩm..."
                className="w-full bg-[#111a24] text-white pl-12 pr-4 py-3 rounded-none border border-gray-700 focus:outline-none focus:border-[#78e000] text-sm"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-[#78e000] hover:bg-[#84cc16] text-black font-bold px-6 py-3 rounded-none text-sm transition-colors"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#060b11] border-b border-gray-800 px-6 py-6 space-y-4">
          <Link
            href="/hang-moi"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-white hover:text-[#78e000]"
          >
            HÀNG MỚI
          </Link>
          <Link
            href="/shop?category=men"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-white hover:text-[#78e000]"
          >
            GIÀY NAM
          </Link>
          <Link
            href="/shop?category=women"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-white hover:text-[#78e000]"
          >
            GIÀY NỮ
          </Link>
          <Link
            href="/about-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-white hover:text-[#78e000]"
          >
            GIỚI THIỆU
          </Link>
          <Link
            href="/news"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-white hover:text-[#78e000]"
          >
            TIN TỨC
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-white hover:text-[#78e000]"
          >
            LIÊN HỆ
          </Link>
        </div>
      )}
    </header>
  );
}
