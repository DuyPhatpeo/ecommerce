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
        <span className="text-base sm:text-lg font-extrabold uppercase text-gray-400 tracking-widest block mb-1">
          Ngay lúc này
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 uppercase tracking-tight">
          BẠN TÌM GÌ <span className="text-[#78e000]">HÔM NAY ?</span>
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
            className="relative bg-[#f1f2f4] rounded-md p-6 flex flex-col justify-between transition-all duration-300 group overflow-hidden h-[420px]"
          >
            {/* Giant Vertical Watermark NIKE */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span className="text-[130px] font-black rotate-90 tracking-widest text-black/[0.04]">
                NIKE
              </span>
            </div>

            {/* Sneaker Image */}
            <div className="relative w-full h-60 mt-4 flex items-center justify-center z-10">
              <Image
                src={s.image}
                alt={s.name}
                fill
                className="object-contain drop-shadow-2xl group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500"
              />
            </div>

            {/* Bottom Info */}
            <div className="relative z-10 mt-auto pb-2">
              <h4 className="font-bold text-lg text-black line-clamp-1">
                {s.name}
              </h4>
              <p className="text-[15px] font-medium text-gray-500 mt-1">
                {s.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
