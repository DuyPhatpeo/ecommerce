"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiFilter,
  FiShoppingBag,
  FiStar,
  FiCheck,
  FiSearch,
  FiChevronDown,
  FiX,
  FiCopy,
} from "react-icons/fi";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-toastify";
import Loader from "@/components/layout/Loader";
import BrandShowcase from "@/components/home/BrandShowcase";
import FavoriteSportsSection from "@/components/home/FavoriteSportsSection";
import ServicesBanner from "@/components/home/ServicesBanner";

interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  gender: "men" | "women" | "unisex";
  price: number;
  regularPrice?: number;
  rating?: number;
  colors?: string[];
  sizes?: number[];
  img: string;
  description?: string;
  isBestSeller?: boolean;
}

const allProducts: Product[] = [
  // --- GIÀY NAM ---
  {
    id: "prod-lebron-tr1",
    title: "LeBron TR 1",
    brand: "Nike",
    category: "Bóng Rổ",
    gender: "men",
    price: 3829000,
    regularPrice: 4200000,
    rating: 5,
    colors: ["#111827", "#ffffff", "#78e000"],
    sizes: [40, 41, 42, 43, 44],
    img: "/images/hero_ultraboost.png",
    isBestSeller: true,
  },
  {
    id: "prod-nike-flex-train",
    title: "Nike Flex Train",
    brand: "Nike",
    category: "Luyện Tập",
    gender: "men",
    price: 2059000,
    regularPrice: 2600000,
    rating: 4.8,
    colors: ["#1e293b", "#f8fafc", "#2563eb"],
    sizes: [39, 40, 41, 42, 43],
    img: "/images/hero_ultraboost.png",
    isBestSeller: true,
  },
  {
    id: "prod-nike-metcon-10",
    title: "Nike Metcon 10",
    brand: "Nike",
    category: "Luyện Tập",
    gender: "men",
    price: 1959000,
    regularPrice: 2490000,
    rating: 4.9,
    colors: ["#ffffff", "#94a3b8", "#111827"],
    sizes: [40, 41, 42, 43, 44, 45],
    img: "/images/hero_ultraboost.png",
    isBestSeller: true,
  },
  {
    id: "prod-nike-free-metcon-6",
    title: "Nike Free Metcon 6",
    brand: "Nike",
    category: "Luyện Tập",
    gender: "men",
    price: 2279000,
    regularPrice: 2890000,
    rating: 4.8,
    colors: ["#2563eb", "#0f172a", "#1e3a8a"],
    sizes: [39, 40, 41, 42, 43],
    img: "/images/hero_ultraboost.png",
    isBestSeller: true,
  },
  {
    id: "prod-nike-af1-retro",
    title: "Nike Air Force 1 Retro",
    brand: "Nike",
    category: "Thời Trang",
    gender: "men",
    price: 5279000,
    regularPrice: 5800000,
    rating: 5,
    colors: ["#1e3a8a", "#0f172a", "#fef3c7"],
    sizes: [40, 41, 42, 43, 44],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-air-max-dn8",
    title: "Nike Air Max Dn8 Leather",
    brand: "Nike",
    category: "Thời Trang",
    gender: "men",
    price: 6179000,
    regularPrice: 6900000,
    rating: 5,
    colors: ["#2563eb", "#0f172a", "#78350f"],
    sizes: [41, 42, 43, 44],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-vomero-5-men",
    title: "Nike Zoom Vomero 5 Silver",
    brand: "Nike",
    category: "Chạy Bộ",
    gender: "men",
    price: 4419000,
    regularPrice: 4890000,
    rating: 4.9,
    colors: ["#94a3b8", "#ffffff", "#1e293b"],
    sizes: [40, 41, 42, 43, 44],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-ultraboost-solar",
    title: "Adidas Ultraboost Solar Yellow",
    brand: "Adidas",
    category: "Chạy Bộ",
    gender: "men",
    price: 2400000,
    regularPrice: 3200000,
    rating: 5,
    colors: ["#78e000", "#ffffff", "#000000"],
    sizes: [40, 41, 42, 43],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-asics-kayano-30-men",
    title: "ASICS Gel-Kayano 30 Platinum",
    brand: "Asics",
    category: "Chạy Bộ",
    gender: "men",
    price: 3600000,
    regularPrice: 4200000,
    rating: 5,
    colors: ["#0284c7", "#ffffff", "#111827"],
    sizes: [40, 41, 42, 43, 44],
    img: "/images/hero_ultraboost.png",
  },

  // --- GIÀY NỮ ---
  {
    id: "prod-nike-pegasus-41-women",
    title: "Nike Air Zoom Pegasus 41",
    brand: "Nike",
    category: "Chạy Bộ",
    gender: "women",
    price: 3529000,
    regularPrice: 3990000,
    rating: 5,
    colors: ["#ffffff", "#f43f5e", "#94a3b8"],
    sizes: [36, 37, 38, 39, 40],
    img: "/images/hero_ultraboost.png",
    isBestSeller: true,
  },
  {
    id: "prod-nike-invincible-3-women",
    title: "Nike Invincible 3 Cushion",
    brand: "Nike",
    category: "Chạy Bộ",
    gender: "women",
    price: 4829000,
    regularPrice: 5390000,
    rating: 4.9,
    colors: ["#ffffff", "#38bdf8", "#0f172a"],
    sizes: [36, 37, 38, 39],
    img: "/images/hero_ultraboost.png",
    isBestSeller: true,
  },
  {
    id: "prod-adidas-ultraboost-women",
    title: "Adidas Ultraboost Light Women",
    brand: "Adidas",
    category: "Chạy Bộ",
    gender: "women",
    price: 3200000,
    regularPrice: 3900000,
    rating: 4.8,
    colors: ["#ffffff", "#fbcfe8", "#111827"],
    sizes: [36, 37, 38, 39, 40],
    img: "/images/hero_ultraboost.png",
    isBestSeller: true,
  },
  {
    id: "prod-nike-af1-women",
    title: "Nike Air Force 1 '07 Shadow",
    brand: "Nike",
    category: "Thời Trang",
    gender: "women",
    price: 2929000,
    regularPrice: 3490000,
    rating: 5,
    colors: ["#ffffff", "#fef08a", "#bae6fd"],
    sizes: [36, 37, 38, 39],
    img: "/images/hero_ultraboost.png",
    isBestSeller: true,
  },
  {
    id: "prod-asics-kayano-women",
    title: "ASICS Gel-Kayano 30 Women",
    brand: "Asics",
    category: "Chạy Bộ",
    gender: "women",
    price: 3990000,
    regularPrice: 4500000,
    rating: 4.9,
    colors: ["#ffffff", "#38bdf8", "#f43f5e"],
    sizes: [36, 37, 38, 39, 40],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-metcon-9-women",
    title: "Nike Metcon 9 Training",
    brand: "Nike",
    category: "Luyện Tập",
    gender: "women",
    price: 3529000,
    regularPrice: 3990000,
    rating: 4.8,
    colors: ["#111827", "#f43f5e", "#ffffff"],
    sizes: [36, 37, 38, 39],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-puma-deviate-nitro-women",
    title: "Puma Velocity Nitro 3 Women",
    brand: "Puma",
    category: "Chạy Bộ",
    gender: "women",
    price: 2890000,
    regularPrice: 3390000,
    rating: 4.7,
    colors: ["#38bdf8", "#ffffff", "#000000"],
    sizes: [36, 37, 38, 39, 40],
    img: "/images/hero_ultraboost.png",
  },
];

const bestSellersSidebar = [
  {
    id: "prod-lebron-tr1",
    name: "Calibar TR1",
    sub: "Giày Nam",
    price: "3.829.000₫",
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-flex-train",
    name: "Nike Flex Train",
    sub: "Giày Nam",
    price: "2.059.000₫",
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-metcon-10",
    name: "Nike Metcon 20",
    sub: "Giày Nam",
    price: "1.959.000₫",
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-free-metcon-6",
    name: "Nike Free Metcon 6",
    sub: "Giày Nam",
    price: "2.279.000₫",
    img: "/images/hero_ultraboost.png",
  },
];

const availableBrands = ["Nike", "Adidas", "Puma", "Asics", "Hoka", "Under Armour"];
const availablePriceRanges = [
  { label: "Tất cả mức giá", min: 0, max: Infinity },
  { label: "Dưới 1.000.000₫", min: 0, max: 1000000 },
  { label: "Từ 1.000.000₫ - 2.000.000₫", min: 1000000, max: 2000000 },
  { label: "Từ 2.000.000₫ - 3.500.000₫", min: 2000000, max: 3500000 },
  { label: "Trên 3.500.000₫", min: 3500000, max: Infinity },
];
const availableColors = [
  { name: "Xanh dương", hex: "#2563eb" },
  { name: "Đen", hex: "#000000" },
  { name: "Trắng", hex: "#ffffff" },
  { name: "Nâu đất", hex: "#78350f" },
  { name: "Xám", hex: "#94a3b8" },
  { name: "Xanh Neon", hex: "#78e000" },
];
const availableSizes = [38, 39, 40, 41, 42, 43, 44, 45];

function ShopContent() {
  const searchParams = useSearchParams();
  const rawCategory = searchParams.get("category") || "";
  const rawBrand = searchParams.get("brand") || "";

  // Determine current active mode (men, women, or all)
  const isMen = rawCategory.toLowerCase() === "men" || rawCategory.toLowerCase() === "giày nam";
  const isWomen = rawCategory.toLowerCase() === "women" || rawCategory.toLowerCase() === "giày nữ";

  // Page title and breadcrumb label
  const pageTitle = isMen ? "Giày Nam" : isWomen ? "Giày Nữ" : "Bộ Sưu Tập Giày Thể Thao";
  const breadcrumbLabel = isMen ? "Giày Nam" : isWomen ? "Giày Nữ" : "Tất cả sản phẩm";

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    rawBrand ? [rawBrand] : []
  );
  const [selectedPriceRangeIndex, setSelectedPriceRangeIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [subTab, setSubTab] = useState<string>(isMen ? "Giày Nam" : isWomen ? "Giày Nữ" : "Tất cả");
  const [sortBy, setSortBy] = useState<string>("bestseller");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const addItemToCart = useCartStore((s) => s.addItemToCart);

  // Sync subTab with URL query when URL changes
  useEffect(() => {
    if (isMen) {
      setSubTab("Giày Nam");
    } else if (isWomen) {
      setSubTab("Giày Nữ");
    } else {
      setSubTab("Tất cả");
    }
    if (rawBrand) {
      setSelectedBrands([rawBrand]);
    }
  }, [rawCategory, rawBrand, isMen, isWomen]);

  // Handle brand toggle
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRangeIndex(0);
    setSelectedColor("");
    setSelectedSize(null);
    setSearchQuery("");
    setSubTab(isMen ? "Giày Nam" : isWomen ? "Giày Nữ" : "Tất cả");
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Gender filter from URL
        if (isMen && p.gender === "women") return false;
        if (isWomen && p.gender === "men") return false;

        // Subtab filter
        if (subTab === "Thời trang" && p.category !== "Thời Trang") return false;
        if (subTab === "Giày chạy bộ" && p.category !== "Chạy Bộ") return false;
        if (subTab === "Giày tập" && p.category !== "Luyện Tập") return false;
        if (subTab === "Giày Nam" && p.gender !== "men") return false;
        if (subTab === "Giày Nữ" && p.gender !== "women") return false;

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.some((b) => b.toLowerCase() === p.brand.toLowerCase())) {
          return false;
        }

        // Price range filter
        const priceRange = availablePriceRanges[selectedPriceRangeIndex];
        if (p.price < priceRange.min || p.price > priceRange.max) return false;

        // Color filter
        if (selectedColor && p.colors && !p.colors.includes(selectedColor)) {
          return false;
        }

        // Size filter
        if (selectedSize && p.sizes && !p.sizes.includes(selectedSize)) {
          return false;
        }

        // Search Query
        if (searchQuery.trim() && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "bestseller") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [
    isMen,
    isWomen,
    subTab,
    selectedBrands,
    selectedPriceRangeIndex,
    selectedColor,
    selectedSize,
    searchQuery,
    sortBy,
  ]);

  const handleQuickAdd = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      stock: 10,
      images: [product.img],
    });
    toast.success(`Đã thêm ${product.title} vào giỏ hàng!`);
  };

  const copyVoucher = () => {
    navigator.clipboard.writeText("DINO70");
    toast.success("Đã sao chép mã DINO70 - Giảm đến 70%!");
  };

  const formatPrice = (p: number) => {
    return p.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* 1. HERO TOP BANNER (Sneaker Shelves with Dark Overlay matching design) */}
      <div className="relative w-full h-48 sm:h-56 md:h-64 bg-[#06101e] overflow-hidden flex items-center justify-center">
        <Image
          src="/images/contact_hero_shelves.jpg"
          alt="Giày Thể Thao Chính Hãng"
          fill
          priority
          className="object-cover object-center opacity-40 brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 text-center px-4">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-300 font-medium mb-3">
            <Link href="/" className="hover:text-white transition-colors">
              Trang chủ
            </Link>
            <span>&gt;</span>
            <Link href="/shop" className="hover:text-white transition-colors">
              Giày Thể Thao
            </Link>
            <span>&gt;</span>
            <span className="text-[#78e000] font-bold">{breadcrumbLabel}</span>
          </div>

          {/* Big Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-wider">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* 2. MAIN CONTAINER (2 COLUMNS: FILTERS & PRODUCTS) */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* ========== LEFT SIDEBAR: FILTERS, VOUCHER, BESTSELLERS ========== */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-8">
            {/* Header Bộ Lọc */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-black" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                    BỘ LỌC
                  </h2>
                </div>
                {(selectedBrands.length > 0 ||
                  selectedPriceRangeIndex > 0 ||
                  selectedColor ||
                  selectedSize !== null) && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] font-bold text-[#78e000] hover:underline flex items-center gap-1"
                  >
                    <FiX className="w-3 h-3" />
                    <span>Đặt lại</span>
                  </button>
                )}
              </div>

              {/* 1. Thương hiệu */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3 cursor-pointer">
                  <span className="text-xs font-black uppercase text-gray-800 tracking-wider">
                    Thương hiệu
                  </span>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2.5">
                  {availableBrands.map((b) => {
                    const isChecked = selectedBrands.includes(b);
                    return (
                      <label
                        key={b}
                        onClick={() => toggleBrand(b)}
                        className="flex items-center gap-3 text-xs text-gray-700 font-medium cursor-pointer hover:text-black transition-colors"
                      >
                        <div
                          className={`w-4 h-4 border transition-colors flex items-center justify-center ${
                            isChecked
                              ? "bg-black border-black text-[#78e000]"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && <FiCheck className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{b}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 2. Mức giá */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3 cursor-pointer">
                  <span className="text-xs font-black uppercase text-gray-800 tracking-wider">
                    Giá
                  </span>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-2.5">
                  {availablePriceRanges.map((range, idx) => (
                    <label
                      key={range.label}
                      onClick={() => setSelectedPriceRangeIndex(idx)}
                      className="flex items-center gap-3 text-xs text-gray-700 font-medium cursor-pointer hover:text-black transition-colors"
                    >
                      <div
                        className={`w-4 h-4 border transition-colors flex items-center justify-center ${
                          selectedPriceRangeIndex === idx
                            ? "bg-black border-black text-[#78e000]"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selectedPriceRangeIndex === idx && <div className="w-1.5 h-1.5 bg-[#78e000]" />}
                      </div>
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Màu sắc */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3 cursor-pointer">
                  <span className="text-xs font-black uppercase text-gray-800 tracking-wider">
                    Màu sắc
                  </span>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {availableColors.map((c) => {
                    const isSelected = selectedColor === c.hex;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(isSelected ? "" : c.hex)}
                        className={`flex items-center gap-2 p-1.5 border text-[11px] font-bold transition-all text-left ${
                          isSelected
                            ? "border-black bg-gray-50"
                            : "border-gray-200 hover:border-gray-400 bg-white"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 border border-gray-300 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="truncate text-gray-800">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Kích cỡ */}
              <div>
                <div className="flex items-center justify-between mb-3 cursor-pointer">
                  <span className="text-xs font-black uppercase text-gray-800 tracking-wider">
                    Kích cỡ (EUR)
                  </span>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(isSelected ? null : sz)}
                        className={`h-9 border text-xs font-extrabold transition-all flex items-center justify-center ${
                          isSelected
                            ? "bg-black text-[#78e000] border-black"
                            : "bg-white text-gray-800 border-gray-200 hover:border-black"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* VOUCHER PROMO BANNER (Red Banner matching design) */}
            <div className="bg-gradient-to-b from-[#e11d48] to-[#9f1239] text-white p-6 shadow-md border border-red-700 relative overflow-hidden">
              {/* Partner Brand Logos Row */}
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider mb-4 opacity-90 border-b border-white/20 pb-3">
                <span>NIKE</span>
                <span>•</span>
                <span>ADIDAS</span>
                <span>•</span>
                <span>ASICS</span>
                <span>•</span>
                <span>PUMA</span>
              </div>

              <div className="space-y-1 mb-4">
                <p className="text-xs font-black uppercase tracking-widest text-yellow-300">
                  ƯU ĐÃI ĐỘC QUYỀN
                </p>
                <h3 className="text-2xl font-black uppercase leading-tight">
                  GIẢM ĐẾN 70%
                </h3>
                <p className="text-sm font-extrabold text-white/95">
                  VOUCHER ĐẾN 1.500.000Đ
                </p>
              </div>

              <p className="text-[11px] text-white/80 leading-relaxed mb-4">
                Áp dụng cho mọi đơn hàng giày thể thao mới mùa giải 2026.
              </p>

              <button
                onClick={copyVoucher}
                className="w-full bg-white hover:bg-yellow-300 text-black font-black text-xs py-3 px-4 flex items-center justify-center gap-2 shadow transition-colors uppercase tracking-wider"
              >
                <FiCopy className="w-3.5 h-3.5" />
                <span>Sao chép mã: DINO70</span>
              </button>
            </div>

            {/* CÁC SẢN PHẨM BÁN CHẠY (Best Sellers Sidebar matching design) */}
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider mb-4 pb-3 border-b border-gray-100">
                Các sản phẩm bán chạy
              </h3>
              <div className="space-y-4">
                {bestSellersSidebar.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.id}`}
                    className="flex items-center gap-3 group hover:bg-gray-50 p-1.5 transition-colors"
                  >
                    <div className="relative w-16 h-16 bg-[#f1f3f5] shrink-0 border border-gray-100 overflow-hidden flex items-center justify-center">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-contain p-1 group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-extrabold text-gray-900 group-hover:text-[#78e000] transition-colors truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
                      <p className="text-xs font-black text-gray-900 mt-0.5">{item.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ========== RIGHT CONTENT: SUB-TABS, SORT BAR & PRODUCT GRID ========== */}
          <main className="flex-1 min-w-0">
            {/* Top Sub-Category Tabs & Sort Selector */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200 mb-8">
              {/* Category Sub-Tabs */}
              <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-bold text-gray-600">
                {[
                  "Tất cả",
                  "Thời trang",
                  "Giày chạy bộ",
                  "Giày tập",
                  isWomen ? "Giày Nữ" : "Giày Nam",
                  "Trẻ em",
                ].map((tab) => {
                  const isActive = subTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setSubTab(tab)}
                      className={`whitespace-nowrap pb-1.5 border-b-2 transition-all font-extrabold uppercase tracking-wide ${
                        isActive
                          ? "border-[#78e000] text-black"
                          : "border-transparent text-gray-400 hover:text-black"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Sắp xếp theo:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-800 text-xs font-bold py-2 px-3 focus:outline-none focus:border-black cursor-pointer shadow-sm"
                >
                  <option value="bestseller">BÁN CHẠY NHẤT</option>
                  <option value="price-asc">GIÁ: THẤP ĐẾN CAO</option>
                  <option value="price-desc">GIÁ: CAO ĐẾN THẤP</option>
                </select>
              </div>
            </div>

            {/* Results Count & Active Filters Indicator */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-6">
              <span>
                Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm cho{" "}
                <span className="text-black font-bold uppercase">{pageTitle}</span>
              </span>

              {/* Quick Search in category */}
              <div className="relative w-56 hidden sm:block">
                <FiSearch className="absolute left-3 top-2.5 text-gray-400 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Lọc tên mẫu giày..."
                  className="w-full bg-white border border-gray-300 pl-8 pr-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* 3-COLUMN PRODUCT GRID (Matching the screenshot) */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200">
                <p className="text-sm font-bold text-gray-600 mb-4">
                  Không tìm thấy đôi giày nào phù hợp với bộ lọc đã chọn.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-[#78e000] text-black font-extrabold text-xs uppercase tracking-wider shadow hover:brightness-105"
                >
                  Đặt lại tất cả bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const hasDiscount = p.regularPrice && p.regularPrice > p.price;
                  const discountPercent = hasDiscount
                    ? Math.round(((p.regularPrice! - p.price) / p.regularPrice!) * 100)
                    : 0;

                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-gray-200 hover:border-gray-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative p-4"
                    >
                      {/* Brand & Discount Badges */}
                      <div className="flex items-center justify-between absolute top-4 left-4 right-4 z-10 pointer-events-none">
                        <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                          {p.brand}
                        </span>
                        {hasDiscount && (
                          <span className="bg-[#e11d48] text-white text-[10px] font-black px-2 py-0.5 shadow">
                            -{discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Product Image Stage (Clean, large presentation) */}
                      <Link
                        href={`/product/${p.id}`}
                        className="block relative w-full h-64 bg-[#f8f9fa] mt-3 mb-3 p-4 flex items-center justify-center overflow-hidden"
                      >
                        <Image
                          src={p.img}
                          alt={p.title}
                          fill
                          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Metadata */}
                      <div className="pt-2">
                        {/* Color Swatch Dots */}
                        <div className="flex items-center gap-1.5 mb-2">
                          {(p.colors || ["#000000", "#ffffff", "#2563eb"]).map((color, cIdx) => (
                            <span
                              key={cIdx}
                              className="w-3 h-3 border border-gray-300 inline-block shadow-sm"
                              style={{ backgroundColor: color }}
                              title="Tùy chọn màu sắc"
                            />
                          ))}
                        </div>

                        {/* Title */}
                        <Link href={`/product/${p.id}`} className="block">
                          <h3 className="font-black text-sm text-gray-900 group-hover:text-[#78e000] transition-colors truncate">
                            {p.title}
                          </h3>
                        </Link>

                        {/* Subtitle / Category */}
                        <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                          {p.gender === "men" ? "Giày Nam" : p.gender === "women" ? "Giày Nữ" : p.category}
                        </p>

                        {/* Price Row & Add Button */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-sm font-black text-gray-900">
                              {formatPrice(p.price)}
                            </p>
                            {hasDiscount && (
                              <p className="text-[11px] text-gray-400 line-through">
                                {formatPrice(p.regularPrice!)}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(p, e)}
                            className="w-9 h-9 bg-black hover:bg-[#78e000] text-white hover:text-black flex items-center justify-center shadow transition-all active:scale-95"
                            title="Thêm vào giỏ"
                          >
                            <FiShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 3. THƯƠNG HIỆU NỔI BẬT (Brand Showcase from design) */}
      <BrandShowcase />

      {/* 4. MÔN THỂ THAO YÊU THÍCH (Favorite Sports from design) */}
      <FavoriteSportsSection />

      {/* 5. DỊCH VỤ & CAM KẾT (Services Banner from design) */}
      <ServicesBanner />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ShopContent />
    </Suspense>
  );
}
