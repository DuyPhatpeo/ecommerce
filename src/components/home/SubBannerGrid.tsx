"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function SubBannerGrid() {
  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Large Banner: Nike Zoom Fly 6 (5 cols on lg) */}
        <div className="lg:col-span-6 relative rounded-none overflow-hidden min-h-[500px] lg:min-h-[620px] flex flex-col justify-end p-8 sm:p-10 group shadow-xl">
          <Image
            src="/images/banners/nike-tennis-zoomfly.png"
            alt="BST Giày Nam Tennis Nike Zoom Fly 6"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-lg">
            <span className="inline-block text-white font-extrabold text-xs tracking-wider uppercase mb-1 drop-shadow">
              BST GIÀY NAM TENNIS
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white uppercase mb-3 tracking-wide drop-shadow-md">
              NIKE ZOOM FLY 6
            </h3>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-6 drop-shadow">
              Được thiết kế dành cho những runner muốn cải thiện tốc độ, duy trì nhịp chuyển động và tối ưu năng lượng trong suốt quá trình tập luyện hoặc thi đấu.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#78e000] hover:bg-[#84cc16] text-black font-extrabold text-xs sm:text-sm px-6 py-3 rounded-none shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Khám phá bộ sưu tập
            </Link>
          </div>
        </div>

        {/* Right Section: 2 Top Cards + 1 Bottom Wide Card (6 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Top Row: Men and Women Apparel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card Men */}
            <div className="relative rounded-none overflow-hidden min-h-[280px] p-6 flex flex-col justify-end group shadow-md">
              <Image
                src="/images/banners/apparel-men.png"
                alt="Thời Trang Thể Thao Nam"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-lg font-black text-white mb-1 drop-shadow">
                  Thời Trang Thể Thao Nam
                </h4>
                <p className="text-gray-200 text-xs line-clamp-2 leading-relaxed mb-3 drop-shadow">
                  Được thiết kế để tối ưu hiệu suất vận động và vẫn đảm bảo tính thẩm mỹ trong mọi hoàn cảnh.
                </p>
                <Link
                  href="/shop?category=men"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#78e000] transition-colors"
                >
                  <span>Mua sắm ngay</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card Women */}
            <div className="relative rounded-none overflow-hidden min-h-[280px] p-6 flex flex-col justify-end group shadow-md">
              <Image
                src="/images/banners/apparel-women.png"
                alt="Thời Trang Thể Thao Nữ"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h4 className="text-lg font-black text-white mb-1 drop-shadow">
                  Thời Trang Thể Thao Nữ
                </h4>
                <p className="text-gray-200 text-xs line-clamp-2 leading-relaxed mb-3 drop-shadow">
                  Được nghiên cứu form dáng phù hợp mọi vóc dáng giúp tôn dáng, thoải mái.
                </p>
                <Link
                  href="/shop?category=women"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#78e000] transition-colors"
                >
                  <span>Mua sắm ngay</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Card: Couple Sneaker "WE FIT TOGETHER" */}
          <div className="relative rounded-none overflow-hidden min-h-[270px] lg:flex-1 p-6 sm:p-8 flex flex-col justify-center group shadow-md bg-[#f6f2ee] border border-gray-200">
            <Image
              src="/images/we_fit_together.jpg"
              alt="We Fit Together Couple Sneaker"
              fill
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f6f2ee] via-[#f6f2ee]/85 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-xs sm:max-w-sm">
              <span className="text-red-600 font-extrabold text-xs uppercase tracking-wider block mb-1">
                BST sneaker cho cặp đôi
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
                “WE FIT TOGETHER”
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                Form dáng hài hòa cho cả nam và nữ, màu sắc trung tính dễ phối đồ.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-black text-gray-900 hover:text-[#78e000] transition-colors"
              >
                <span>Mua sắm ngay</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
