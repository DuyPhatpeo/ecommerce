"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

const sports = [
  {
    name: "CHẠY BỘ",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&auto=format&fit=crop&q=80",
    href: "/shop?category=running",
  },
  {
    name: "BÓNG RỔ",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80",
    href: "/shop?category=basketball",
  },
  {
    name: "LUYỆN TẬP",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    href: "/shop?category=training",
  },
  {
    name: "TENNIS",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&auto=format&fit=crop&q=80",
    href: "/shop?category=tennis",
  },
];

export default function FavoriteSportsSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight mb-10">
        MÔN THỂ THAO YÊU THÍCH
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sports.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            className="relative h-96 rounded-none overflow-hidden group shadow-md flex items-end p-6"
          >
            <Image
              src={s.image}
              alt={s.name}
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between w-full">
              <span className="text-white font-black text-lg tracking-wider uppercase group-hover:text-primary transition-colors">
                {s.name}
              </span>
              <div className="w-8 h-8 rounded-none bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-primary group-hover:text-black transition-all">
                <FiChevronRight className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
