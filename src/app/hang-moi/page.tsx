"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-toastify";
import BrandShowcase from "@/components/home/BrandShowcase";
import FavoriteSportsSection from "@/components/home/FavoriteSportsSection";
import ServicesBanner from "@/components/home/ServicesBanner";

interface FeaturedCollection {
  id: string;
  tag: string;
  title: string;
  image: string;
  link: string;
}

const featuredCollections: FeaturedCollection[] = [
  {
    id: "col-1",
    tag: "BỘ SƯU TẬP GIÀY CHẠY BỘ ĐƯỜNG PHỐ",
    title: "RUN SUPPORTED",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    link: "/shop?category=running",
  },
  {
    id: "col-2",
    tag: "GIÀY BÓNG RỔ VÀ THỂ THAO ĐỒNG ĐỘI",
    title: "HONOR SOCIETY",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
    link: "/shop?category=basketball",
  },
  {
    id: "col-3",
    tag: "PHONG CÁCH THỜI TRANG ĐƯỜNG PHỐ NĂNG ĐỘNG",
    title: "POWER MOVE",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    link: "/shop?category=training",
  },
];

const otherCollections = [
  {
    number: "01",
    name: "Run Essentials Sports",
    count: "30 sản phẩm",
    link: "/shop?category=running",
  },
  {
    number: "02",
    name: "Nike x Off-White (\"The Ten\")",
    count: "12 sản phẩm",
    link: "/shop?brand=Nike",
  },
  {
    number: "03",
    name: "Adidas x Kanye West (Yeezy)",
    count: "18 sản phẩm",
    link: "/shop?brand=Adidas",
  },
  {
    number: "04",
    name: "G-Dragon x Nike (Para-Noise)",
    count: "08 sản phẩm",
    link: "/shop?brand=Nike",
  },
];

const newShoes2026 = [
  {
    id: "prod-lebron-tr1",
    title: "Calibar TR1",
    sub: "Giày Nam",
    brand: "Nike",
    price: 3829000,
    colors: ["#111827", "#ffffff", "#78e000"],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-flex-train",
    title: "Nike Flex Train",
    sub: "Giày Nam",
    brand: "Nike",
    price: 2059000,
    colors: ["#1e293b", "#f8fafc", "#2563eb"],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-metcon-10",
    title: "Nike Metcon 10",
    sub: "Giày Nam",
    brand: "Nike",
    price: 1959000,
    colors: ["#ffffff", "#94a3b8", "#111827"],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-free-metcon-6",
    title: "Nike Free Metcon 6",
    sub: "Giày Nam",
    brand: "Nike",
    price: 2279000,
    colors: ["#2563eb", "#0f172a", "#1e3a8a"],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-af1-retro",
    title: "Nike Air Force 1 Retro",
    sub: "Giày Nam",
    brand: "Nike",
    price: 5279000,
    colors: ["#1e3a8a", "#0f172a", "#fef3c7"],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-air-max-dn8",
    title: "Nike Air Max Dn8 Leather",
    sub: "Giày Nam",
    brand: "Nike",
    price: 6179000,
    colors: ["#2563eb", "#0f172a", "#78350f"],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-zoom-leather",
    title: "Nike Zoom Leather",
    sub: "Giày Nam",
    brand: "Nike",
    price: 3129000,
    colors: ["#94a3b8", "#ffffff", "#1e293b"],
    img: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-vomero-5-men",
    title: "Nike Zoom Vomero 5",
    sub: "Giày Nam",
    brand: "Nike",
    price: 4419000,
    colors: ["#94a3b8", "#ffffff", "#1e293b"],
    img: "/images/hero_ultraboost.png",
  },
];

export default function HangMoiPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const addItemToCart = useCartStore((s) => s.addItemToCart);

  const heroSlides = [
    {
      title: "CITY WALKERS",
      subtitle:
        "Bộ sưu tập giày chạy bộ và thể thao đường phố mới nhất 2026 - Tối ưu bứt phá năng lượng.",
      image:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&auto=format&fit=crop&q=80",
      cta: "MUA NGAY",
      link: "#mau-moi-2026",
    },
    {
      title: "TRACK RECORD",
      subtitle:
        "Công nghệ đế đệm siêu nhẹ phản hồi năng lượng tối đa trên từng sải chân.",
      image:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1600&auto=format&fit=crop&q=80",
      cta: "KHÁM PHÁ NGAY",
      link: "/shop?category=running",
    },
  ];

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleQuickAdd = async (product: (typeof newShoes2026)[0], e: React.MouseEvent) => {
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

  const formatPrice = (p: number) => {
    return p.toLocaleString("vi-VN") + "₫";
  };

  const currentSlide = heroSlides[activeSlide];

  return (
    <div className="min-h-screen bg-white">
      {/* ========================================================
          1. HERO SLIDER BANNER: CITY WALKERS
      ======================================================== */}
      <section className="relative w-full h-[480px] sm:h-[560px] md:h-[640px] bg-[#001a2c] overflow-hidden flex items-center justify-center">
        {/* Background Slide Image */}
        <Image
          src={currentSlide.image}
          alt={currentSlide.title}
          fill
          priority
          className="object-cover object-center brightness-75 transition-opacity duration-700"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60 pointer-events-none" />

        {/* Content Box */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 text-center text-white space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none drop-shadow-lg">
            {currentSlide.title}
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-gray-200 font-medium leading-relaxed drop-shadow">
            {currentSlide.subtitle}
          </p>

          <div className="pt-2">
            <Link
              href={currentSlide.link}
              className="inline-block bg-white hover:bg-[#78e000] text-black font-black text-xs sm:text-sm px-10 py-3.5 rounded-none uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
            >
              {currentSlide.cta}
            </Link>
          </div>
        </div>

        {/* Slider Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center rounded-none transition-all active:scale-90"
          title="Previous slide"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextSlide}
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center rounded-none transition-all active:scale-90"
          title="Next slide"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicator Line */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 transition-all ${
                activeSlide === idx ? "w-10 bg-[#78e000]" : "w-4 bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          2. BỘ SƯU TẬP MỚI (3 Featured Collections)
      ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="text-left mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
            BỘ SƯU TẬP MỚI
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
            Khám phá các thiết kế mới nhất vừa cập bến tại cửa hàng. Từ công nghệ đệm khí tiên tiến
            đến phong cách thời trang đường phố ấn tượng.
          </p>
        </div>

        {/* 3 Column Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {featuredCollections.map((col) => (
            <div
              key={col.id}
              className="bg-white border border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Card Image */}
              <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-gray-100">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Info */}
              <div className="p-6 space-y-3">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                  {col.tag}
                </span>

                <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight group-hover:text-[#78e000] transition-colors">
                  {col.title}
                </h3>

                <div className="pt-2">
                  <Link
                    href={col.link}
                    className="inline-block bg-[#78e000] hover:bg-[#84cc16] text-black font-black text-xs px-6 py-2.5 rounded-none uppercase tracking-wider shadow-sm transition-transform hover:scale-105 active:scale-95"
                  >
                    Khám phá bộ sưu tập
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          3. CÁC BỘ SƯU TẬP NỔI BẬT KHÁC (4 Row List)
      ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20">
        <div className="text-left mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
            Các bộ sưu tập nổi bật khác
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
            Những phiên bản giới hạn hợp tác cùng các nghệ sĩ và thương hiệu quốc tế, mang lại phong
            cách khác biệt.
          </p>
        </div>

        <div className="space-y-3">
          {otherCollections.map((item) => (
            <Link
              key={item.number}
              href={item.link}
              className="bg-white hover:bg-gray-50 border border-gray-200 p-4 sm:p-5 flex items-center justify-between group transition-all shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="w-10 h-10 bg-gray-100 group-hover:bg-[#78e000] text-gray-700 group-hover:text-black font-black text-xs sm:text-sm flex items-center justify-center transition-colors">
                  {item.number}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-gray-900 group-hover:text-black transition-colors">
                  {item.name}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400 group-hover:text-black transition-colors font-semibold">
                <span>{item.count}</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. THƯƠNG HIỆU NỔI BẬT (Brand Logos Showcase)
      ======================================================== */}
      <BrandShowcase />

      {/* ========================================================
          5. MẪU MỚI 2026 (8 Shoes Grid)
      ======================================================== */}
      <section id="mau-moi-2026" className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Mẫu mới 2026
          </h2>
          <Link
            href="/shop"
            className="bg-[#78e000] hover:bg-[#84cc16] text-black font-black text-xs px-6 py-2.5 rounded-none uppercase tracking-wider shadow transition-transform hover:scale-105 active:scale-95"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>

        {/* 4 Columns x 2 Rows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newShoes2026.map((shoe) => (
            <div
              key={shoe.id}
              className="flex flex-col group cursor-pointer"
            >
              {/* Product Image Stage */}
              <Link
                href={`/product/${shoe.id}`}
                className="relative w-full aspect-[4/3] sm:aspect-square bg-[#f6f6f6] mb-3 overflow-hidden flex items-center justify-center"
              >
                <Image
                  src={shoe.img}
                  alt={shoe.title}
                  fill
                  className="object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Color Swatch Dots */}
              <div className="flex items-center gap-1.5 mb-2">
                {(shoe.colors || ["#000000", "#ffffff", "#2563eb", "#94a3b8"]).slice(0,4).map((color, cIdx) => (
                  <span
                    key={cIdx}
                    className="w-4 h-4 rounded-sm inline-block border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Title */}
              <Link href={`/product/${shoe.id}`} className="block">
                <h3 className="font-bold text-base sm:text-lg text-black group-hover:text-gray-600 transition-colors truncate">
                  {shoe.title}
                </h3>
              </Link>

              {/* Subtitle */}
              <p className="text-[15px] text-gray-500 font-normal mt-0.5 mb-2">{shoe.sub}</p>

              {/* Price Row */}
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-black">{formatPrice(shoe.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. MÔN THỂ THAO YÊU THÍCH (Running, Basketball, etc.)
      ======================================================== */}
      <FavoriteSportsSection />

      {/* ========================================================
          7. CAM KẾT DỊCH VỤ (4 Service Badges)
      ======================================================== */}
      <ServicesBanner />
    </div>
  );
}
