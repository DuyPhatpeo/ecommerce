"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiStar } from "react-icons/fi";
import { animate } from "animejs";

export default function HeroSection() {
  const sneakerRef = useRef<HTMLDivElement>(null);
  const glowTextRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Levitating / Floating Sneaker animation using Anime.js
    if (sneakerRef.current) {
      animate(sneakerRef.current, {
        translateY: [-14, 14],
        rotate: [-1.5, 1.5],
        duration: 3400,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      });
    }

    // Glow pulse on text
    if (glowTextRef.current) {
      animate(glowTextRef.current, {
        opacity: [0.94, 1],
        scale: [0.99, 1.01],
        duration: 2200,
        ease: "inOutQuad",
        loop: true,
        alternate: true,
      });
    }
  }, []);

  return (
    <section className="relative w-full h-[calc(100svh-116px)] md:h-[calc(100vh-124px)] min-h-[580px] max-h-[1000px] bg-[#001a2c] overflow-hidden flex flex-col justify-between">
      {/* Background Electric Lightning Banner */}
      <div className="absolute inset-0 z-0 opacity-85 pointer-events-none">
        <Image
          src="/images/banners/hero-lightning.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a2c]/90 via-transparent to-black/30" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full h-full flex flex-col justify-between px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10">
        {/* Giant Watermark / Glow Title: SOLAR YELLOW (Aligned Right as reference image) */}
        <div className="absolute right-6 sm:right-10 md:right-16 lg:right-20 top-[38%] md:top-[42%] -translate-y-1/2 z-10 text-right select-none pointer-events-none">
          <h1
            ref={glowTextRef}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[108px] xl:text-[124px] font-black leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_0_40px_rgba(116,214,0,0.5)]"
          >
            SOLAR <br />
            <span className="text-[#cbfb45]">YELLOW</span>
          </h1>
        </div>

        {/* Floating Center-Left Adidas Ultraboost Sneaker */}
        <div className="absolute left-[45%] sm:left-[42%] md:left-[38%] lg:left-[35%] top-[42%] sm:top-[44%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <div
            ref={sneakerRef}
            className="relative w-[310px] sm:w-[440px] md:w-[560px] lg:w-[680px] xl:w-[740px] h-[200px] sm:h-[280px] md:h-[360px] lg:h-[430px] drop-shadow-[0_25px_50px_rgba(0,0,0,0.92)] filter"
          >
            <Image
              src="/images/hero_ultraboost.png"
              alt="Adidas Ultraboost Solar Yellow"
              fill
              priority
              className="object-contain"
            />
            {/* Subtle neon shadow floor */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#78e000]/25 rounded-none blur-xl pointer-events-none" />
          </div>
        </div>

        {/* Spacer top */}
        <div className="w-full h-2" />

        {/* Bottom Content Row: Left info & Right Glassmorphic Card */}
        <div className="relative z-30 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-2">
          {/* Left Block: Description & CTA */}
          <div className="max-w-sm sm:max-w-md lg:max-w-lg text-left">
            <span className="text-white font-extrabold text-[11px] sm:text-xs tracking-widest uppercase block mb-1">
              BỘ SƯU TẬP MÙA HÈ 2025
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase mb-2 sm:mb-2.5 tracking-wide">
              ADIDAS ULTRABOOST
            </h2>
            <p className="text-gray-300 text-xs sm:text-[13px] leading-relaxed mb-4 sm:mb-5 line-clamp-3">
              Chào đón mùa hè rực rỡ với bộ sưu tập thời trang nam mang tinh thần năng động – thoải mái – cá tính. Lấy cảm hứng từ nhịp sống hiện đại và những chuyến phiêu lưu.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-black font-extrabold text-xs sm:text-sm px-6 sm:px-7 py-2.5 sm:py-3 rounded-none shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              Khám phá bộ sưu tập
            </Link>
          </div>

          {/* Right Block: Glassmorphic Product Card matching reference image */}
          <div className="w-full sm:w-auto self-end">
            <Link
              href="/shop"
              className="block p-[3px] bg-black/60 backdrop-blur-md border border-white/40 shadow-2xl transition-all duration-300 hover:border-white/70 group"
            >
              <div className="border border-white/70 px-5 py-3.5 sm:px-6 sm:py-4 flex items-center gap-5 sm:gap-6">
                {/* Floating sneaker thumbnail without dark background box */}
                <div className="relative w-28 h-20 sm:w-36 sm:h-24 flex-shrink-0 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">
                  <Image
                    src="/images/hero_ultraboost.png"
                    alt="Adidas Ultraboost Thumbnail"
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Details */}
                <div className="text-left pr-2">
                  <h4 className="text-white font-black text-sm sm:text-base tracking-wider uppercase leading-snug">
                    ADIDAS ULTRABOOST
                  </h4>
                  <p className="text-gray-300 text-xs sm:text-[13px] font-bold mt-0.5 mb-1.5 tracking-wide">
                    (3 MÀU)
                  </p>
                  <div className="flex items-center gap-1.5 mb-2 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className="w-4 h-4 fill-current stroke-none" />
                    ))}
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-white tracking-wide leading-none">
                    2.400.000
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
