"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

interface ProductCardData {
  id: string;
  name: string;
  sub: string;
  price: string;
  image: string;
  colors?: string[];
}

const saleProducts: ProductCardData[] = [
  {
    id: "prod-lebron-tr1",
    name: "LeBron TR 1",
    sub: "Giày Nam",
    price: "3.829.000đ",
    image: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-flex-train",
    name: "Nike Flex Train",
    sub: "Giày Nam",
    price: "2.059.000đ",
    image: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-metcon-10",
    name: "Nike Metcon 10",
    sub: "Giày Nam",
    price: "1.959.000đ",
    image: "/images/hero_ultraboost.png",
  },
  {
    id: "prod-nike-free-metcon-6",
    name: "Nike Free Metcon 6",
    sub: "Giày Nam",
    price: "2.279.000đ",
    image: "/images/hero_ultraboost.png",
    colors: ["#2563eb", "#0f172a", "#1e3a8a"],
  },
  {
    id: "prod-nike-af1-retro",
    name: "Nike Air Force 1 Retro",
    sub: "Giày Nam",
    price: "5.279.000đ",
    image: "/images/hero_ultraboost.png",
    colors: ["#1e3a8a", "#0f172a", "#fef3c7"],
  },
  {
    id: "prod-nike-air-max-dn8",
    name: "Nike Air Max Dn8 Leather",
    sub: "Giày Nam",
    price: "6.179.000đ",
    image: "/images/hero_ultraboost.png",
    colors: ["#2563eb", "#0f172a", "#78350f"],
  },
];

export default function SaleTetSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight mb-3">
            GIÀY SALE TẾT – ƯU ĐÃI BÙNG NỔ ĐÓN XUÂN
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            Lấy cảm hứng từ những đường nét góc cạnh của kiến trúc, nghệ thuật và cuộc sống đô thị đương đại, các thiết kế của các thương hiệu tập trung vào: phom dáng chuẩn mực, màu sắc trung tính, chất liệu cao cấp và chi tiết tinh tế.
          </p>
        </div>
        <Link
          href="/shop"
          className="self-start md:self-auto inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-none shadow transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>

      {/* Main Grid: Left Banner (CSS/HTML) + 6 Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Festive Deal Banner coded purely in CSS / HTML */}
        <div className="lg:col-span-4 relative rounded-none overflow-hidden min-h-[480px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-[#800000] via-[#9e0c0c] to-[#420000] border border-red-500/30 group">
          {/* Decorative glowing festive background squares */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-yellow-500/20 rounded-none blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -left-10 w-48 h-48 bg-orange-600/30 rounded-none blur-2xl pointer-events-none" />

          {/* Top text block */}
          <div className="relative z-10">
            <span className="inline-block bg-primary text-black font-extrabold text-xs px-3.5 py-1.5 rounded-none uppercase tracking-wider shadow">
              DEAL HOT HÔM NAY
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-4 leading-tight drop-shadow-md">
              Ưu Đãi MÙA <br />
              <span className="text-yellow-400">Sale Tết:</span> <br />
              Giảm Lên Đến 50%
            </h3>
          </div>

          {/* Center Floating Sneaker on Glowing Stand */}
          <div className="relative z-10 my-6 flex flex-col items-center justify-center">
            <div className="relative w-64 h-40">
              <Image
                src="/images/hero_ultraboost.png"
                alt="Festive Sneaker Deal"
                fill
                className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]"
              />
            </div>
            {/* Glowing pedestal shadow */}
            <div className="w-48 h-5 bg-yellow-400/30 rounded-none blur-md mt-2 pointer-events-none" />
          </div>

          {/* Bottom CTA */}
          <div className="relative z-10 pt-4 border-t border-red-500/30 flex items-center justify-between">
            <span className="text-xs text-yellow-200 font-bold uppercase tracking-wider">
              Áp dụng cho 500+ sản phẩm
            </span>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-black text-white hover:text-yellow-400 transition-colors"
            >
              <span>Mua ngay</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right 6 Product Cards Grid (8 cols on lg) */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {saleProducts.map((p) => (
              <Link
                key={p.id}
                href="/shop"
                className="flex flex-col group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[4/3] sm:aspect-square mb-3 bg-[#f6f6f6] overflow-hidden flex items-center justify-center p-2">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain p-4 sm:p-6 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  {/* Color swatches if any */}
                  {p.colors && (
                    <div className="flex items-center gap-1.5 mb-2">
                      {p.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-sm border border-gray-200 inline-block"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  )}
                  <h3 className="font-bold text-base sm:text-lg text-black group-hover:text-gray-600 transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="text-[15px] text-gray-500 font-normal mt-0.5 mb-2">{p.sub}</p>
                  <p className="text-base font-bold text-black pt-1">{p.price}</p>
                </div>
              </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
