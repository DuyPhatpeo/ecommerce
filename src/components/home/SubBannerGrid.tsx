"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function SubBannerGrid() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch w-full">
        {/* ========================================================
            1. LEFT LARGE BANNER: NIKE ZOOM FLY 6 (TENNIS)
        ======================================================== */}
        <div className="lg:col-span-6 relative rounded-none overflow-hidden flex flex-col justify-end p-6 sm:p-8 lg:p-10 shadow-md min-h-[480px] sm:min-h-[560px] lg:min-h-0 lg:h-full bg-[#001a2c] group">
          <Image
            src="/images/banners/nike-tennis-zoomfly.png"
            alt="BST Giày Nam Tennies Nike Zoom Fly 6"
            fill
            priority
            className="object-cover object-top sm:object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-md">
            <span className="inline-block text-white font-extrabold text-[11px] sm:text-xs tracking-wider uppercase mb-1 drop-shadow">
              BST GIÀY NAM TENNIES
            </span>
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase mb-3 leading-tight tracking-tight drop-shadow-md">
              NIKE ZOOM <br />
              FLY 6
            </h3>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-6 drop-shadow">
              Được thiết kế dành cho những runner muốn cải thiện tốc độ, duy trì nhịp chạy ổn định và tối ưu năng lượng trong suốt quá trình tập luyện hoặc thi đấu.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#78e000] hover:bg-[#84cc16] text-black font-extrabold text-xs sm:text-sm px-7 py-3 rounded-none shadow-lg transition-colors active:scale-95"
            >
              Khám phá bộ sưu tập
            </Link>
          </div>
        </div>

        {/* ========================================================
            2. RIGHT COLUMN: 2 TOP CARDS + 1 BOTTOM WIDE CARD
        ======================================================== */}
        <div className="lg:col-span-6 flex flex-col gap-5 sm:gap-6 justify-between">
          {/* Top Row: Men and Women Apparel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {/* Card Men: Thời Trang Thể Thao Nam */}
            <div className="relative rounded-none overflow-hidden aspect-[1.35/1] min-h-[240px] p-6 flex flex-col justify-end group shadow-md bg-neutral-900">
              <Image
                src="/images/banners/apparel-men.png"
                alt="Thời Trang Thể Thao Nam"
                fill
                className="object-cover object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/30 to-transparent pointer-events-none" />

              <div className="relative z-10 text-right ml-auto max-w-[210px]">
                <h4 className="text-base sm:text-lg font-black text-white uppercase leading-snug drop-shadow">
                  Thời Trang Thể <br />
                  Thao Nam
                </h4>
                <p className="text-gray-200 text-[11px] sm:text-xs leading-relaxed my-2 drop-shadow">
                  Được thiết kế để tối ưu hiệu suất vận động và vẫn đảm bảo tính thẩm mỹ trong mọi hoàn cảnh.
                </p>
                <Link
                  href="/shop?category=men"
                  className="inline-block text-xs sm:text-[13px] font-bold text-white border-b-2 border-white pb-0.5 hover:text-[#78e000] hover:border-[#78e000] transition-colors"
                >
                  Mua sắm ngay
                </Link>
              </div>
            </div>

            {/* Card Women: Thời Trang Thể Thao Nữ */}
            <div className="relative rounded-none overflow-hidden aspect-[1.35/1] min-h-[240px] p-6 flex flex-col justify-end group shadow-md bg-[#e69824]">
              <Image
                src="/images/banners/apparel-women.png"
                alt="Thời Trang Thể Thao Nữ"
                fill
                className="object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 text-left mr-auto max-w-[210px]">
                <h4 className="text-base sm:text-lg font-black text-white uppercase leading-snug drop-shadow">
                  Thời Trang Thể <br />
                  Thao Nữ
                </h4>
                <p className="text-gray-100 text-[11px] sm:text-xs leading-relaxed my-2 drop-shadow">
                  Được nghiên cứu form dáng phù hợp mọi vóc dáng giúp tôn dáng, thoải mái
                </p>
                <Link
                  href="/shop?category=women"
                  className="inline-block text-xs sm:text-[13px] font-bold text-white border-b-2 border-white pb-0.5 hover:text-[#78e000] hover:border-[#78e000] transition-colors"
                >
                  Mua sắm ngay
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Wide Card: BST sneaker cho cặp đôi “WE FIT TOGETHER” */}
          <div className="relative rounded-none overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 group shadow-sm bg-white border border-gray-100 flex-1 min-h-[260px]">
            {/* Left Content */}
            <div className="relative z-10 max-w-xs sm:max-w-sm text-left">
              <span className="text-[#a83820] font-bold text-[11px] sm:text-xs uppercase tracking-wider block mb-1">
                BST sneaker cho cặp đôi
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
                “WE FIT TOGETHER”
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                Form dáng hài hòa cho cả nam và nữ, màu sắc trung tính dễ phối đồ
              </p>
              <Link
                href="/shop"
                className="inline-block text-xs sm:text-sm font-extrabold text-black border-b-2 border-black pb-0.5 hover:text-[#78e000] hover:border-[#78e000] transition-colors"
              >
                Mua sắm ngay
              </Link>
            </div>

            {/* Right Sneaker Image */}
            <div className="relative w-64 sm:w-72 md:w-80 h-40 sm:h-48 md:h-52 flex-shrink-0">
              <Image
                src="/images/we_fit_sneaker.jpg"
                alt="Nike Air Force 1 Wheat Maroon Sneaker"
                fill
                className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
