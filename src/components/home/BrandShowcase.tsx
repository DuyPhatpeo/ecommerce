"use client";

import React from "react";
import Link from "next/link";
import {
  SiAdidas,
  SiNike,
  SiPuma,
  SiUnderarmour,
} from "react-icons/si";

interface BrandItem {
  name: string;
  isSpecial?: boolean;
  icon?: React.ReactNode;
}

const brands: BrandItem[] = [
  { name: "Adidas", icon: <SiAdidas className="w-8 h-8" /> },
  { name: "Under Armour", icon: <SiUnderarmour className="w-8 h-8" /> },
  { name: "HOKA", icon: <span className="font-black text-xl tracking-tighter">HOKA</span> },
  { name: "asics", icon: <span className="font-black text-xl italic">asics</span> },
  { name: "Columbia", icon: <span className="font-extrabold text-lg">Columbia</span> },
  { name: "speedo", icon: <span className="font-bold text-lg tracking-wide">speedo</span> },
  { name: "Nike", icon: <SiNike className="w-9 h-9" /> },
  { name: "PUMA", icon: <SiPuma className="w-8 h-8" /> },
  { name: "Teva", icon: <span className="font-black text-xl">Teva</span> },
  { name: "On", icon: <span className="font-black text-xl">On</span> },
  { name: "crocs", icon: <span className="font-extrabold text-lg">crocs</span> },
  { name: "+30 thương hiệu", isSpecial: true },
];

export default function BrandShowcase() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-10">
      <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-wide mb-8">
        THƯƠNG HIỆU NỔI BẬT
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {brands.map((b, index) => (
          <Link
            key={index}
            href={`/shop?brand=${encodeURIComponent(b.name)}`}
            className={`h-24 rounded-none flex items-center justify-center p-4 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md ${
              b.isSpecial
                ? "bg-[#78e000] text-black font-black text-sm"
                : "bg-[#f1f3f5] hover:bg-[#e9ecef] text-gray-800"
            }`}
          >
            {b.isSpecial ? (
              <span className="text-center font-black tracking-wide">{b.name}</span>
            ) : (
              <div className="flex items-center justify-center transition-transform hover:scale-110">
                {b.icon}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
