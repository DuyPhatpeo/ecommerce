"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface TopSneaker {
  id: string;
  name: string;
  price: string;
  image: string;
}

const sneakers: TopSneaker[] = [
  {
    id: "nike-reax-8",
    name: "Nike Reax 8",
    price: "1.000.000đ",
    image: "/images/hero_ultraboost.png",
  },
  {
    id: "nike-air-max-97",
    name: "Nike Shoes Air Max 97",
    price: "1.000.000đ",
    image: "/images/hero_ultraboost.png",
  },
  {
    id: "nike-terra-manta",
    name: "Nike Terra Manta - Đỏ",
    price: "1.000.000đ",
    image: "/images/hero_ultraboost.png",
  },
  {
    id: "nike-air-zoom",
    name: "Nike Air Zoom",
    price: "1.000.000đ",
    image: "/images/hero_ultraboost.png",
  },
];

export default function CategoryDiscovery() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
      {/* Title Header */}
      <div className="text-center mb-10">
        <span className="text-xs sm:text-sm font-extrabold uppercase text-gray-400 tracking-widest block mb-1">
          Ngay lúc này
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
          BẠN TÌM GÌ <span className="text-[#78e000]">HÔM NAY?</span>
        </h2>
      </div>

      {/* Subcategory Title */}
      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Top Sneaker
        </h3>
      </div>

      {/* 4 Vertical Sneaker Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sneakers.map((s) => (
          <Link
            key={s.id}
            href="/shop"
            className="relative bg-[#f8f9fa] hover:bg-white rounded-none p-6 flex flex-col justify-between border border-gray-100 hover:border-gray-300 hover:shadow-2xl transition-all duration-300 group overflow-hidden min-h-[420px]"
          >
            {/* Giant Vertical Watermark NIKE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.06] group-hover:opacity-[0.12] transition-opacity">
              <span className="text-9xl font-black rotate-90 tracking-widest text-black">
                NIKE
              </span>
            </div>

            {/* Sneaker Image */}
            <div className="relative w-full h-64 flex items-center justify-center z-10">
              <Image
                src={s.image}
                alt={s.name}
                fill
                className="object-contain p-2 drop-shadow-md"
              />
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 pt-4 border-t border-gray-200/60">
              <h4 className="font-extrabold text-sm sm:text-base text-gray-900 group-hover:text-[#78e000] transition-colors line-clamp-1">
                {s.name}
              </h4>
              <p className="text-sm font-black text-gray-900 mt-1">
                {s.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
