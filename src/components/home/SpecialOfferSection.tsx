"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "@/components/shared/ProductCard";

const saleProducts = [
  {
    id: "prod-lebron-tr1",
    title: "LeBron TR 1",
    img: "/images/hero_ultraboost.png",
    salePrice: 3829000,
    regularPrice: 4200000,
    stock: 10,
  },
  {
    id: "prod-nike-flex-train",
    title: "Nike Flex Train",
    img: "/images/hero_ultraboost.png",
    salePrice: 2059000,
    regularPrice: 2500000,
    stock: 15,
  },
  {
    id: "prod-nike-metcon-10",
    title: "Nike Metcon 10",
    img: "/images/hero_ultraboost.png",
    salePrice: 1959000,
    regularPrice: 2400000,
    stock: 20,
  },
  {
    id: "prod-nike-free-metcon-6",
    title: "Nike Free Metcon 6",
    img: "/images/hero_ultraboost.png",
    salePrice: 2279000,
    regularPrice: 2800000,
    stock: 5,
  },
  {
    id: "prod-nike-af1-retro",
    title: "Nike Air Force 1 Retro",
    img: "/images/hero_ultraboost.png",
    salePrice: 5279000,
    regularPrice: 5279000,
    stock: 8,
  },
  {
    id: "prod-nike-air-max-dn8",
    title: "Nike Air Max Dn8 Leather",
    img: "/images/hero_ultraboost.png",
    salePrice: 6179000,
    regularPrice: 7000000,
    stock: 12,
  },
];

export default function SpecialOfferSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight mb-3">
            ƯU ĐÃI ĐẶC QUYỀN – NÂNG TẦM TRẢI NGHIỆM
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
        {/* Left Special Deal Banner coded purely in CSS / HTML */}
        <div className="lg:col-span-4 relative rounded-none overflow-hidden min-h-[480px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-dark-card via-dark to-dark-deep border border-dark-border group">
          {/* Decorative glowing background squares */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/20 rounded-none blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 -left-10 w-48 h-48 bg-blue-500/20 rounded-none blur-2xl pointer-events-none" />

          {/* Top text block */}
          <div className="relative z-10">
            <span className="inline-block bg-primary text-black font-extrabold text-xs px-3.5 py-1.5 rounded-none uppercase tracking-wider shadow">
              DEAL HOT HÔM NAY
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-4 leading-tight drop-shadow-md">
              BỘ SƯU TẬP <br />
              <span className="text-primary">Độc Quyền:</span> <br />
              Giảm Lên Đến 50%
            </h3>
          </div>

          {/* Center Floating Sneaker */}
          <div className="relative z-10 my-8 flex flex-col items-center justify-center flex-1">
            <div className="relative w-80 h-56 sm:w-96 sm:h-64 transition-transform duration-500 group-hover:scale-105">
              <Image
                src="/images/hero_ultraboost.png"
                alt="Special Deal Sneaker"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="relative z-10 pt-4 border-t border-dark-border flex items-center justify-between">
            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">
              Áp dụng cho 500+ sản phẩm
            </span>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-black text-white hover:text-primary transition-colors"
            >
              <span>Mua ngay</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right 6 Product Cards Grid (8 cols on lg) */}
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {saleProducts.map((p) => (
            <ProductCard key={p.id} data={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
