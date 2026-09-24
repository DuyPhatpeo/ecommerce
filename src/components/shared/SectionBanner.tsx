import React from "react";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

interface SectionBannerProps {
  title: string;
  subtitle?: string;
  category?: string;
}

export default function SectionBanner({
  title,
  subtitle,
  category = "DINOSPORTS",
}: SectionBannerProps) {
  return (
    <div className="relative w-full bg-[#060b11] border-b border-gray-800 py-12 md:py-16 overflow-hidden">
      {/* Background Subtle Neon Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#78e000]/15 rounded-none blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 text-center">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          <Link href="/" className="hover:text-[#78e000] transition-colors">
            Trang Chủ
          </Link>
          <FiChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-[#78e000]">{category}</span>
          <FiChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-white">{title}</span>
        </nav>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
