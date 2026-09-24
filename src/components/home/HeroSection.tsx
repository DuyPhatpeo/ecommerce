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
        translateY: [-16, 16],
        rotate: [-2, 2],
        duration: 3500,
        ease: "inOutSine",
        loop: true,
        alternate: true,
      });
    }

    // Glow pulse on text
    if (glowTextRef.current) {
      animate(glowTextRef.current, {
        opacity: [0.92, 1],
        scale: [0.98, 1.02],
        duration: 2400,
        ease: "inOutQuad",
        loop: true,
        alternate: true,
      });
    }
  }, []);

  return (
    <section className="relative w-full min-h-[640px] lg:min-h-[760px] bg-[#050a0e] overflow-hidden flex flex-col justify-between pt-12 pb-14 px-6 sm:px-8 lg:px-12">
      {/* Background Electric Lightning Banner */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Image
          src="/images/banners/hero-lightning.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a0e] via-transparent to-black/40" />
      </div>

      {/* Center Giant Watermark / Glow Title: SOLAR YELLOW */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full text-center mt-2">
        <h1
          ref={glowTextRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase select-none drop-shadow-[0_0_35px_rgba(116,214,0,0.5)]"
          style={{ letterSpacing: "0.04em" }}
        >
          SOLAR <br className="sm:hidden" />
          <span className="text-[#cbfb45]">YELLOW</span>
        </h1>
      </div>

      {/* Floating Center Adidas Ultraboost Sneaker */}
      <div className="relative z-20 max-w-5xl mx-auto w-full flex items-center justify-center my-2 sm:my-6">
        <div ref={sneakerRef} className="relative w-[340px] sm:w-[500px] md:w-[650px] lg:w-[750px] h-[220px] sm:h-[320px] md:h-[400px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] filter">
          <Image
            src="/images/hero_ultraboost.png"
            alt="Adidas Ultraboost Solar Yellow"
            fill
            priority
            className="object-contain"
          />
          {/* Subtle neon shadow floor */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#78e000]/25 rounded-none blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Bottom Content Row: Left info & Right Glassmorphic Card */}
      <div className="relative z-30 max-w-[1440px] mx-auto w-full flex flex-col md:flex-row items-end justify-between gap-8 pt-4">
        {/* Left Block: Description & CTA */}
        <div className="max-w-xl text-left">
          <span className="text-white font-extrabold text-xs sm:text-sm tracking-widest uppercase block mb-1">
            BỘ SƯU TẬP MÙA HÈ 2025
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase mb-3 tracking-wide">
            ADIDAS ULTRABOOST
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
            Chào đón mùa hè rực rỡ với bộ sưu tập thời trang nam mang tinh thần năng động – thoải mái – cá tính, lấy cảm hứng từ nhịp sống hiện đại và những chuyến phiêu lưu.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-white hover:bg-gray-100 text-black font-extrabold text-xs sm:text-sm px-7 py-3 rounded-none shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Khám phá bộ sưu tập
          </Link>
        </div>

        {/* Right Block: Glassmorphic Product Card */}
        <div className="w-full md:w-auto">
          <Link
            href="/shop"
            className="glass-panel rounded-none p-4 sm:p-5 flex items-center gap-5 border border-white/20 hover:border-[#78e000]/60 transition-all group block shadow-2xl"
          >
            <div className="relative w-24 h-16 sm:w-28 sm:h-20 bg-black/40 rounded-none overflow-hidden p-1 flex-shrink-0">
              <Image
                src="/images/hero_ultraboost.png"
                alt="Adidas Ultraboost Thumbnail"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h4 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide">
                  ADIDAS ULTRABOOST
                </h4>
                <span className="text-gray-400 text-xs">(3 MÀU)</span>
              </div>
              <div className="flex items-center gap-1 my-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-lg sm:text-xl font-black text-white">
                2.400.000₫
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
