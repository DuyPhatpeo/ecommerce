"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FlashDealSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 14,
    minutes: 36,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => n.toString().padStart(2, "0");

  return (
    <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16">
      <div className="bg-[#0b141f] rounded-none p-8 sm:p-12 lg:p-14 text-white relative overflow-hidden shadow-2xl border border-gray-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Countdown (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block bg-[#78e000] text-black font-extrabold text-xs px-3.5 py-1.5 rounded-none uppercase tracking-wider">
              SẢN PHẨM KHUYẾN MÃI HÔM NAY
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Li-Ning Ultra-Light Cushion
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Mẫu giày chạy bộ nổi bật của Li-Ning, được thiết kế dành cho runner mong muốn cảm giác nhẹ nhàng, linh hoạt và phản hồi năng lượng tốt trên mọi bước chạy. Đây là lựa chọn hoàn hảo cho bạn từ buổi chạy hằng ngày đến các buổi chạy dài cự ly trung bình.
            </p>

            <div>
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-black font-extrabold text-xs sm:text-sm px-7 py-3 rounded-none shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Khám phá sản phẩm
              </Link>
            </div>

            {/* Countdown Timer Block */}
            <div className="pt-6 border-t border-gray-800">
              <div className="flex items-center gap-3 sm:gap-5">
                {/* Days */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-wider">
                    {formatNum(timeLeft.days)}
                  </div>
                  <div className="text-[11px] text-gray-400 font-bold uppercase mt-1">
                    Ngày
                  </div>
                </div>

                <span className="text-2xl font-bold text-gray-600 mb-4">:</span>

                {/* Hours */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-wider">
                    {formatNum(timeLeft.hours)}
                  </div>
                  <div className="text-[11px] text-gray-400 font-bold uppercase mt-1">
                    Tiếng
                  </div>
                </div>

                <span className="text-2xl font-bold text-gray-600 mb-4">:</span>

                {/* Minutes */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-white tracking-wider">
                    {formatNum(timeLeft.minutes)}
                  </div>
                  <div className="text-[11px] text-gray-400 font-bold uppercase mt-1">
                    Phút
                  </div>
                </div>

                <span className="text-2xl font-bold text-gray-600 mb-4">:</span>

                {/* Seconds */}
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-black text-[#78e000] tracking-wider">
                    {formatNum(timeLeft.seconds)}
                  </div>
                  <div className="text-[11px] text-[#78e000] font-bold uppercase mt-1">
                    Giây
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Runner Image + 3 Thumbnails (7 cols on lg) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4 items-stretch">
            {/* Main Runner Image (8 cols on sm) */}
            <div className="sm:col-span-8 relative rounded-none overflow-hidden min-h-[360px] sm:min-h-[460px] bg-[#162231] shadow-inner group">
              <Image
                src="https://images.unsplash.com/photo-1486218119243-13883505764c?w=1000&auto=format&fit=crop&q=80"
                alt="Li-Ning Athlete Runner"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* 3 Thumbnails Stacked (4 cols on sm) */}
            <div className="sm:col-span-4 flex flex-row sm:flex-col gap-4">
              <div className="flex-1 relative rounded-none overflow-hidden min-h-[110px] sm:min-h-[140px] bg-white p-2">
                <Image
                  src="/images/hero_ultraboost.png"
                  alt="Li-Ning Top View"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 relative rounded-none overflow-hidden min-h-[110px] sm:min-h-[140px] bg-white p-2">
                <Image
                  src="/images/hero_ultraboost.png"
                  alt="Li-Ning Side View"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 relative rounded-none overflow-hidden min-h-[110px] sm:min-h-[140px] bg-white p-2">
                <Image
                  src="/images/hero_ultraboost.png"
                  alt="Li-Ning Sole View"
                  fill
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
