"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCheck, FiStar, FiMapPin, FiPhone } from "react-icons/fi";
import { SiNike, SiAdidas, SiPuma, SiUnderarmour } from "react-icons/si";
import FavoriteSportsSection from "@/components/home/FavoriteSportsSection";
import ServicesBanner from "@/components/home/ServicesBanner";

const customerPhotos = [
  "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80",
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ========================================================
          1. HERO SHOWROOM BANNER WITH BRAND BADGE
      ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-16">
        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden bg-gray-100 shadow-sm">
          {/* Background Showroom Image */}
          <Image
            src="/images/showroom_store.jpg"
            alt="Không gian Showroom DINOSPORTS"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Brand Card Overlay on Bottom Left */}
          <div className="absolute bottom-0 left-0 bg-white pt-6 pr-12 pb-6 pl-6 sm:pt-8 sm:pr-16 sm:pb-8 sm:pl-10 rounded-tr-[40px] md:rounded-tr-[60px] z-10 flex items-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-dark tracking-tight mb-0">
              DINO<span className="font-black">SPORTS</span>
            </h2>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. MISSION & VISION STATEMENT (DEEP NAVY ACCENT SECTION)
      ======================================================== */}
      <section className="bg-dark text-white py-16 sm:py-20">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
          {/* Main Statement Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-5xl tracking-tight">
            DINOSPORTS nơi khách hàng tìm thấy những{" "}
            <span className="text-primary underline underline-offset-8 decoration-2 decoration-primary">
              sản phẩm chất lượng – hợp xu hướng – đúng cá tính
            </span>
            , đồng hành cùng phong cách sống năng động
          </h1>

          {/* 2 Sub-Columns: Tầm nhìn & Cảm xúc */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 pt-8 border-t border-gray-800">
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black uppercase text-gray-400 tracking-widest">
                Tầm nhìn
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Trở thành hệ thống bán lẻ và phân phối các sản phẩm giày và thời trang thể thao
                chính hãng hàng đầu tại Việt Nam, mang đẳng cấp quốc tế đến gần hơn với mọi vận động
                viên và người yêu thể thao.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-black uppercase text-gray-400 tracking-widest">
                Cảm xúc
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Chúng tôi không chỉ bán giày thể thao – chúng tôi mang đến niềm hứng khởi, sự tự tin
                và năng lượng bứt phá mỗi khi bạn xỏ giày bước ra đường chạy hay sân thi đấu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. SHOWROOM & STAFF GALLERY COLLAGE
      ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Left Column: Team & Customer fitting (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6 sm:gap-8">
            {/* Top Team Photo */}
            <div className="relative w-full h-72 sm:h-80 bg-gray-100 overflow-hidden shadow-sm">
              <Image
                src="/images/we_fit_together.jpg"
                alt="Đội ngũ nhân sự DINOSPORTS"
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Bottom 2 Photos */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="relative w-full h-56 sm:h-64 bg-gray-100 overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80"
                  alt="Tư vấn chọn size giày chuẩn xác"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="relative w-full h-56 sm:h-64 bg-gray-100 overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"
                  alt="Trải nghiệm giày thực tế"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Tall Sneaker Showroom with *300+ Badge (5 cols on lg) */}
          <div className="lg:col-span-5 relative min-h-[460px] sm:min-h-[560px] bg-gray-900 overflow-hidden shadow-sm flex items-end p-6 sm:p-8">
            <Image
              src="/images/showroom_crescent.jpg"
              alt="Hệ thống kệ giày chính hãng tại DINOSPORTS"
              fill
              className="object-cover object-center brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Green Stat Badge */}
            <div className="relative z-10 bg-dark/85 backdrop-blur-sm border border-primary/40 p-6 sm:p-7 max-w-xs text-white">
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tight block mb-1">
                *300+
              </span>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                Đôi giày chính hãng
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Sẵn sàng tại toàn bộ hệ thống showroom trên toàn quốc
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. CREDENTIALS & ACHIEVEMENTS INFO BOX
      ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-20">
        <div className="bg-[#f8f9fa] border border-gray-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-center">
            {/* 1. Left Headline */}
            <div className="space-y-2 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase leading-snug tracking-tight">
                ĐƠN VỊ PHÂN PHỐI THỂ THAO HÀNG ĐẦU TẠI VIỆT NAM
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Đồng hành cùng hàng chục nghìn runner và vận động viên chuyên nghiệp.
              </p>
            </div>

            {/* 2. Center Commitments */}
            <div className="space-y-3 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0 md:pr-6">
              <p className="text-xs sm:text-sm text-gray-700 font-semibold leading-relaxed">
                Cam kết mang đến cho cộng đồng những sản phẩm chất lượng cao nhất từ các thương hiệu
                thể thao danh tiếng thế giới.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-600 font-medium">
                <li className="flex items-center gap-2">
                  <FiCheck className="text-primary stroke-[3]" />
                  <span>Top 100 Thương hiệu thể thao tin cậy 2026</span>
                </li>
                <li className="flex items-center gap-2">
                  <FiCheck className="text-primary stroke-[3]" />
                  <span>Hệ thống showroom tiện nghi tại Hà Nội và TP.HCM</span>
                </li>
              </ul>
            </div>

            {/* 3. Right Stats & Brand Logos */}
            <div className="space-y-4">
              <div className="flex items-center gap-5 text-gray-800">
                <SiNike className="w-6 h-6" />
                <SiAdidas className="w-6 h-6" />
                <SiPuma className="w-6 h-6" />
                <SiUnderarmour className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xl sm:text-2xl font-black text-gray-900 block">
                  20,000+
                </span>
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                  Khách hàng tin dùng mỗi năm
                </span>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                <strong>100% Chính hãng:</strong> Cam kết hoàn tiền 200% giá trị đơn hàng nếu phát
                hiện hàng giả, bảo vệ sức khỏe và niềm tin trọn vẹn của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. TRẢI NGHIỆM THẬT – CẢM NHẬN THẬT (REVIEWS & COLLAGE)
      ======================================================== */}
      <section className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Customer Photos Grid (6 cols on lg) */}
          <div className="lg:col-span-6 grid grid-cols-4 gap-2.5 sm:gap-3">
            {customerPhotos.map((photo, index) => (
              <div
                key={index}
                className="relative h-28 sm:h-36 bg-gray-100 overflow-hidden border border-gray-100 shadow-sm hover:scale-105 transition-transform"
              >
                <Image
                  src={photo}
                  alt={`Khách hàng DINOSPORTS ${index + 1}`}
                  fill
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>

          {/* Right: Review Details & Quotation (6 cols on lg) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-black px-3.5 py-1 text-xs font-black uppercase tracking-wider">
              <FiCheck className="stroke-[3]" />
              <span>Được chứng thực từ hơn 10.000+ khách hàng</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight">
              Trải nghiệm thật – Cảm nhận thật
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Những phản hồi chân thực từ cộng đồng người yêu thể thao là động lực lớn nhất để{" "}
              <strong>DINOSPORTS</strong> không ngừng hoàn thiện chất lượng dịch vụ và sản phẩm mỗi
              ngày.
            </p>

            {/* Review Quote Card */}
            <div className="bg-[#f8f9fa] border-l-4 border-primary p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="fill-current w-4 h-4" />
                ))}
              </div>

              <blockquote className="text-sm sm:text-base text-gray-800 font-bold leading-relaxed italic">
                “Giày chính hãng, form đẹp, mang rất êm chân. Nhân viên tư vấn nhiệt tình, giúp mình
                đo size chân chuẩn xác và chọn được đôi giày ưng ý nhất cho mùa giải marathon vừa
                qua. Chắc chắn sẽ tiếp tục ủng hộ DINOSPORTS!”
              </blockquote>

              <div className="flex items-center gap-3 pt-2">
                <div className="relative w-10 h-10 bg-gray-300 overflow-hidden shrink-0 border border-gray-200">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
                    alt="Anh Minh"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-gray-900">Anh Minh</h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Vận động viên marathon phong trào
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. MÔN THỂ THAO YÊU THÍCH (Running, Basketball, Tennis)
      ======================================================== */}
      <FavoriteSportsSection />

      {/* ========================================================
          7. CAM KẾT DỊCH VỤ (4 Service Badges)
      ======================================================== */}
      <ServicesBanner />
    </div>
  );
}
