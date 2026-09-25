"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";

const showrooms = [
  "120 Đường Thể Thao Mẫu, Phường An Phú, TP. Thủ Đức, TP. Hồ Chí Minh",
  "450 Đại Lộ Tân Phong Mẫu, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh",
  "88 Phố Tràng Thi Mẫu, Phường Hàng Trống, Quận Hoàn Kiếm, Hà Nội",
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="relative w-full overflow-hidden text-gray-300 bg-[#001a2c]">
      {/* 1. Upper Footer: Newsletter & Showrooms */}
      <div className="border-b border-[#002b47] py-12 lg:py-14">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: Newsletter */}
            <div className="lg:col-span-6">
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-2.5">
                VÀ ĐÃ KHÁC BIỆT!
              </h3>
              <p className="text-gray-300 text-xs sm:text-[13px] leading-relaxed mb-5 max-w-xl">
                Cảm ơn bạn đã đồng hành cùng <strong className="text-white">DINOSPORTS</strong> trên hành trình tập luyện. Đón nhận tin tức mới nhất về các sản phẩm và sự kiện thể thao từ chúng tôi.
              </p>

              {subscribed ? (
                <div className="bg-[#78e000]/15 border border-[#78e000] text-[#78e000] px-4 py-3 rounded-none text-xs font-bold inline-block">
                  ✓ Cảm ơn bạn đã đăng ký nhận tin của DINOSPORTS!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2.5 max-w-lg">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập địa chỉ email của bạn"
                    className="flex-1 bg-[#00223a] border border-[#003554] rounded-none px-4 py-2.5 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:border-[#78e000]"
                  />
                  <button
                    type="submit"
                    className="bg-[#78e000] hover:bg-[#84cc16] text-black font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-none shadow transition-transform active:scale-95 whitespace-nowrap"
                  >
                    Đăng ký
                  </button>
                </form>
              )}

              <p className="text-[11px] text-gray-400 mt-3">
                Bằng cách nhấn nút Đăng ký, bạn đồng ý với chính sách bảo mật và điều khoản của chúng tôi.
              </p>
            </div>

            {/* Right: Showrooms */}
            <div className="lg:col-span-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center lg:justify-end">
              {/* Showroom Image Thumbnail */}
              <div className="relative w-44 sm:w-52 h-28 sm:h-32 rounded-none overflow-hidden border border-gray-700/80 flex-shrink-0 shadow-md">
                <Image
                  src="/images/showroom_store.jpg"
                  alt="DINOSPORTS Showroom"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Showroom Address List */}
              <div className="space-y-2.5 max-w-sm">
                <h4 className="text-xs font-black text-white tracking-wider uppercase mb-2">
                  HỆ THỐNG SHOWROOM TRÊN TOÀN QUỐC
                </h4>
                {showrooms.map((address, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <FiMapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-gray-300 leading-snug">
                      {address}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Footer: Background Image footer-flex.png + 3 Columns of Links */}
      <div className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center">
        {/* Full-width Background Image: footer-flex.png */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banners/footer-flex.png"
            alt="Footer Background"
            fill
            priority
            className="object-cover object-right lg:object-center"
          />
        </div>

        {/* Content Container on top of background */}
        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 sm:px-8 lg:px-12 py-20 md:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:w-[60%] gap-8 sm:gap-12">
            {/* Column 1: SHOP */}
            <div>
              <h4 className="text-white font-black text-sm tracking-wider uppercase mb-4 drop-shadow-sm">
                SHOP
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px] text-gray-200 font-medium drop-shadow-sm">
                {["Nike", "Adidas", "Under Armour", "New Balance", "MLB", "Puma", "Fila", "Converse"].map((item) => (
                  <li key={item}>
                    <Link href={`/shop?brand=${encodeURIComponent(item)}`} className="hover:text-[#78e000] transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: DINOSPORTS */}
            <div>
              <h4 className="text-white font-black text-sm tracking-wider uppercase mb-4 drop-shadow-sm">
                DINOSPORTS
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px] text-gray-200 font-medium drop-shadow-sm">
                {[
                  { name: "Giới thiệu", href: "/about-us" },
                  { name: "Tin tức thời trang", href: "/news" },
                  { name: "Tuyển dụng", href: "/about-us#careers" },
                  { name: "Liên hệ với chúng tôi", href: "/contact" },
                  { name: "Cửa hàng của chúng tôi", href: "#showroom-section" },
                  { name: "Câu hỏi thường gặp", href: "/faq" },
                  { name: "Khách hàng thân thiết", href: "/account" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-[#78e000] transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: TRUNG TÂM TRỢ GIÚP */}
            <div>
              <h4 className="text-white font-black text-sm tracking-wider uppercase mb-4 drop-shadow-sm">
                TRUNG TÂM TRỢ GIÚP
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-[13px] text-gray-200 font-medium drop-shadow-sm">
                {[
                  { name: "Theo dõi đơn hàng", href: "/account" },
                  { name: "Chính sách đổi hàng", href: "/faq" },
                  { name: "Chính sách bảo mật", href: "/about-us#privacy" },
                  { name: "Facebook", href: "https://facebook.com" },
                  { name: "Instagram", href: "https://instagram.com" },
                  { name: "Youtube", href: "https://youtube.com" },
                  { name: "Tiktok", href: "https://tiktok.com" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="hover:text-[#78e000] transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Footer Copyright Bar */}
      <div className="bg-[#001422] border-t border-[#002b47] py-4 text-xs text-gray-400">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Vietnam Flag Badge */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-5 h-3.5 bg-[#da251d] rounded-none relative flex items-center justify-center shadow overflow-hidden">
              <span className="text-yellow-400 text-[10px] leading-none">★</span>
            </div>
            <span className="font-bold text-white text-xs">Việt Nam</span>
          </div>

          {/* Links & Copyright */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-400">
            <Link href="/about-us#privacy" className="hover:text-[#78e000] transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/about-us#terms" className="hover:text-[#78e000] transition-colors">
              Điều khoản sử dụng
            </Link>
            <span className="text-white font-semibold">
              Copyright © 2026 WiPIX Templates | All Rights Reserved
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
